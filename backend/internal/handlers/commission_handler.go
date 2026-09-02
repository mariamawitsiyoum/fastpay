package handlers

import (
	"net/http"

	"backend/internal/services"

	"github.com/gin-gonic/gin"
)

// SetCommissionRateRequest describes the JSON an admin sends to set the rate.
type SetCommissionRateRequest struct {
	Percentage float64 `json:"percentage" binding:"required,gt=0,lte=100"`
	UpdatedBy  uint    `json:"updated_by" binding:"required"`
}

// SetCommissionRate lets an admin set the agent commission percentage.
func SetCommissionRate(c *gin.Context) {
	var req SetCommissionRateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rate, err := services.SetCommissionRate(req.Percentage, req.UpdatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to set commission rate"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "commission rate updated",
		"data":    rate,
	})
}

// CalculateCommissionRequest describes the JSON needed to calculate a
// commission for a specific transaction and agent.
type CalculateCommissionRequest struct {
	TransactionID uint `json:"transaction_id" binding:"required"`
	AgentID       uint `json:"agent_id" binding:"required"`
}

// CalculateCommission calculates and saves the commission earned for a transaction.
func CalculateCommission(c *gin.Context) {
	var req CalculateCommissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	commission, err := services.CalculateCommission(req.TransactionID, req.AgentID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "commission calculated",
		"data":    commission,
	})
}
