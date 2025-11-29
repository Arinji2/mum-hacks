// Package logx provides primitives to interact with the debugger logger.
package logx

import (
	"log"
	"os"

	_ "github.com/joho/godotenv/autoload"
)

var debugEnabled = os.Getenv("DEBUG") == "true"

const (
	colorBoldBrightMagenta = "\033[1;95m"
	colorReset             = "\033[0m"
)

func Debug(msg string, args ...any) {
	if debugEnabled {
		log.Printf(colorBoldBrightMagenta+"[DEBUG] "+msg+colorReset, args...)
	}
}
