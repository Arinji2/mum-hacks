package reddit

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/arinji2/scraper/internals/models"
)

// redditCommentsFetch retrieves comments for a given Reddit post ID.
func redditCommentsFetch(postID string) ([]models.Item, error) {
	var posts []models.Item
	url := fmt.Sprintf("https://www.reddit.com/comments/%s.json", postID)

	req, err := http.NewRequest("GET", url, nil)
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
		return nil, fmt.Errorf("reddit API returned %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	var results []map[string]any
	if err := json.Unmarshal(body, &results); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if len(results) < 2 {
		return nil, fmt.Errorf("unexpected response structure: missing comments array")
	}

	data, ok := results[1]["data"].(map[string]any)
	if !ok {
		return nil, fmt.Errorf("missing 'data' field in comments section")
	}

	children, ok := data["children"].([]any)
	if !ok {
		return nil, fmt.Errorf("missing 'children' array in comments section")
	}

	for _, c := range children {
		cmap, ok := c.(map[string]any)
		if !ok {
			continue
		}
		cdata, ok := cmap["data"].(map[string]any)
		if !ok {
			continue
		}

		body, _ := cdata["body"].(string)
		if body == "" {
			continue
		}

		fullStopCount := strings.Count(body, ".")
		if fullStopCount < 3 {
			continue
		}

		if fullStopCount > 30 || len(body) > 400 {
			continue
		}

		author, _ := cdata["author"].(string)
		commentID, _ := cdata["id"].(string)
		createdUtc, _ := cdata["created_utc"].(float64)

		// Skip system/bot comments
		authorLower := strings.ToLower(author)
		if strings.Contains(authorLower, "bot") ||
			strings.Contains(authorLower, "support") ||
			strings.Contains(authorLower, "mod") ||
			strings.Contains(body, "hi there /u/") {
			continue
		}

		t := time.Unix(int64(createdUtc), 0).UTC()

		post := models.Item{
			Content: body,
			ID:      commentID,
			Year:    t.Year(),
		}

		posts = append(posts, post)
	}

	if len(posts) == 0 {
		return nil, fmt.Errorf("no valid comments found for post '%s'", postID)
	}

	return posts, nil
}
