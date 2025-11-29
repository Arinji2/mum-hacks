package google

import (
	"encoding/json"
	"fmt"
	"hash/fnv"
	"io"
	"math"
	"net/http"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/arinji2/scraper/internals/models"
)

const MaxResults = 10

func (g *GoogleScraper) googleSearch(baseQuery string) ([]models.Item, error) {
	var searchResults []models.Item
	pages := int(math.Ceil(float64(g.limit) / float64(MaxResults)))
	if pages == 0 {
		pages = 1
	}

	for page := 0; page < pages; page++ {
		start := page*MaxResults + 1
		query := fmt.Sprintf("%s&start=%d", baseQuery, start)

		results, err := g.searchPage(query)
		if err != nil {
			fmt.Printf("Failed to fetch results: %v\n", err)
			return searchResults, err
		}

		searchResults = append(searchResults, results...)

		if len(searchResults) >= g.limit {
			searchResults = searchResults[:g.limit]
			break
		}
	}

	return searchResults, nil
}

func (g *GoogleScraper) searchPage(query string) ([]models.Item, error) {
	var searchResults []models.Item

	req, err := http.NewRequest("GET", query, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	results, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch google results: %w", err)
	}
	defer results.Body.Close()

	if results.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("google API returned status: %s", results.Status)
	}

	body, err := io.ReadAll(results.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var resultsMap map[string]any
	if err := json.Unmarshal(body, &resultsMap); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	items, ok := resultsMap["items"].([]any)
	if !ok {
		return nil, fmt.Errorf("invalid JSON structure: missing 'items'")
	}

	for _, item := range items {
		itemMap, ok := item.(map[string]any)
		if !ok {
			continue
		}
		url, ok := itemMap["link"].(string)
		if !ok {
			continue
		}

		id := strconv.Itoa(urlToID(url))
		if slices.ContainsFunc(searchResults, func(item models.Item) bool {
			return item.ID == id
		}) {
			continue
		}

		snippet, ok := itemMap["snippet"].(string)
		if !ok {
			continue
		}

		year := extractYear(snippet)
		snippet = cleanSnippet(snippet)

		searchResults = append(searchResults, models.Item{
			ID:      id,
			Content: snippet,
			Year:    year,
		})
	}

	return searchResults, nil
}

// --- Helpers ---

func extractYear(snippet string) int {
	currentYear := time.Now().Year()

	// 1. Explicit year in text, e.g. "Oct 17, 2022"
	yearRegex := regexp.MustCompile(`\b(20\d{2}|19\d{2})\b`)
	if match := yearRegex.FindString(snippet); match != "" {
		if year, err := strconv.Atoi(match); err == nil {
			return year
		}
	}

	// 2. Month-day pattern (e.g. "Oct 9") → assume current year
	monthRegex := regexp.MustCompile(`\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b`)
	if monthRegex.MatchString(snippet) {
		return currentYear
	}

	// 3. Relative time ("6 days ago", "2 weeks ago") → assume current year
	if strings.Contains(snippet, "ago") {
		return currentYear
	}

	// 4. Default fallback
	return currentYear
}

func cleanSnippet(snippet string) string {
	if idx := strings.Index(snippet, "..."); idx != -1 {
		return strings.TrimSpace(snippet[idx+3:])
	}
	return strings.TrimSpace(snippet)
}

func urlToID(url string) int {
	h := fnv.New32a()
	h.Write([]byte(url))
	return int(h.Sum32())
}
