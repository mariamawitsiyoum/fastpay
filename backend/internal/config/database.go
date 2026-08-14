package config

import (
	"backend/internal/models"
	"log"
	"os"

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

	// Pre-migration: safely add phone_number as nullable if it doesn't exist yet,
	// then backfill any NULL values before AutoMigrate enforces NOT NULL.
	if DB.Migrator().HasTable("users") {
		if !DB.Migrator().HasColumn(&models.User{}, "phone_number") {
			if err := DB.Exec(`ALTER TABLE "users" ADD COLUMN "phone_number" text`).Error; err != nil {
				log.Fatal("Failed to add phone_number column: ", err)
			}
		}
		// Backfill existing NULLs so the NOT NULL constraint can be applied.
		if err := DB.Exec(`UPDATE "users" SET "phone_number" = 'N/A' WHERE "phone_number" IS NULL`).Error; err != nil {
			log.Fatal("Failed to backfill phone_number: ", err)
		}
	}

	err = DB.AutoMigrate(
		&models.User{},
		&models.Agent{},
		&models.Transaction{},
		&models.Commission{},
		&models.Kyc{},
		&models.Receipt{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migrated successfully")
}
