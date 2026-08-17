package handlers

import (
	"backend/internal/config"
	"backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RegisterAgentInput struct {
	BusinessName string  `json:"business_name" binding:"required"`
	PhoneNumber  string  `json:"phone_number" binding:"required"`
	Latitude     float64 `json:"latitude" binding:"required"`
	Longitude    float64 `json:"longitude" binding:"required"`
	BankAccount  string  `json:"bank_account" binding:"required"`
}

func RegisterAgent(c *gin.Context) {
	var input RegisterAgentInput

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

	agent := models.Agent{
		UserId:       userID,
		BusinessName: input.BusinessName,
		PhoneNumber:  input.PhoneNumber,
		Latitude:     input.Latitude,
		Longitude:    input.Longitude,
		Bank:         input.BankAccount,
	}

	if err := config.DB.Create(&agent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create agent"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Agent registered successfully",
		"agent_id": agent.ID,
	})
}

type UpdateAgentStatusInput struct {
	Status string `json:"status" binding:"required,oneof=approved rejected"`
}

func UpdateAgentStatus(c *gin.Context) {
	agentID := c.Param("id")

	var input UpdateAgentStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var agent models.Agent
	if err := config.DB.First(&agent, agentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "agent not found"})
		return
	}

	agent.Status = input.Status
	if err := config.DB.Save(&agent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update agent status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "agent status updated successfully",
		"agent":   agent,
	})
}
