package handlers

import (
	"net/http"

	"backend/internal/config"
	"backend/internal/models"
	"backend/internal/services"

	"github.com/gin-gonic/gin"
)

// GenerateReceipt creates a PDF receipt (with embedded QR code) for a
// given transaction, and saves a Receipt record pointing to it.
func GenerateReceipt(c *gin.Context) {
	reference := c.Param("reference")

	// Look up the transaction this receipt is for.
	var txn models.Transaction
	if result := config.DB.Where("reference = ?", reference).First(&txn); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "transaction not found"})
		return
	}

	// Generate the QR code first - the PDF needs it to already exist as
	// a file before it can embed it.
	qrContent := txn.Reference // what scanning the code reveals - the reference is enough for now
	qrPath, err := services.GenerateQRCode(qrContent, txn.Reference)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate QR code"})
		return
	}

	// Generate the PDF, embedding the QR code we just made.
	pdfPath, err := services.GenerateReceiptPDF(txn, qrPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate PDF receipt"})
		return
	}

	// Save a Receipt record in the database, pointing to both files.
	receipt := models.Recepit{
		TransactionID: txn.ID,
		SharedVia:     "none", // not shared yet - that comes later
		PDFUrl:        pdfPath,
		UserId:        1, // TEMPORARY: should come from the transaction's actual customer once auth exists
		QRCodeUrl:     qrPath,
	}
	if result := config.DB.Create(&receipt); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save receipt record"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":    "receipt generated",
		"receipt_id": receipt.ID,
		"pdf_url":    receipt.PDFUrl,
		"qr_url":     receipt.QRCodeUrl,
	})
}
