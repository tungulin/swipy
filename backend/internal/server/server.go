package server

import (
	"context"
	"fmt"

	"github.com/tungulin/swipy/config"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_postgres_pool "github.com/tungulin/swipy/internal/core/repository/pool"
	core_http_server "github.com/tungulin/swipy/internal/core/transport/http/server"
)

// Server собирает приложение: общие middleware и маршруты всех фич.
type Server struct {
	cfg    *config.Config
	logger *core_logger.Logger
	pool   core_postgres_pool.Pool
}

func NewServer(cfg *config.Config, logger *core_logger.Logger, pool core_postgres_pool.Pool) *Server {
	return &Server{
		cfg:    cfg,
		logger: logger,
		pool:   pool,
	}
}

func (s *Server) Run(ctx context.Context) error {
	httpServer := core_http_server.NewHTTPServer(s.cfg.HTTP, s.logger)

	s.MapHandlers(httpServer.Router())

	if err := httpServer.Run(ctx); err != nil {
		return fmt.Errorf("run http server: %w", err)
	}

	return nil
}
