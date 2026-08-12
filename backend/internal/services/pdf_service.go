package services

import (
	"fmt"

	"backend/internal/models"

	"github.com/jung-kurt/gofpdf"
)

// GenerateReceiptPDF builds a PDF receipt for a completed transaction,
// embedding the given QR code image, and saves it to disk.
// Returns the path where the PDF was saved.
func GenerateReceiptPDF(txn models.Transaction, qrCodePath string) (string, error) {
	// gofpdf.New creates a new PDF document.
	// "P" = portrait orientation, "mm" = measurements in millimeters,
	// "A4" = standard page size, "" = use the default font directory.
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// --- Title ---
	pdf.SetFont("Arial", "B", 20)
	pdf.Cell(0, 15, "FastPay Transaction Receipt")
	pdf.Ln(20) // move down 20mm before the next line

	// --- Transaction details ---
	pdf.SetFont("Arial", "", 12)

	addLine := func(label string, value string) {
		pdf.SetFont("Arial", "B", 12)
		pdf.Cell(50, 8, label)
		pdf.SetFont("Arial", "", 12)
		pdf.Cell(0, 8, value)
		pdf.Ln(8)
	}

	addLine("Reference:", txn.Reference)
	addLine("Type:", txn.Type)
	addLine("Amount:", fmt.Sprintf("%.2f %s", txn.Amount, txn.Currency))
	addLine("Fee:", fmt.Sprintf("%.2f %s", txn.Fee, txn.Currency))
	addLine("Sender:", txn.SenderPhone)
	addLine("Recipient:", txn.RecipientPhone)
	addLine("Status:", txn.Status)

	pdf.Ln(10)

	// --- Embed the QR code image ---
	// pdf.Image places an existing image file onto the page.
	// Args: file path, X position, Y position, width (0 = auto), height,
	// flow (false = don't advance to a new line automatically), type ("" = auto-detect), link (0 = none), link URL.
	pdf.ImageOptions(qrCodePath, 80, pdf.GetY(), 50, 50, false, gofpdf.ImageOptions{ImageType: "PNG"}, 0, "")

	// --- Save the PDF to disk ---
	outputPath := fmt.Sprintf("uploads/receipts/receipt_%s.pdf", txn.Reference)
	if err := pdf.OutputFileAndClose(outputPath); err != nil {
		return "", err
	}

	return outputPath, nil
}
