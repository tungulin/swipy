package core_http_middleware

import (
	"context"

	"github.com/tungulin/swipy/config"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
)

type UserIDResolver interface {
	GetUserID(ctx context.Context, provider string, externalID int64) (int, error)
}

type MiddlewareManager struct {
	log          *core_logger.Logger
	cfg          *config.Config
	userResolver UserIDResolver
}

func NewMiddlewareManager(
	log *core_logger.Logger,
	cfg *config.Config,
	userResolver UserIDResolver,
) *MiddlewareManager {
	return &MiddlewareManager{
		log:          log,
		cfg:          cfg,
		userResolver: userResolver,
	}
}
