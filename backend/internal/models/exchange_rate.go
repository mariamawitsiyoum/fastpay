package models

import (
	"gorm.io/gorm"
)

type ExchangeRate struct {
	gorm.Model
	FromCurrency string  `gorm:"not null;size:3"`
	ToCurrency   string  `gorm:"not null;size:3"`
	Rate         float64 `gorm:"not null"`
	UpdatedBy    uint    `gorm:"not null"`
}
