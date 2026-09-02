package handlers

import (
	"net/http"

	"backend/internal/services"

	"github.com/gin-gonic/gin"
)

// GetCompanyReport returns company-wide aggregate numbers - intended
// for the admin dashboard.
func GetCompanyReport(c *gin.Context) {
	report, err := services.GetDailyReport()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": report,
	})
}
