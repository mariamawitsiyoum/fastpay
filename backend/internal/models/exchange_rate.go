package models

import (
	"gorm.io/gorm"
)

// ExchangeRate stores the current buy/sell rate for one currency, set by an admin.
type ExchangeRate struct {
	gorm.Model
	Currency  string  `gorm:"not null;uniqueIndex;size:3"` // e.g. "USD"
	BuyRate   float64 `gorm:"not null"`
	SellRate  float64 `gorm:"not null"`
	IsActive  bool    `gorm:"not null;default:true"`
	UpdatedBy uint    `gorm:"not null"`
}

// ExchangeRateHistory records every past rate, so changes can be reviewed later.
type ExchangeRateHistory struct {
	gorm.Model
	Currency  string  `gorm:"not null;size:3"`
	BuyRate   float64 `gorm:"not null"`
	SellRate  float64 `gorm:"not null"`
	UpdatedBy uint    `gorm:"not null"`
}
