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
		&models.ExchangeRateHistory{},
		&models.Integration{},
	)
	if err != nil {
		log.Fatal("Failed to run migrations: ", err)
	}
	log.Println("database migrated successfully")

	seedIntegrations()
}

// seedIntegrations makes sure known integration records exist, without
// creating duplicates if the server restarts.
func seedIntegrations() {
	knownIntegrations := []models.Integration{
		{Key: "email_provider", Name: "Email Provider", Status: "connected"},
		{Key: "sms_provider", Name: "SMS Provider", Status: "disconnected"},
		{Key: "cloud_storage", Name: "Cloud Storage", Status: "disconnected"},
		{Key: "maps_api", Name: "Maps API", Status: "disconnected"},
		{Key: "exchange_rate_api", Name: "Exchange Rate API", Status: "disconnected"},
	}

	for _, integration := range knownIntegrations {
		var existing models.Integration
		result := DB.Where("key = ?", integration.Key).First(&existing)
		if result.Error != nil {
			// Doesn't exist yet - create it.
			DB.Create(&integration)
		}
	}
}
