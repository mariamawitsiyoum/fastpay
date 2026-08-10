package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"backend/internal/config"
	"backend/internal/models"

	"github.com/gin-gonic/gin"
)

// UploadKYC handles a customer uploading their ID document.
//
// TEMPORARY VERSION: saves the file to a local folder on disk.
// We will swap this out for real cloud object storage in Step 3 -
// this version exists so we can test the full flow end-to-end first.
func UploadKYC(c *gin.Context) {
	// --- 1. Read the plain text fields sent alongside the file ---
	userIDStr := c.PostForm("user_id")
	documentType := c.PostForm("document_type") // e.g. "passport", "national_id"

	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	userIDUint64, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id must be a valid number"})
		return
	}
	userID := uint(userIDUint64)

	if documentType == "" {
		documentType = "passport" // matches the model's default
	}

	// --- 2. Read the uploaded file itself ---
	fileHeader, err := c.FormFile("id_front")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id_front file is required"})
		return
	}

	// --- 3. Build a safe, unique filename ---
	ext := filepath.Ext(fileHeader.Filename) // e.g. ".jpg"
	safeFilename := fmt.Sprintf("kyc_%d_%d%s", userID, time.Now().Unix(), ext)

	savePath := filepath.Join("uploads", "kyc", safeFilename)

	if err := c.SaveUploadedFile(fileHeader, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save file"})
		return
	}

	// --- 4. Create the database record ---
	kyc := models.Kyc{
		UserID:       userID,
		DocumentType: documentType,
		IdFront:      savePath, // storing the file's location, not the file itself
		Status:       "pending",
	}

	if result := config.DB.Create(&kyc); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save KYC record"})
		return
	}

	// --- 5. Respond to the client ---
	c.JSON(http.StatusCreated, gin.H{
		"message": "KYC document uploaded, pending review",
		"kyc_id":  kyc.ID,
		"status":  kyc.Status,
	})
}
