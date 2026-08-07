package models

import (
	"gorm.io/gorm"
)

type Agent struct {
	gorm.Model
	UserId       uint
	User         User
	BusinessName string  `gorm:"not null"`
	PhoneNumber  string  `gorm:"unique;not null"`
	Status       string  `gorm:"not null; default:pending" `
	Latitude     float64 `gorm:"not null"`
	Longitude    float64 `gorm:"not null"`
	Bank         string  `gorm:"not null"`
}
