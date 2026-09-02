package handlers

import (
	"net/http"

	"backend/internal/services"

	"github.com/gin-gonic/gin"
)

// SetRateRequest describes the JSON an admin sends to set/update a rate.
type SetRateRequest struct {
	FromCurrency string  `json:"from_currency" binding:"required,len=3"`
	ToCurrency   string  `json:"to_currency" binding:"required,len=3"`
	Rate         float64 `json:"rate" binding:"required,gt=0"`
	UpdatedBy    uint    `json:"updated_by" binding:"required"`
}

// SetExchangeRate lets an admin create or update a currency pair's rate.
func SetExchangeRate(c *gin.Context) {
	var req SetRateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rate, err := services.SetExchangeRate(req.FromCurrency, req.ToCurrency, req.Rate, req.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to set exchange rate"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "exchange rate updated",
		"data":    rate,
	})
}

// GetExchangeRate looks up the rate for a currency pair, given as URL query
// parameters, e.g. /exchange-rate?from=ETB&to=USD
func GetExchangeRate(c *gin.Context) {
	from := c.Query("from")
	to := c.Query("to")

	if from == "" || to == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "both 'from' and 'to' query parameters are required"})
		return
	}

	rate, err := services.GetExchangeRate(from, to)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rate})
}
