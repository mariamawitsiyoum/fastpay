package models

import (
	"time"

	"gorm.io/gorm"
)

type Receipt struct {
	gorm.Model
	TransactionID uint        `gorm:"not null"`
	Transaction   Transaction `gorm:"foreignKey:TransactionID"`
	SharedTime    *time.Time
	SharedVia     string `gorm:"not null"`
	PDFUrl        string `gorm:"not null"`
	UserId        uint   `gorm:"not null"`
	User          User   `gorm:"foreignKey:UserId"`
	QRCodeUrl     string `gorm:"not null"`
}
