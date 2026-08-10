package main

import (
	"log"
	"os"

	"backend/internal/config"
	"backend/internal/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. load .env
	// We log an error if it doesn't exist, but do not exit because environment
	// variables can also be set directly on the system.
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found or error loading it. Using system environment variables.")
	}
	config.ConnectDB()

	// 2. create gin router
	router := gin.Default()

	// 3. define GET /health
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "success",
		})
	})

	// 4. register all app routes (kyc, receipts, etc.)
	routes.RegisterRoutes(router)

	// 5. get PORT from env, run the router
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	router.Run(":" + port)
}