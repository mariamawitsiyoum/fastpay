package models

import (
	"time"

	"gorm.io/gorm"
)

type Kyc struct {
	gorm.Model
	UserID       uint
	User         User   `gorm:"foreignKey:UserId"`
	DocumentType string `gorm:"not null; default:passport"`
	IdBack       string
	IdFront      string `gorm:"not null"`
	Status       string `gorm:"not null;default:'pending'"`
	ReviewedAt   *time.Time
	ReviewedBy   uint
	Notes        string
}
