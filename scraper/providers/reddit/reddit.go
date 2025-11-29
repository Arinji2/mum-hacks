// Package reddit contains functions to scrape Reddit posts
package reddit

import (
	"encoding/json"
	"fmt"

	"github.com/arinji2/scraper/internals/gemini"
	"github.com/arinji2/scraper/internals/logx"
	"github.com/arinji2/scraper/internals/models"
)

type RedditScraper struct {
	query       string
	productName string
	limit       int
}

func NewRedditScraper(query string, limit int) *RedditScraper {
	return &RedditScraper{
		query:       fmt.Sprintf("%s review", query),
		productName: query,
		limit:       limit,
	}
}

func (r *RedditScraper) RunRedditScraper() []models.Item {
	posts, err := redditPostFetch(r.query, r.limit)
	if err != nil {
		fmt.Printf("Failed to fetch posts: %v\n", err)
		return nil
	}

	postList := ""

	logx.Debug(fmt.Sprintf("Fetched %d titles from Reddit\n", len(posts)))
	for _, post := range posts {
		postList += fmt.Sprintf(`{"id": "%s", "content": "%s"},`, post.ID, post.Content)
	}

	postPrompt := fmt.Sprintf(`I am making a sentiment analysis model of Reddit reviews for the product %s.
I want to know if the reviews are positive or negative.
Remove any posts that are not real reviews or opinions about the product.

Be very critical in filtering — only include posts that truly discuss opinions, experiences, or reactions about the product.

Return ONLY a raw JSON array (no Markdown, no code block, no explanation) of up to %d objects.
Each object must have: "title", "id".

Here are the posts: [%s]`, r.productName, r.limit/2, postList)

	geminiModel, err := gemini.NewGeminiModelFromFile("keys/gemini.json")
	if err != nil {
		panic(err)
	}
	postRes, err := geminiModel.GetPromptResponse(postPrompt)
	if err != nil {
		panic(err)
	}

	var filteredPosts []models.Item
	if err := json.Unmarshal([]byte(postRes), &filteredPosts); err != nil {
		panic(err)
	}

	if len(filteredPosts) == 0 {
		fmt.Println("No relevant Reddit posts found.")
		return nil
	}

	var allComments []models.Item
	for _, post := range filteredPosts {
		comments, err := redditCommentsFetch(post.ID)
		if err != nil {
			fmt.Printf("Failed to fetch comments for post '%s': %v\n", post.ID, err)
			continue
		}
		allComments = append(allComments, comments...)
	}

	if len(allComments) == 0 {
		fmt.Println("No comments fetched for selected posts.")
		return filteredPosts
	}

	if len(allComments) > r.limit {
		allComments = allComments[:r.limit]
	}

	commentList := ""

	for _, comment := range allComments {
		commentList += fmt.Sprintf(`{"id": "%s", "content": "%s"},`, comment.ID, comment.Content)
	}

	logx.Debug(fmt.Sprintf("Fetched %d comments from Reddit\n", len(allComments)))
	commentPrompt := fmt.Sprintf(`
I am building a sentiment analysis dataset for the product: "%s".

You will receive a large list of Reddit comments related to this product.  
IMPORTANT RULES — follow them exactly:

1. DO NOT create or invent new comments.
2. DO NOT add opinions or information that is not already in the comment.
3. ONLY rewrite the comments I provide.
4. If a comment does not contain any meaningful experience, feedback, or opinion about the product, OMIT it (exclude it from the JSON).
5. For each included comment:
   - Rephrase lightly so it sounds like a normal human review.
   - Remove emojis, unusual characters, URLs, timestamps, usernames.
   - Keep the meaning the same.
   - Length must be between 10 and 30 words.
   - If the comment cannot be rewritten to meet this rule, omit it.
6. Keep the "id" exactly the same as I give — do not generate new ones.

OUTPUT FORMAT (must follow this exactly):
Return ONLY a **raw JSON array** (no code block, no markdown, no explanation).  
Each object: { "id": <same id>, "content": <rewritten comment> }  
Return **up to %d objects**.

Here are the comments:
%s
		`, r.productName, r.limit, commentList)

	commentRes, err := geminiModel.GetPromptResponse(commentPrompt)
	if err != nil {
		panic(err)
	}

	var filteredComments []models.Item
	if err := json.Unmarshal([]byte(commentRes), &filteredComments); err != nil {
		panic(err)
	}

	logx.Debug(fmt.Sprintf("Received %d results from Gemini For Reddit\n", len(filteredComments)))

	var finalItems []models.Item
	for _, fc := range filteredComments {
		for _, ac := range allComments {
			if fc.ID == ac.ID {
				fc.Year = ac.Year
				finalItems = append(finalItems, fc)
				break
			}
		}
	}

	return finalItems
}
