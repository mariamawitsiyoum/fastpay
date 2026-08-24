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

	// Selfie is optional for now - not every test/demo will include one yet.
	var selfiePath string
	selfieHeader, selfieErr := c.FormFile("selfie")
	if selfieErr == nil {
		selfieExt := filepath.Ext(selfieHeader.Filename)
		selfieFilename := fmt.Sprintf("selfie_%d_%d%s", userID, time.Now().Unix(), selfieExt)
		selfieSavePath := filepath.Join("uploads", "kyc", selfieFilename)

		if err := c.SaveUploadedFile(selfieHeader, selfieSavePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save selfie"})
			return
		}
		selfiePath = selfieSavePath
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
		SelfiePhoto:  selfiePath,
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

// GetPendingKYC returns all KYC submissions that are still awaiting review.
// This is what an admin's dashboard would call to build their review queue.
func GetPendingKYC(c *gin.Context) {
	var pendingList []models.Kyc

	// .Where("status = ?", "pending") filters the query - the "?" is a
	// placeholder that gets safely replaced with "pending". This pattern
	// (using ? instead of pasting the value directly into the string)
	// protects against SQL injection attacks.
	// .Find(&pendingList) runs the query and fills the slice with results.
	if result := config.DB.Where("status = ?", "pending").Find(&pendingList); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch pending KYC records"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"count": len(pendingList),
		"data":  pendingList,
	})
}

// ReviewKYCRequest describes the exact shape of JSON we expect an admin
// to send when approving or rejecting a KYC submission.
type ReviewKYCRequest struct {
	// `binding:"required"` tells Gin this field MUST be present - if it's
	// missing, Gin automatically rejects the request before our code even runs.
	// `oneof=verified rejected` restricts the value to only these two options.
	Decision string `json:"decision" binding:"required,oneof=verified rejected"`
	Notes    string `json:"notes"`
	// TEMPORARY: normally the admin's ID would come from their JWT token
	// (via auth middleware), not be sent manually in the body. We're doing
	// it this way only until auth middleware is finished.
	ReviewedBy uint `json:"reviewed_by" binding:"required"`
}

// ReviewKYC lets an admin approve or reject a specific KYC submission.
func ReviewKYC(c *gin.Context) {
	// c.Param("id") reads the ":id" part of the URL path, e.g. "5" from "/kyc/5/review".
	idParam := c.Param("id")
	kycID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid KYC id"})
		return
	}

	// Bind the incoming JSON body into our struct. If required fields are
	// missing, or "decision" isn't "verified"/"rejected", this returns an
	// error automatically - we don't have to check each field by hand.
	var req ReviewKYCRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find the KYC record we're reviewing.
	var kyc models.Kyc
	if result := config.DB.First(&kyc, kycID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "KYC record not found"})
		return
	}

	// Only pending records should be reviewable - this stops an admin from
	// accidentally re-reviewing something already decided.
	if kyc.Status != "pending" {
		c.JSON(http.StatusConflict, gin.H{"error": "this KYC record has already been reviewed"})
		return
	}

	now := time.Now()
	kyc.Status = req.Decision
	kyc.Notes = req.Notes
	kyc.ReviewedBy = req.ReviewedBy
	kyc.ReviewedAt = &now // pointer, because ReviewedAt is *time.Time in the model

	if result := config.DB.Save(&kyc); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update KYC record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "KYC record updated",
		"kyc_id":  kyc.ID,
		"status":  kyc.Status,
	})
}
