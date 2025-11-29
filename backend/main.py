import io
import os
from dotenv import load_dotenv
load_dotenv()
import requests
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sentiment_engine
from datetime import datetime

app = FastAPI()

MASTER_CSV = "http://cdn.arinji.com/u/JyP9ot.csv"

# 🚀 Request Format
class ProductRequest(BaseModel):
    product: str


# 🚀 VPS Upload Helper
def upload_to_vps(record: dict):
    url = "https://db-clarity.arinji.com/api/collections/products/records"
    api_key = os.getenv("NEXT_PUBLIC_CLARITY_API_KEY")

    if not api_key:
        print("❌ Missing API KEY")
        return 401

    headers = {
        "Content-Type": "application/json",
        "Authorization": api_key
    }

    res = requests.post(url, headers=headers, json=record)
    print("➡ VPS Response:", res.status_code)
    return res.status_code



# 🚀 MAIN ENDPOINT
@app.post("/process-product")
async def process_product(req: ProductRequest):

    product = req.product.strip()
    print("🚀 Processing product:", product)

    # STEP 1 — Load CSV EXACTLY AS IT IS
    response = requests.get(MASTER_CSV)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch CSV URL")
    df = pd.read_csv(io.StringIO(response.text))


    # STEP 2 — FILTER using EXACT COLUMN "product"
    product_rows = df[df["product"].astype(str).str.lower() == product.lower()]
    if product_rows.empty:
        raise HTTPException(status_code=404, detail="Product not found in CSV")


    # STEP 2.1 — brand = source (AS YOU SAID)
    source = product_rows["source"].iloc[0]


    # STEP 3 — Create temp CSV
    temp_file = f"temp_{product.replace(' ', '_')}.csv"
    product_rows[["year", "source", "content"]].to_csv(temp_file, index=False)
    print("📄 Temp CSV created:", temp_file)


    # STEP 4 — Run LangGraph Sentiment Engine
    result = sentiment_engine.run_analysis(temp_file)
    if result.get("status") == "error":
        raise HTTPException(
            status_code=500,
            detail=f"LangGraph failed: {result.get('message')}"
        )

    # STEP 5 — Upload SUMMARY to VPS
    summary_record = {
        "product": product,
        "source": source,      # brand = source !!!
        "content": "summary", # your instructions said: content everywhere = content field

        "overall_sentiment": result["overall_sentiment"],
        "reasoning_summary": result["reasoning_summary"],

        "distribution_positive": result["sentiment_distribution"].get("Positive", 0),
        "distribution_negative": result["sentiment_distribution"].get("Negative", 0),
        "distribution_neutral": result["sentiment_distribution"].get("Neutral", 0),

        "scores_negative": result["average_scores"]["average_negative"],
        "scores_neutral": result["average_scores"]["average_neutral"],
        "scores_positive": result["average_scores"]["average_positive"],

        "indexed_on": datetime.now().isoformat(),
        "type": "summary"
    }

    upload_to_vps(summary_record)


    sample_reviews = [{
        "product": row["product"],
        "source": row["source"],    # brand = source
        "content": row["content"],
        "year": row["year"],
    } for _, row in product_rows.iterrows()]

    # STEP 7 — Upload SAMPLES to VPS
    sample_record = {
        "product": product,
        "source": source,
        "content": "sample_reviews",
        "sample_reviews": sample_reviews,
        "indexed_on": datetime.now().isoformat(),
        "type": "samples"
    }

    upload_to_vps(sample_record)


    # STEP 8 — Cleanup
    if os.path.exists(temp_file):
        os.remove(temp_file)
        print("🧹 Temp CSV deleted.")

    return {
        "status": "success",
        "message": f"Analysis completed for {product} 👍"
    }
