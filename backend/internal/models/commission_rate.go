package models

import (
	"gorm.io/gorm"
)

// CommissionRate stores the percentage an agent earns, set by an admin.
// Only one active rate is expected to exist at a time, for now.
type CommissionRate struct {
	gorm.Model
	Percentage float64 `gorm:"not null"` // e.g. 50.0 means 50%
	UpdatedBy  uint    `gorm:"not null"`
}
