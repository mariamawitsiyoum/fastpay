package handlers

import (
	"net/http"

	"backend/internal/services"

	"github.com/gin-gonic/gin"
)

type AddRateRequest struct {
	Currency string  `json:"currency" binding:"required,len=3"`
	BuyRate  float64 `json:"buy_rate" binding:"required,gt=0"`
	SellRate float64 `json:"sell_rate" binding:"required,gt=0"`
}

// ListExchangeRates - admin view of all currencies.
func ListExchangeRates(c *gin.Context) {
	rates, err := services.ListExchangeRates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch rates"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"rates": rates})
}

// AddExchangeRate - admin adds a new currency.
func AddExchangeRate(c *gin.Context) {
	var req AddRateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TEMPORARY: hardcoded until auth provides the real admin's ID.
	rate, err := services.AddExchangeRate(req.Currency, req.BuyRate, req.SellRate, 1)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, rate)
}

type EditRateRequest struct {
	BuyRate  float64 `json:"buy_rate" binding:"required,gt=0"`
	SellRate float64 `json:"sell_rate" binding:"required,gt=0"`
}

// EditExchangeRate - admin updates an existing currency's rate.
func EditExchangeRate(c *gin.Context) {
	currency := c.Param("currency")

	var req EditRateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rate, err := services.EditExchangeRate(currency, req.BuyRate, req.SellRate, 1)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, rate)
}

// ActivateExchangeRate - admin activates a currency.
func ActivateExchangeRate(c *gin.Context) {
	currency := c.Param("currency")
	rate, err := services.SetRateActive(currency, true)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"currency": rate.Currency, "is_active": rate.IsActive})
}

// DeactivateExchangeRate - admin deactivates a currency.
func DeactivateExchangeRate(c *gin.Context) {
	currency := c.Param("currency")
	rate, err := services.SetRateActive(currency, false)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"currency": rate.Currency, "is_active": rate.IsActive})
}

// GetRateHistory - admin views past rates for a currency.
func GetRateHistory(c *gin.Context) {
	currency := c.Param("currency")
	history, err := services.GetRateHistory(currency)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch history"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"currency": currency, "history": history})
}

// GetPublicRate - public, single currency lookup.
func GetPublicRate(c *gin.Context) {
	target := c.Query("target")
	if target == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "target currency is required"})
		return
	}

	rate, err := services.GetPublicRate(target)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	blended := (rate.BuyRate + rate.SellRate) / 2
	c.JSON(http.StatusOK, gin.H{
		"base":   "USD",
		"target": rate.Currency,
		"rate":   blended,
	})
}

// GetAllPublicRates - public, all currencies at once.
func GetAllPublicRates(c *gin.Context) {
	rates, err := services.GetAllPublicRates()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch rates"})
		return
	}

	ratesMap := make(map[string]float64)
	for _, r := range rates {
		ratesMap[r.Currency] = (r.BuyRate + r.SellRate) / 2
	}

	c.JSON(http.StatusOK, gin.H{
		"base":  "USD",
		"rates": ratesMap,
	})
}
