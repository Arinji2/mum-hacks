package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"sync"

	"github.com/arinji2/scraper/internals/models"
	"github.com/arinji2/scraper/internals/writer"
	"github.com/arinji2/scraper/providers/google"
	"github.com/arinji2/scraper/providers/reddit"
	_ "github.com/joho/godotenv/autoload"
)

const (
	searchKeysFile = "keys/search.json"
)

func main() {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Enter product name: ")
	product, _ := reader.ReadString('\n')
	product = strings.TrimSpace(product)

	fmt.Print("Enter company name: ")
	companyName, _ := reader.ReadString('\n')
	companyName = strings.TrimSpace(companyName)

	var (
		redditPosts  []models.Item
		quoraResults []models.Item
		xResults     []models.Item
	)

	var wg sync.WaitGroup
	wg.Add(3)

	// --- Reddit scraper ---
	go func() {
		defer wg.Done()
		defer func() {
			if r := recover(); r != nil {
				fmt.Printf("[RedditScraper] panic: %v\n", r)
			}
		}()
		redditScraper := reddit.NewRedditScraper(product, 60)
		redditPosts = redditScraper.RunRedditScraper()
	}()
	// --- Quora scraper ---
	go func() {
		defer wg.Done()
		defer func() {
			if r := recover(); r != nil {
				fmt.Printf("[QuoraScraper] panic: %v\n", r)
			}
		}()
		quoraScraper, err := google.NewGoogleScraper("quora.com", searchKeysFile, product, 40)
		if err != nil {
			fmt.Printf("[QuoraScraper] panic: %v\n", err)
		}
		quoraResults = quoraScraper.RunGoogleScraper()
	}()

	// --- X (Twitter) scraper ---
	go func() {
		defer wg.Done()
		defer func() {
			if r := recover(); r != nil {
				fmt.Printf("[XScraper] panic: %v\n", r)
			}
		}()
		xScraper, err := google.NewGoogleScraper("x.com", searchKeysFile, product, 70)
		if err != nil {
			fmt.Printf("[XScraper] panic: %v\n", err)
		}
		xResults = xScraper.RunGoogleScraper()
	}()

	wg.Wait()

	writer := writer.NewWriter(product, companyName, xResults, quoraResults, redditPosts)
	writer.WriteResults()

	fmt.Println("\n✅ All scrapers finished successfully.")
}
