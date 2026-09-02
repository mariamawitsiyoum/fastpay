package routes

import (
	"backend/internal/handlers"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	kyc := router.Group("/kyc")
	{
		kyc.POST("/upload", handlers.UploadKYC)
		kyc.GET("/pending", handlers.GetPendingKYC)
		kyc.PATCH("/:id/review", handlers.ReviewKYC)
	}

	receipts := router.Group("/receipts")
	{
		receipts.POST("/:reference/generate", handlers.GenerateReceipt)
	}
	exchangeRate := router.Group("/exchange-rate")
	{
		exchangeRate.POST("/", handlers.SetExchangeRate)
		exchangeRate.GET("/", handlers.GetExchangeRate)
	}
	commission := router.Group("/commission")
	{
		commission.POST("/rate", handlers.SetCommissionRate)
		commission.POST("/calculate", handlers.CalculateCommission)
	}
}
