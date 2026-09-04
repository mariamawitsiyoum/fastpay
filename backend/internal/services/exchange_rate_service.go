package services

import (
	"errors"

	"backend/internal/config"
	"backend/internal/models"
)

// ListExchangeRates returns every currency rate on record.
func ListExchangeRates() ([]models.ExchangeRate, error) {
	var rates []models.ExchangeRate
	err := config.DB.Find(&rates).Error
	return rates, err
}

// AddExchangeRate creates a new currency entry. Fails if it already exists.
func AddExchangeRate(currency string, buyRate float64, sellRate float64, updatedBy uint) (models.ExchangeRate, error) {
	var existing models.ExchangeRate
	if err := config.DB.Where("currency = ?", currency).First(&existing).Error; err == nil {
		return existing, errors.New("currency already exists")
	}

	rate := models.ExchangeRate{
		Currency:  currency,
		BuyRate:   buyRate,
		SellRate:  sellRate,
		IsActive:  true,
		UpdatedBy: updatedBy,
	}
	if err := config.DB.Create(&rate).Error; err != nil {
		return rate, err
	}

	logRateHistory(rate)
	return rate, nil
}

// EditExchangeRate updates an existing currency's rate, and logs the old
// value to history first.
func EditExchangeRate(currency string, buyRate float64, sellRate float64, updatedBy uint) (models.ExchangeRate, error) {
	var rate models.ExchangeRate
	if err := config.DB.Where("currency = ?", currency).First(&rate).Error; err != nil {
		return rate, errors.New("currency not found")
	}

	rate.BuyRate = buyRate
	rate.SellRate = sellRate
	rate.UpdatedBy = updatedBy
	if err := config.DB.Save(&rate).Error; err != nil {
		return rate, err
	}

	logRateHistory(rate)
	return rate, nil
}

// SetRateActive activates or deactivates a currency.
func SetRateActive(currency string, active bool) (models.ExchangeRate, error) {
	var rate models.ExchangeRate
	if err := config.DB.Where("currency = ?", currency).First(&rate).Error; err != nil {
		return rate, errors.New("currency not found")
	}
	rate.IsActive = active
	err := config.DB.Save(&rate).Error
	return rate, err
}

// GetRateHistory returns every past recorded rate for a currency, newest first.
func GetRateHistory(currency string) ([]models.ExchangeRateHistory, error) {
	var history []models.ExchangeRateHistory
	err := config.DB.Where("currency = ?", currency).Order("created_at DESC").Find(&history).Error
	return history, err
}

// logRateHistory is a private helper - saves a snapshot whenever a rate changes.
func logRateHistory(rate models.ExchangeRate) {
	entry := models.ExchangeRateHistory{
		Currency:  rate.Currency,
		BuyRate:   rate.BuyRate,
		SellRate:  rate.SellRate,
		UpdatedBy: rate.UpdatedBy,
	}
	config.DB.Create(&entry)
}

// GetPublicRate returns a single blended rate for quick reference
// (the average of buy and sell).
func GetPublicRate(currency string) (models.ExchangeRate, error) {
	var rate models.ExchangeRate
	err := config.DB.Where("currency = ? AND is_active = ?", currency, true).First(&rate).Error
	if err != nil {
		return rate, errors.New("exchange rate not found for this currency")
	}
	return rate, nil
}

// GetAllPublicRates returns every active currency's blended rate.
func GetAllPublicRates() ([]models.ExchangeRate, error) {
	var rates []models.ExchangeRate
	err := config.DB.Where("is_active = ?", true).Find(&rates).Error
	return rates, err
}
