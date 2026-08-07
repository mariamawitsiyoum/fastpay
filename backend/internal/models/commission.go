package models

import (
	"time"

	"gorm.io/gorm"
)

type Commission struct {
	gorm.Model
	AgentID       uint        `gorm:"not null;index"`
	Agent         Agent       `gorm:"foreignKey:AgentID"`
	TransactionID uint        `gorm:"not null;uniqueIndex"`
	Transaction   Transaction `gorm:"foreignKey:TransactionID"`
	Amount        float64     `gorm:"type:decimal(15,2);not null"`
	Status        string      `gorm:"not null;default:'unpaid'"`
	PaidAt        *time.Time
	Notes         string
}
