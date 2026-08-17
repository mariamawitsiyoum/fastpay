package handlers

import (
	"fmt"
	"net/http"
	"time"

	"backend/internal/config"
	"backend/internal/models"

	"github.com/gin-gonic/gin"
)

type CashTransactionInput struct {
	Type           string  `json:"type" binding:"required,oneof=cash_in cash_out"`
	Amount         float64 `json:"amount" binding:"required,gt=0"`
	SenderPhone    string  `json:"sender_phone" binding:"required"`
	RecipientPhone string  `json:"recipient_phone" binding:"required"`
}

func CreateCashTransaction(c *gin.Context) {
	var input CashTransactionInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found in context"})
		return
	}
	userID := userIDValue.(uint)

	var agent models.Agent
	if err := config.DB.Where("user_id = ?", userID).First(&agent).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "you are not a registered agent"})
		return
	}

	if agent.Status != "approved" {
		c.JSON(http.StatusForbidden, gin.H{"error": "your agent account is not yet approved"})
		return
	}

	transaction := models.Transaction{
		Reference:      generateReference(),
		Type:           input.Type,
		Amount:         input.Amount,
		SenderPhone:    input.SenderPhone,
		RecipientPhone: input.RecipientPhone,
		AgentID:        &agent.ID,
		Status:         "completed",
	}

	if err := config.DB.Create(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create transaction"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":     "transaction recorded successfully",
		"transaction": transaction,
	})
}

func generateReference() string {
	return fmt.Sprintf("FP-%d", time.Now().UnixNano())
}
