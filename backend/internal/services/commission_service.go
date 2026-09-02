package services

import (
	"errors"

	"backend/internal/config"
	"backend/internal/models"
)

// SetCommissionRate creates the commission rate setting, or updates it if
// one already exists - same "update in place" pattern as exchange rates.
func SetCommissionRate(percentage float64, updatedBy uint) (models.CommissionRate, error) {
	var existing models.CommissionRate

	result := config.DB.First(&existing)
	if result.Error == nil {
		existing.Percentage = percentage
		existing.UpdatedBy = updatedBy
		if err := config.DB.Save(&existing).Error; err != nil {
			return existing, err
		}
		return existing, nil
	}

	newRate := models.CommissionRate{
		Percentage: percentage,
		UpdatedBy:  updatedBy,
	}
	if err := config.DB.Create(&newRate).Error; err != nil {
		return newRate, err
	}
	return newRate, nil
}

// getCurrentCommissionRate is a small internal helper - lowercase name means
// it can only be used within this file/package, not called from handlers directly.
func getCurrentCommissionRate() (models.CommissionRate, error) {
	var rate models.CommissionRate
	result := config.DB.First(&rate)
	if result.Error != nil {
		return rate, errors.New("no commission rate has been set yet")
	}
	return rate, nil
}

// CalculateCommission looks up an existing transaction, calculates the
// agent's commission based on the current rate, and saves a Commission record.
func CalculateCommission(transactionID uint, agentID uint) (models.Commission, error) {
	var commission models.Commission

	var txn models.Transaction
	if err := config.DB.First(&txn, transactionID).Error; err != nil {
		return commission, errors.New("transaction not found")
	}

	rate, err := getCurrentCommissionRate()
	if err != nil {
		return commission, err
	}

	// Commission = a percentage of the transaction's fee.
	// e.g. Fee 10.00, rate 50% -> commission = 5.00
	commissionAmount := txn.Fee * (rate.Percentage / 100)

	commission = models.Commission{
		AgentID:       agentID,
		TransactionID: txn.ID,
		Amount:        commissionAmount,
		Status:        "unpaid",
	}

	if err := config.DB.Create(&commission).Error; err != nil {
		return commission, err
	}

	return commission, nil
}
