package services

import (
	"errors"

	"backend/internal/config"
	"backend/internal/models"
)

// SetExchangeRate creates a new rate, or updates the existing one if a rate
// for this currency pair already exists.
func SetExchangeRate(fromCurrency string, toCurrency string, rate float64, updatedBy uint) (models.ExchangeRate, error) {
	var existing models.ExchangeRate

	// Check if a rate for this exact currency pair already exists.
	result := config.DB.Where("from_currency = ? AND to_currency = ?", fromCurrency, toCurrency).First(&existing)

	if result.Error == nil {
		// Found an existing one - update it instead of creating a duplicate.
		existing.Rate = rate
		existing.UpdatedBy = updatedBy
		if err := config.DB.Save(&existing).Error; err != nil {
			return existing, err
		}
		return existing, nil
	}

	// No existing rate for this pair - create a new one.
	newRate := models.ExchangeRate{
		FromCurrency: fromCurrency,
		ToCurrency:   toCurrency,
		Rate:         rate,
		UpdatedBy:    updatedBy,
	}
	if err := config.DB.Create(&newRate).Error; err != nil {
		return newRate, err
	}
	return newRate, nil
}

// GetExchangeRate looks up the current rate for a currency pair.
func GetExchangeRate(fromCurrency string, toCurrency string) (models.ExchangeRate, error) {
	var rate models.ExchangeRate
	result := config.DB.Where("from_currency = ? AND to_currency = ?", fromCurrency, toCurrency).First(&rate)
	if result.Error != nil {
		return rate, errors.New("exchange rate not found for this currency pair")
	}
	return rate, nil
}
