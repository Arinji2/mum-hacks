import os

# --- API KEY SETUP ---
# Ideally, move this to a .env file, but for now, we set it here.
if "GEMINI_API_KEY" not in os.environ:
    os.environ["GEMINI_API_KEY"] = "Insert API Key Here"

from typing import TypedDict, List, Dict, Optional
import json
import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from scipy.special import softmax
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from datetime import datetime
from tqdm import tqdm

# ============================================================================
# CONFIGURATION
# ============================================================================

CONFIG = {
    "csv_path": "",  # Will be set dynamically
    "text_column": "content",  # Matches the column sent by FastAPI
    "gemini_model": "gemini-2.0-flash",
    "roberta_model": "cardiffnlp/twitter-roberta-base-sentiment"
}


# ============================================================================
# 1. STATE DEFINITION
# ============================================================================

class GraphState(TypedDict):
    """TypedDict for carrying information between graph nodes."""
    csv_data: List[Dict]
    sentiment_score: str
    reasoning_summary: str
    input_file_path: str
    model_predictions: List[Dict]
    row_count: int
    sentiment_distribution: Dict
    final_sentiment_score: Optional[str]
    average_sentiment_scores: Optional[Dict[str, float]]
    final_detailed_predictions: Optional[List[Dict]]
    final_metadata: Optional[Dict]


# ============================================================================
# ROBERTA MODEL HANDLER
# ============================================================================

class RoBERTaModelHandler:
    """Handles RoBERTa sentiment analysis model."""

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.model_name = CONFIG["roberta_model"]

    def load_model(self):
        """Load the RoBERTa model and tokenizer."""
        print(f"[MODEL] Loading RoBERTa model: {self.model_name}")
        # Only load if not already in memory
        if self.model is None:
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
                self.model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
                print("[MODEL] \u2713 RoBERTa model loaded successfully")
            except Exception as e:
                raise RuntimeError(f"Failed to load RoBERTa model: {e}")

    def polarity_scores(self, text: str) -> Dict[str, float]:
        """Analyze sentiment of a single text using RoBERTa."""
        try:
            # Handle empty or non-string inputs
            if not isinstance(text, str) or not text.strip():
                return {'roberta_neg': 0.0, 'roberta_neu': 1.0, 'roberta_pos': 0.0}

            encoded_text = self.tokenizer(
                text,
                return_tensors='pt',
                truncation=True,
                max_length=512
            )
            output = self.model(**encoded_text)
            scores = softmax(output.logits[0].detach().numpy())

            return {
                'roberta_neg': float(scores[0]),
                'roberta_neu': float(scores[1]),
                'roberta_pos': float(scores[2])
            }
        except Exception as e:
            print(f"[MODEL] Warning: Error analyzing text: {e}")
            return {'roberta_neg': 0.33, 'roberta_neu': 0.34, 'roberta_pos': 0.33}

    def predict_batch(self, texts: List[str]) -> List[Dict[str, float]]:
        """Run predictions on a batch of texts."""
        print(f"[MODEL] Running sentiment analysis on {len(texts)} texts...")
        results = []
        # Using tqdm for progress bar in logs
        for text in tqdm(texts, desc="Analyzing sentiment", unit="text"):
            scores = self.polarity_scores(text)
            results.append(scores)
        return results


# Global model handler (Singleton pattern to avoid reloading on every API call)
roberta_handler = None


# ============================================================================
# 2. NODES
# ============================================================================

def load_csv_data(state: GraphState) -> GraphState:
    """Node A: Load CSV data from file."""
    print(">>> NODE 1: LOAD CSV DATA")
    csv_path = state["input_file_path"]

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV file not found: {csv_path}")

    # Try different encodings
    encodings = ['utf-8', 'latin1', 'iso-8859-1', 'cp1252']
    df = None
    for encoding in encodings:
        try:
            df = pd.read_csv(csv_path, encoding=encoding)
            break
        except UnicodeDecodeError:
            continue

    if df is None:
        raise ValueError(f"Could not read CSV with any standard encoding")

    # Verify required columns exist
    if CONFIG["text_column"] not in df.columns:
        # Fallback: check if 'Content' or 'CONTENT' exists
        found = False
        for col in df.columns:
            if col.lower() == CONFIG["text_column"].lower():
                df.rename(columns={col: CONFIG["text_column"]}, inplace=True)
                found = True
                break

        if not found:
            raise ValueError(f"Column '{CONFIG['text_column']}' not found in CSV. Cols: {list(df.columns)}")

    # Handle NaN values in text column
    df[CONFIG["text_column"]] = df[CONFIG["text_column"]].fillna("")

    csv_data = df.to_dict('records')
    return {**state, "csv_data": csv_data, "row_count": len(csv_data)}


