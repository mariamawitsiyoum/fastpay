package handlers

import (
	"net/http"
	"strconv"

	"backend/internal/services"

	"github.com/gin-gonic/gin"
)

func GetDailyVolume(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")

	data, err := services.GetDailyVolume(from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate report"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func GetRevenue(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")

	data, err := services.GetRevenue(from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate report"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func GetActiveCustomers(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")

	data, err := services.GetActiveCustomers(from, to)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate report"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func GetTopCorridors(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "5")
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 5
	}

	data, err := services.GetTopCorridors(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate report"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}
