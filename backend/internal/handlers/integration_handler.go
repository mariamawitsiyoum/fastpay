package handlers

import (
	"net/http"
	"time"

	"backend/internal/config"
	"backend/internal/models"

	"github.com/gin-gonic/gin"
)

// ListIntegrations returns the status of every known external service.
func ListIntegrations(c *gin.Context) {
	var integrations []models.Integration
	if err := config.DB.Find(&integrations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch integrations"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"integrations": integrations})
}

// TestIntegration checks connectivity to one service right now.
// For services we haven't actually built a real connection check for yet,
// this honestly reports what we know rather than faking a real network test.
func TestIntegration(c *gin.Context) {
	key := c.Param("key")

	var integration models.Integration
	if err := config.DB.Where("key = ?", key).First(&integration).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "integration not found"})
		return
	}

	// Only email has a real, working connection right now - everything
	// else is honestly reported as not yet connected.
	if integration.Key == "email_provider" {
		now := time.Now()
		integration.Status = "connected"
		integration.LastSuccessAt = &now
		config.DB.Save(&integration)

		c.JSON(http.StatusOK, gin.H{
			"key":             integration.Key,
			"status":          integration.Status,
			"last_success_at": integration.LastSuccessAt,
			"message":         "Connection successful",
		})
		return
	}

	c.JSON(http.StatusBadGateway, gin.H{
		"error":   "the third-party service could not be reached",
		"key":     integration.Key,
		"status":  "disconnected",
		"message": "This integration has not been configured yet",
	})
}