def classifier_agent(state: GraphState) -> GraphState:
    """Node B: Run RoBERTa."""
    print(">>> NODE 2: SENTIMENT CLASSIFICATION")
    global roberta_handler

    if roberta_handler is None:
        roberta_handler = RoBERTaModelHandler()
        roberta_handler.load_model()

    csv_data = state["csv_data"]
    texts = [str(row.get(CONFIG["text_column"], "")) for row in csv_data]

    predictions = roberta_handler.predict_batch(texts)

    predicted_labels = []
    label_map = {0: "Negative", 1: "Neutral", 2: "Positive"}

    for pred in predictions:
        scores_array = [pred['roberta_neg'], pred['roberta_neu'], pred['roberta_pos']]
        label_idx = np.argmax(scores_array)
        predicted_labels.append(label_map[label_idx])

    sentiment_counts = pd.Series(predicted_labels).value_counts().to_dict()

    if not sentiment_counts:
        overall_sentiment = "Neutral"  # Default if empty
    else:
        overall_sentiment = max(sentiment_counts, key=sentiment_counts.get)

    for i, pred in enumerate(predictions):
        pred['predicted_label'] = predicted_labels[i]

    return {
        **state,
        "sentiment_score": overall_sentiment,
        "model_predictions": predictions,
        "sentiment_distribution": sentiment_counts
    }


def reasoning_agent(state: GraphState) -> GraphState:
    """Node C: Generate detailed summary using Gemini API."""
    print(">>> NODE 3: LLM REASONING")

    sentiment_score = state["sentiment_score"]
    predictions = state["model_predictions"]
    sentiment_dist = state["sentiment_distribution"]
    csv_data = state["csv_data"]

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("[LLM] No API key found. Skipping LLM.")
        return {**state, "reasoning_summary": "No Gemini API Key provided."}

    llm = ChatGoogleGenerativeAI(
        model=CONFIG["gemini_model"],
        google_api_key=api_key,
        temperature=0.7
    )

    # Prepare summary data
    data_summary = []
    # Only take valid text rows
    valid_rows = [(row, pred) for row, pred in zip(csv_data, predictions) if row.get(CONFIG["text_column"])]

    for i, (row, pred) in enumerate(valid_rows[:10]):
        text = str(row.get(CONFIG["text_column"], ""))
        text_preview = text[:100] + "..." if len(text) > 100 else text
        label = pred['predicted_label']
        confidence = max(pred['roberta_neg'], pred['roberta_neu'], pred['roberta_pos'])
        data_summary.append(f'{i + 1}. [{label.upper()} - {confidence:.2%}] "{text_preview}"')

    data_summary_text = "\n".join(data_summary)

    # Calculate averages safely
    if predictions:
        avg_neg = np.mean([p['roberta_neg'] for p in predictions])
        avg_neu = np.mean([p['roberta_neu'] for p in predictions])
        avg_pos = np.mean([p['roberta_pos'] for p in predictions])
    else:
        avg_neg, avg_neu, avg_pos = 0, 0, 0

    prompt = f"""As an expert sentiment analyst, provide a **concise, 2-3 sentence summary** for stakeholders. 
    Explain what the majority of reviews say about the product based on these metrics:

    OVERALL SENTIMENT: {sentiment_score}
    DISTRIBUTION: {json.dumps(sentiment_dist)}
    AVG SCORES: Neg {avg_neg:.2f}, Neu {avg_neu:.2f}, Pos {avg_pos:.2f}

    SAMPLE REVIEWS:
    {data_summary_text}
    """

    try:
        response = llm.invoke(prompt)
        reasoning_text = response.content
    except Exception as e:
        print(f"[LLM] Error: {e}")
        reasoning_text = f"Analysis completed successfully. Overall sentiment: {sentiment_score}."

    return {**state, "reasoning_summary": reasoning_text}


