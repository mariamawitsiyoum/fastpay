package services

import (
	"fmt"

	qrcode "github.com/skip2/go-qrcode"
)

// GenerateQRCode creates a QR code image encoding the given content
// (e.g. a transaction reference or verification URL), and saves it
// as a PNG file. Returns the path where the file was saved.
func GenerateQRCode(content string, transactionReference string) (string, error) {
	// Build a predictable, safe filename based on the transaction reference.
	filename := fmt.Sprintf("uploads/qrcodes/qr_%s.png", transactionReference)

	// qrcode.WriteFile generates the QR code and writes it straight to disk.
	// Args: the content to encode, error-correction level (Medium is a good
	// default - it lets the code still scan even if slightly damaged/blurry),
	// pixel size (256x256), and the output path.
	err := qrcode.WriteFile(content, qrcode.Medium, 256, filename)
	if err != nil {
		return "", err
	}

	return filename, nil
}
