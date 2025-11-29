// Package gemini contains functions to interact with the Gemini API.
package gemini

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"slices"
	"strings"

	"google.golang.org/genai"
)

type GeminiKey struct {
	Name string `json:"name"`
	Key  string `json:"key"`
}

type GeminiModel struct {
	Keys []GeminiKey
}

func NewGeminiModelFromFile(filePath string) (*GeminiModel, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read key file: %w", err)
	}

	var keys []GeminiKey
	if err := json.Unmarshal(data, &keys); err != nil {
		return nil, fmt.Errorf("failed to parse key file: %w", err)
	}

	if len(keys) == 0 {
		return nil, fmt.Errorf("no API keys found in file")
	}

	return &GeminiModel{Keys: keys}, nil
}

func (g *GeminiModel) GetPromptResponse(prompt string) (string, error) {
	var lastErr error

	for i, key := range g.Keys {
		fmt.Printf("[Gemini] Using key %q (%d/%d)\n", key.Name, i+1, len(g.Keys))
		ctx := context.Background()
		client, err := genai.NewClient(ctx, &genai.ClientConfig{
			APIKey:  key.Key,
			Backend: genai.BackendGeminiAPI,
		})
		if err != nil {
			lastErr = fmt.Errorf("failed to create client with key %s: %w", key.Name, err)
			continue
		}

		parts := []*genai.Part{{Text: prompt}}
		schema := &genai.Schema{
			Type: genai.TypeArray,
			Items: &genai.Schema{
				Type: genai.TypeObject,
				Properties: map[string]*genai.Schema{
					"content": {Type: genai.TypeString},
					"id":      {Type: genai.TypeString},
				},
				Required: []string{"content", "id"},
			},
		}

		resp, err := client.Models.GenerateContent(ctx, "gemini-2.0-flash", []*genai.Content{{Parts: parts}},
			&genai.GenerateContentConfig{
				ResponseSchema:   schema,
				ResponseMIMEType: "application/json",
			})
		if err != nil {
			lastErr = fmt.Errorf("request failed with key %s: %w", key.Name, err)
			continue
		}

		parsed := slices.Concat(resp.Candidates[0].Content.Parts)
		stringPrompt := ""
		for _, part := range parsed {
			stringPrompt = fmt.Sprintf("%s %s", stringPrompt, part.Text)
		}

		result := strings.TrimSpace(stringPrompt)
		result = strings.ReplaceAll(result, "\n", "")
		return result, nil
	}

	panic(fmt.Sprintf("all API keys failed: %v", lastErr))
}