def format_output(state: GraphState) -> GraphState:
    """Node D: Structure final result."""
    predictions = state["model_predictions"]

    if predictions:
        avg_scores = {
            "average_negative": float(np.mean([p['roberta_neg'] for p in predictions])),
            "average_neutral": float(np.mean([p['roberta_neu'] for p in predictions])),
            "average_positive": float(np.mean([p['roberta_pos'] for p in predictions]))
        }
    else:
        avg_scores = {"average_negative": 0.0, "average_neutral": 0.0, "average_positive": 0.0}

    metadata = {
        "total_rows": state["row_count"],
        "model_used": CONFIG["roberta_model"],
        "timestamp": datetime.now().isoformat()
    }

    return {
        **state,
        "final_sentiment_score": state["sentiment_score"],
        "average_sentiment_scores": avg_scores,
        "final_detailed_predictions": state["model_predictions"][:50],
        "final_metadata": metadata
    }


# ============================================================================
# 3. GRAPH STRUCTURE
# ============================================================================

def create_sentiment_graph():
    """Create the LangGraph workflow."""
    workflow = StateGraph(GraphState)
    workflow.add_node("load_csv", load_csv_data)
    workflow.add_node("classify", classifier_agent)
    workflow.add_node("reason", reasoning_agent)
    workflow.add_node("format", format_output)

    workflow.set_entry_point("load_csv")
    workflow.add_edge("load_csv", "classify")
    workflow.add_edge("classify", "reason")
    workflow.add_edge("reason", "format")
    workflow.add_edge("format", END)

    return workflow.compile()


# ============================================================================
# 4. ENTRY POINT FOR API
# ============================================================================

def run_analysis(target_file_path: str) -> dict:
    """
    Main entry point for the FastAPI application.
    Args:
        target_file_path (str): The full path to the CSV file to analyze.
    Returns:
        dict: The complete analysis result in JSON format.
    """
    print(f"\n[SENTIMENT ENGINE] Starting analysis on {target_file_path}")

    # Update Config
    CONFIG["csv_path"] = target_file_path

    # Initialize Graph
    graph = create_sentiment_graph()

    initial_state = {
        "csv_data": [],
        "sentiment_score": "",
        "reasoning_summary": "",
        "input_file_path": target_file_path,
        "model_predictions": [],
        "row_count": 0,
        "sentiment_distribution": {},
        "final_sentiment_score": None,
        "average_sentiment_scores": None,
        "final_detailed_predictions": None,
        "final_metadata": None
    }

    try:
        # Run the pipeline
        result_state = graph.invoke(initial_state)

        # Structure final output
        final_output = {
            "status": "success",
            "file_analyzed": target_file_path,
            "overall_sentiment": result_state['final_sentiment_score'],
            "reasoning_summary": result_state['reasoning_summary'],
            "sentiment_distribution": result_state['sentiment_distribution'],
            "average_scores": result_state['average_sentiment_scores'],
            "metadata": result_state['final_metadata'],
            # Optional: Uncomment if you want raw data back
            # "detailed_predictions": result_state['final_detailed_predictions']
        }

        print("[SENTIMENT ENGINE] \u2713 Analysis Complete")
        return final_output

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e),
            "file_analyzed": target_file_path
        }


# ============================================================================
# CLI TESTING (Optional: Run this file directly to test without API)
# ============================================================================
if __name__ == "__main__":
    # Create a dummy CSV for testing if run directly
    test_file = "test_data.csv"
    if not os.path.exists(test_file):
        df = pd.DataFrame({
            "content": ["I love this product!", "This is terrible.", "It is okay, nothing special."]
        })
        df.to_csv(test_file, index=False)
        print(f"Created temporary test file: {test_file}")

    result = run_analysis(test_file)
    print("\n--- FINAL JSON RESULT ---")
    print(json.dumps(result, indent=2))
