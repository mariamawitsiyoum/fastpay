package services

import (
	"fmt"
	"net/smtp"
	"os"
)

// SendReceiptEmail sends the generated PDF receipt to the customer's email.
// Note: this is a simple version - it describes the receipt and its location,
// it does not attach the actual PDF file yet (that's a slightly more advanced
// step in Go, called MIME attachments - we can add it once this basic version works).
func SendReceiptEmail(toEmail string, transactionReference string, pdfPath string) error {
	smtpEmail := os.Getenv("SMTP_EMAIL")
	smtpPassword := os.Getenv("SMTP_PASSWORD")

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	// smtp.PlainAuth builds the login credentials gofpdf... no wait, this
	// is net/smtp (Go's built-in mail package) needs to authenticate with Gmail.
	auth := smtp.PlainAuth("", smtpEmail, smtpPassword, smtpHost)

	subject := fmt.Sprintf("Your FastPay Receipt - %s", transactionReference)
	body := fmt.Sprintf(
		"Hello,\r\n\r\nYour transaction (%s) has been completed.\r\nYour receipt has been generated and is available at: %s\r\n\r\nThank you for using FastPay.",
		transactionReference, pdfPath,
	)

	// Emails sent via net/smtp need to be built as raw text following a
	// specific format: headers, then a blank line, then the body.
	message := []byte(fmt.Sprintf("Subject: %s\r\n\r\n%s", subject, body))

	err := smtp.SendMail(
		smtpHost+":"+smtpPort,
		auth,
		smtpEmail,         // from
		[]string{toEmail}, // to
		message,
	)
	if err != nil {
		return err
	}

	return nil
}
