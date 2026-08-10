package routes

import (
	"backend/internal/handlers"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes wires up all URL paths to their handler functions.
// This is the "sign at the shop door" - it tells Gin which function
// to call for each incoming request path + method.
func RegisterRoutes(router *gin.Engine) {
	kyc := router.Group("/kyc")
	{
		kyc.POST("/upload", handlers.UploadKYC)
	}
}
