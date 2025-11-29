// Package google contains functions to scrape Google posts.
package google

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os"

	"github.com/arinji2/scraper/internals/models"
)

type searchKey struct {
	Name   string `json:"name"`
	CxID   string `json:"cx_id"`
	APIKey string `json:"api_key"`
}

type GoogleScraper struct {
	productName string
	limit       int
	siteName    string
	Keys        []searchKey
}

func NewGoogleScraper(siteName string, filePath string, query string, limit int) (*GoogleScraper, error) {
	keys, err := loadSearchKeys(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to load search keys: %w", err)
	}
	if len(keys) == 0 {
		return nil, fmt.Errorf("no search keys found in %s", filePath)
	}

	return &GoogleScraper{
		productName: query,
		limit:       limit,
		siteName:    siteName,
		Keys:        keys,
	}, nil
}

func loadSearchKeys(filePath string) ([]searchKey, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	var keys []searchKey
	if err := json.Unmarshal(data, &keys); err != nil {
		return nil, err
	}

	return keys, nil
}

func (g *GoogleScraper) RunGoogleScraper() []models.Item {
	var lastErr error

	for i, key := range g.Keys {
		fmt.Printf("[Google] Using key %q (%d/%d)\n", key.Name, i+1, len(g.Keys))

		// Build Google Search API request
		queryURL := fmt.Sprintf(
			"https://www.googleapis.com/customsearch/v1?key=%s&cx=%s&q=%s",
			key.APIKey,
			key.CxID,
			url.QueryEscape(fmt.Sprintf("site:%s %s review", g.siteName, g.productName)),
		)

		results, err := g.googleSearch(queryURL)
		if err != nil {
			fmt.Printf("[Google] Key %q failed: %v\n", key.Name, err)
			lastErr = err
			continue
		}

		// SUCCESS
		return results
	}

	panic(fmt.Sprintf("All Google API keys failed: %v", lastErr))
}
