package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model

	Name         string `gorm:"not null"`
	Email        string `gorm:"unique;not null"`
	PasswordHash string `gorm:"not null"`
	PhoneNumber  string `gorm:"unique;not null"`
	Role         string `gorm:"not null; default:customer"`
}
