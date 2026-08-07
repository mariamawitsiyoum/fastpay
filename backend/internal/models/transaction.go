package models

import (
	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model

	Reference string `gorm:"uniqueIndex;not null"`
	Type      string `gorm:"not null"`

	Amount          float64 `gorm:"type:decimal(15,2);not null"`
	Fee             float64 `gorm:"type:decimal(15,2);default:0.00"`
	AgentCommission float64 `gorm:"type:decimal(15,2);default:0.00"`

	Currency       string  `gorm:"size:3;not null;default:'ETB'"`
	TargetCurrency string  `gorm:"size:3"`
	ExchangeRate   float64 `gorm:"type:decimal(10,4);default:1.0"`

	SenderPhone    string `gorm:"not null"`
	RecipientPhone string `gorm:"not null"`
	AgentID        *uint  `gorm:"index"`
	Agent          *Agent `gorm:"foreignKey:AgentID"`

	Status string `gorm:"not null;default:'pending'"`

	ReceiptURL string
}
