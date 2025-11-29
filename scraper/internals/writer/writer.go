// Package writer provides functionality to write scraped results to CSV files.
package writer

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/arinji2/scraper/internals/models"
)

type Writer struct {
	productName   string
	companyName   string
	xResults      []models.Item
	quoraResults  []models.Item
	redditResults []models.Item
}

func NewWriter(productName string, companyName string, xResults, quoraResults, redditResults []models.Item) *Writer {
	return &Writer{
		productName:   productName,
		companyName:   companyName,
		xResults:      xResults,
		quoraResults:  quoraResults,
		redditResults: redditResults,
	}
}

func (w *Writer) WriteResults() {
	dirPath := filepath.Join("results", w.companyName)
	if err := os.MkdirAll(dirPath, 0o755); err != nil {
		panic(fmt.Errorf("failed to create directory %s: %w", dirPath, err))
	}

	filePath := filepath.Join(dirPath, fmt.Sprintf("%s.csv", w.productName))
	f, err := os.Create(filePath)
	if err != nil {
		panic(fmt.Errorf("failed to create file %s: %w", filePath, err))
	}
	defer f.Close()

	writer := csv.NewWriter(f)
	defer writer.Flush()

	if err := writer.Write([]string{"year", "content", "source"}); err != nil {
		panic(fmt.Errorf("failed to write header: %w", err))
	}

	reader := bufio.NewReader(os.Stdin)

	writeBatch := func(results []models.Item, source string) {
		for i, r := range results {
			fmt.Printf("Remaining: %d\n", len(results)-i)
			fmt.Printf("\nSource: %s\nContent: %s\nWrite this? (Enter = yes, n = skip): ", source, r.Content)
			input, _ := reader.ReadString('\n')
			input = strings.TrimSpace(input)

			if strings.ToLower(input) == "n" {
				fmt.Println("→ Skipped")
				continue
			}

			record := []string{
				fmt.Sprintf("%d", r.Year),
				strings.ReplaceAll(strings.TrimSpace(r.Content), ";", ""),
				source,
			}

			if err := writer.Write(record); err != nil {
				panic(fmt.Errorf("failed to write record: %w", err))
			}

			fmt.Println("✓ Written")
		}
	}

	writeBatch(w.xResults, "x")
	writeBatch(w.quoraResults, "quora")
	writeBatch(w.redditResults, "reddit")

	writer.Flush()
	if err := writer.Error(); err != nil {
		panic(fmt.Errorf("failed to flush CSV: %w", err))
	}

	fmt.Printf("\n✅ Results written to %s\n", filePath)
}
