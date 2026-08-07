package models

import (
	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model

	// Unique human-readable reference for tracking (e.g., "FP-172285-XYZ")
	Reference string `gorm:"uniqueIndex;not null"`

	// Type of transaction: "cash_in", "cash_out", "transfer"
	Type string `gorm:"not null"`

	// Financials
	Amount          float64 `gorm:"type:decimal(15,2);not null"`
	Fee             float64 `gorm:"type:decimal(15,2);default:0.00"`
	AgentCommission float64 `gorm:"type:decimal(15,2);default:0.00"` // Earned by the facilitating Agent

	// Currency & Exchange Rate details
	Currency       string  `gorm:"size:3;not null;default:'ETB'"` // e.g., "USD", "ETB"
	TargetCurrency string  `gorm:"size:3"`                        // Filled if currency exchange occurs
	ExchangeRate   float64 `gorm:"type:decimal(10,4);default:1.0"`

	// Participants
	SenderPhone    string `gorm:"not null"`
	RecipientPhone string `gorm:"not null"`

	// Relationships
	AgentID *uint  `gorm:"index"` // The agent who processed this (optional for direct user-to-user transfers)
	Agent   *Agent `gorm:"foreignKey:AgentID"`

	// Status: "pending", "completed", "failed", "reversed"
	Status string `gorm:"not null;default:'pending'"`

	// Receipt Metadata
	ReceiptURL string // Path to the generated PDF receipt
}
