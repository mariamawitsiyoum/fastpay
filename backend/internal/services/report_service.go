package services

import (
	"backend/internal/config"
	"backend/internal/models"
)

// DailyReport holds the aggregated numbers for a single day.
type DailyReport struct {
	TotalVolume      float64 `json:"total_volume"`
	TransactionCount int64   `json:"transaction_count"`
	ActiveCustomers  int64   `json:"active_customers"`
	TotalRevenue     float64 `json:"total_revenue"`
}

// GetDailyReport calculates company-wide numbers across ALL transactions
// currently in the database. (Filtering to a specific date range is a
// refinement we can add later - this gives us the full-history totals first.)
func GetDailyReport() (DailyReport, error) {
	var report DailyReport

	// Sum every transaction's Amount into TotalVolume.
	if err := config.DB.Model(&models.Transaction{}).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&report.TotalVolume).Error; err != nil {
		return report, err
	}

	// Count how many transactions exist in total.
	if err := config.DB.Model(&models.Transaction{}).
		Count(&report.TransactionCount).Error; err != nil {
		return report, err
	}

	// Count how many DISTINCT sender phone numbers appear - a rough
	// stand-in for "active customers" until real customer accounts
	// are linked to transactions.
	if err := config.DB.Model(&models.Transaction{}).
		Distinct("sender_phone").
		Count(&report.ActiveCustomers).Error; err != nil {
		return report, err
	}

	// Sum every transaction's Fee - this is the company's actual revenue
	// (as opposed to TotalVolume, which is money moved on customers' behalf).
	if err := config.DB.Model(&models.Transaction{}).
		Select("COALESCE(SUM(fee), 0)").
		Scan(&report.TotalRevenue).Error; err != nil {
		return report, err
	}

	return report, nil
}
