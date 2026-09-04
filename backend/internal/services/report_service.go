package services

import (
	"time"

	"backend/internal/config"
	"backend/internal/models"
)

type DailyPoint struct {
	Date  string  `json:"date"`
	Value float64 `json:"value"`
}

// parseDateRange applies default values if from/to aren't provided -
// defaults to the last 30 days.
func parseDateRange(from string, to string) (time.Time, time.Time) {
	toTime := time.Now()
	fromTime := toTime.AddDate(0, 0, -30)

	if parsed, err := time.Parse("2006-01-02", from); err == nil {
		fromTime = parsed
	}
	if parsed, err := time.Parse("2006-01-02", to); err == nil {
		toTime = parsed
	}
	return fromTime, toTime
}

// GetDailyVolume returns total transaction amount, grouped by day.
func GetDailyVolume(from string, to string) ([]DailyPoint, error) {
	fromTime, toTime := parseDateRange(from, to)
	var results []DailyPoint

	err := config.DB.Model(&models.Transaction{}).
		Select("TO_CHAR(created_at, 'YYYY-MM-DD') as date, COALESCE(SUM(amount), 0) as value").
		Where("created_at BETWEEN ? AND ?", fromTime, toTime).
		Group("TO_CHAR(created_at, 'YYYY-MM-DD')").
		Order("date").
		Scan(&results).Error

	return results, err
}

// GetRevenue returns total fee revenue, grouped by day.
func GetRevenue(from string, to string) ([]DailyPoint, error) {
	fromTime, toTime := parseDateRange(from, to)
	var results []DailyPoint

	err := config.DB.Model(&models.Transaction{}).
		Select("TO_CHAR(created_at, 'YYYY-MM-DD') as date, COALESCE(SUM(fee), 0) as value").
		Where("created_at BETWEEN ? AND ?", fromTime, toTime).
		Group("TO_CHAR(created_at, 'YYYY-MM-DD')").
		Order("date").
		Scan(&results).Error

	return results, err
}

// GetActiveCustomers returns count of distinct senders, grouped by day.
func GetActiveCustomers(from string, to string) ([]DailyPoint, error) {
	fromTime, toTime := parseDateRange(from, to)
	var results []DailyPoint

	err := config.DB.Model(&models.Transaction{}).
		Select("TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(DISTINCT sender_phone) as value").
		Where("created_at BETWEEN ? AND ?", fromTime, toTime).
		Group("TO_CHAR(created_at, 'YYYY-MM-DD')").
		Order("date").
		Scan(&results).Error

	return results, err
}

type CorridorResult struct {
	Origin            string  `json:"origin"`
	Destination       string  `json:"destination"`
	TotalTransactions int64   `json:"total_transactions"`
	TotalVolume       float64 `json:"total_volume"`
}

// GetTopCorridors returns the busiest currency/sender-recipient routes.
// Simplified for now: grouped by currency + target_currency as a stand-in
// for real origin/destination country data, which doesn't exist yet.
func GetTopCorridors(limit int) ([]CorridorResult, error) {
	var results []CorridorResult

	err := config.DB.Model(&models.Transaction{}).
		Select("currency as origin, target_currency as destination, COUNT(*) as total_transactions, COALESCE(SUM(amount),0) as total_volume").
		Group("currency, target_currency").
		Order("total_volume DESC").
		Limit(limit).
		Scan(&results).Error

	return results, err
}
