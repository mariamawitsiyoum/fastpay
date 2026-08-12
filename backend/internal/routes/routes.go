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
}
