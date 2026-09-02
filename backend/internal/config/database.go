package config

import (
	"log"
	"os"

	"backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DATABASE_URL")
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}
	log.Println("database connected successfull")

	// AutoMigrate creates/updates tables in the database to match
	// these Go structs. Run this every time a model changes shape.
	err = DB.AutoMigrate(
		&models.User{},
		&models.Agent{},
		&models.Kyc{},
		&models.Transaction{},
		&models.Recepit{},
		&models.Commission{},
		&models.ExchangeRate{},
		&models.CommissionRate{},
	)
	if err != nil {
		log.Fatal("Failed to run migrations: ", err)
	}
	log.Println("database migrated successfully")
}
