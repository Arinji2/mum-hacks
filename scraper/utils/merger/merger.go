package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	root := "results"

	// Output CSV
	outFile, err := os.Create("all.csv")
	if err != nil {
		log.Fatal(err)
	}
	defer outFile.Close()

	writer := csv.NewWriter(outFile)
	defer writer.Flush()

	// Write header
	writer.Write([]string{"year", "company", "product", "source", "review"})

	// Walk through folders
	err = filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip directories
		if info.IsDir() {
			return nil
		}

		// Only process CSV files
		if !strings.HasSuffix(info.Name(), ".csv") {
			return nil
		}

		// Extract company (parent dir)
		company := filepath.Base(filepath.Dir(path))

		// Extract product (filename without .csv)
		product := strings.TrimSuffix(info.Name(), ".csv")

		// Open the CSV file
		f, err := os.Open(path)
		if err != nil {
			return err
		}
		defer f.Close()

		reader := csv.NewReader(f)
		rows, err := reader.ReadAll()
		if err != nil {
			return err
		}

		// Skip header row
		for i, row := range rows {
			if i == 0 {
				continue
			}

			if len(row) < 3 {
				continue
			}

			year := row[0]
			review := row[1]
			source := row[2]

			writer.Write([]string{
				year,
				company,
				product,
				source,
				review,
			})
		}

		return nil
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Merged into all.csv")
}
