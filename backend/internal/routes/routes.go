package routes

import (
	"backend/internal/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	kyc := router.Group("/kyc")
	{
		kyc.POST("/upload", handlers.UploadKYC)
		kyc.GET("/me", handlers.GetMyKYCStatus)
		kyc.GET("/pending", handlers.GetPendingKYC)
		kyc.PATCH("/:id/approve", handlers.ApproveKYC)
		kyc.PATCH("/:id/reject", handlers.RejectKYC)
	}
	receipts := router.Group("/receipts")
	{
		receipts.POST("/generate", handlers.GenerateReceipt)
		receipts.GET("/:id", handlers.GetReceipt)
		receipts.POST("/:id/share", handlers.ShareReceipt)
		receipts.GET("/verify/:id", handlers.VerifyReceipt)
	}
	// Public, simple lookup - matches the spec's /exchange-rate (singular)
	router.GET("/exchange-rate", handlers.GetPublicRate)
	router.GET("/exchange-rate/all", handlers.GetAllPublicRates)

	// Admin CRUD - matches the spec's /exchange-rates (plural)
	exchangeRates := router.Group("/exchange-rates")
	{
		exchangeRates.GET("/", handlers.ListExchangeRates)
		exchangeRates.POST("/", handlers.AddExchangeRate)
		exchangeRates.PUT("/:currency", handlers.EditExchangeRate)
		exchangeRates.PATCH("/:currency/activate", handlers.ActivateExchangeRate)
		exchangeRates.PATCH("/:currency/deactivate", handlers.DeactivateExchangeRate)
		exchangeRates.GET("/:currency/history", handlers.GetRateHistory)
	}
	commission := router.Group("/commission")
	{
		commission.POST("/rate", handlers.SetCommissionRate)
		commission.POST("/calculate", handlers.CalculateCommission)
	}
	reports := router.Group("/reports")
	{
		reports.GET("/daily-volume", handlers.GetDailyVolume)
		reports.GET("/revenue", handlers.GetRevenue)
		reports.GET("/active-customers", handlers.GetActiveCustomers)
		reports.GET("/top-corridors", handlers.GetTopCorridors)
	}
	integrations := router.Group("/integrations")
	{
		integrations.GET("/", handlers.ListIntegrations)
		integrations.POST("/:key/test", handlers.TestIntegration)
	}
}
