package models

import (
	"time"

	"gorm.io/gorm"
)

// Integration tracks the connection status of an external service.
type Integration struct {
	gorm.Model
	Key           string `gorm:"not null;uniqueIndex"` // e.g. "email_provider"
	Name          string `gorm:"not null"`             // e.g. "Email Provider"
	Status        string `gorm:"not null;default:'disconnected'"`
	LastSuccessAt *time.Time
}
