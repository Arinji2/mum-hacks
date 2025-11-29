package reddit

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/arinji2/scraper/internals/models"
)

// redditPostFetch fetches posts reddit and aggregates results.
func redditPostFetch(query string, limit int) ([]models.Item, error) {
	postsArr, err := searchRedditPost(query, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch posts: %w", err)
	}
	if len(postsArr) == 0 {
		return nil, fmt.Errorf("no posts fetched for query '%s'", query)
	}

	return postsArr, nil
}

// searchRedditPost fetches posts from reddit
func searchRedditPost(query string, limit int) ([]models.Item, error) {
	var resultsArr []models.Item

	urlStr := fmt.Sprintf(
		"https://www.reddit.com/search.json?q=%s&sort=best&limit=%d",
		url.QueryEscape(query),
		limit,
	)

	req, err := http.NewRequest("GET", urlStr, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("User-Agent", "reddit-bot/1.0")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("reddit API returned status: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var results map[string]any
	if err := json.Unmarshal(body, &results); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	data, ok := results["data"].(map[string]any)
	if !ok {
		return nil, fmt.Errorf("invalid JSON structure: missing 'data'")
	}

	children, ok := data["children"].([]any)
	if !ok || len(children) == 0 {
		return nil, fmt.Errorf("no posts found")
	}

	for _, child := range children {
		childMap, ok := child.(map[string]any)
		if !ok {
			continue
		}
		postData, ok := childMap["data"].(map[string]any)
		if !ok {
			continue
		}

		title, _ := postData["title"].(string)
		id, _ := postData["id"].(string)

		resultsArr = append(resultsArr, models.Item{
			Content: title,
			ID:      id,
		})
	}

	if len(resultsArr) == 0 {
		return nil, fmt.Errorf("no valid posts parsed for post")
	}

	return resultsArr, nil
}
