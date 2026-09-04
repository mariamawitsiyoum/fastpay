package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"backend/internal/config"
	"backend/internal/models"
	"backend/internal/services"

	"github.com/gin-gonic/gin"
)

// GenerateReceipt creates a PDF receipt (with embedded QR code) for a
// given transaction, and saves a Receipt record pointing to it.
type GenerateReceiptRequest struct {
	TransactionID uint `json:"transaction_id" binding:"required"`
}

// GenerateReceipt creates a PDF receipt (with embedded QR code) for a
// given transaction, and saves a Receipt record pointing to it.
func GenerateReceipt(c *gin.Context) {
	var req GenerateReceiptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var txn models.Transaction
	if result := config.DB.First(&txn, req.TransactionID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "transaction not found"})
		return
	}

	// Create the receipt record first (without file paths yet) so we have
	// a real ID to build the verification URL from.
	receipt := models.Recepit{
		TransactionID: txn.ID,
		SharedVia:     "none",
		UserId:        1, // TEMPORARY until auth links the real customer
	}
	if result := config.DB.Create(&receipt); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save receipt record"})
		return
	}

	// The QR code now encodes a real, working verify link.
	verifyURL := fmt.Sprintf("http://localhost:8080/receipts/verify/%d", receipt.ID)
	qrPath, err := services.GenerateQRCode(verifyURL, txn.Reference)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate QR code"})
		return
	}

	pdfPath, err := services.GenerateReceiptPDF(txn, qrPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate PDF receipt"})
		return
	}

	receipt.PDFUrl = pdfPath
	receipt.QRCodeUrl = qrPath
	if result := config.DB.Save(&receipt); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update receipt record"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":             receipt.ID,
		"transaction_id": txn.ID,
		"pdf_url":        receipt.PDFUrl,
		"qr_code_data":   verifyURL,
	})
}

// GetReceipt fetches a single receipt by its ID.
func GetReceipt(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid receipt id"})
		return
	}

	var receipt models.Recepit
	if result := config.DB.First(&receipt, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "receipt not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":           receipt.ID,
		"pdf_url":      receipt.PDFUrl,
		"qr_code_data": receipt.QRCodeUrl,
	})
}

type ShareReceiptRequest struct {
	Method      string `json:"method" binding:"required"`
	Destination string `json:"destination" binding:"required"`
}

// ShareReceipt sends an already-generated receipt to a destination (email for now).
func ShareReceipt(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid receipt id"})
		return
	}

	var req ShareReceiptRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var receipt models.Recepit
	if result := config.DB.First(&receipt, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "receipt not found"})
		return
	}

	var txn models.Transaction
	config.DB.First(&txn, receipt.TransactionID)

	if req.Method == "email" {
		if err := services.SendReceiptEmail(req.Destination, txn.Reference, receipt.PDFUrl); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to send email"})
			return
		}
	}

	now := time.Now()
	receipt.SharedVia = req.Method
	receipt.SharedTime = &now
	config.DB.Save(&receipt)

	c.JSON(http.StatusOK, gin.H{"message": "Receipt sent"})
}

// VerifyReceipt is a PUBLIC endpoint - what scanning the QR code opens.
func VerifyReceipt(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"valid": false, "error": "invalid receipt id"})
		return
	}

	var receipt models.Recepit
	if result := config.DB.First(&receipt, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"valid": false, "error": "receipt not found"})
		return
	}

	var txn models.Transaction
	if result := config.DB.First(&txn, receipt.TransactionID); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"valid": false, "error": "transaction not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"valid":          true,
		"transaction_id": txn.ID,
		"amount":         txn.Amount,
		"date":           txn.CreatedAt,
		"sender":         txn.SenderPhone,
		"receiver":       txn.RecipientPhone,
	})
}
