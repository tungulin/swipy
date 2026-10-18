package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_postgres_pool "github.com/tungulin/swipy/internal/core/repository/pool"
	core_http_middleware "github.com/tungulin/swipy/internal/core/transport/http/middleware"
	core_http_server "github.com/tungulin/swipy/internal/core/transport/http/server"
	"github.com/tungulin/swipy/internal/features/users"
	users_transport_http "github.com/tungulin/swipy/internal/features/users/transport/http"
	"go.uber.org/zap"
)

func main() {
	ctx, cancel := signal.NotifyContext(
		context.Background(),
		syscall.SIGINT, syscall.SIGTERM,
	)
	defer cancel()

	logger, err := core_logger.NewLogger(core_logger.NewConfigMust())
	if err != nil {
		fmt.Println("failed to init logger:", err)
		os.Exit(1)
	}
	defer logger.Close()

	pool, err := core_postgres_pool.NewConnectionPool(
		ctx,
		core_postgres_pool.NewConfigMust(),
	)

	logger.Debug("initialize postgres connection pool")
	if err != nil {
		logger.Fatal("failed to init postgres connection pool", zap.Error(err))
	}
	defer pool.Close()

	logger.Debug("initializing feature", zap.String("feature", "users"))
	vkConfig := users_transport_http.NewVKConfigMust()

	authMiddleware := users.NewAuthMiddleware(pool, vkConfig)
	usersHandler := users.NewHTTPHandler(pool, vkConfig, authMiddleware)

	logger.Debug("initializing http server")

	httpServer := core_http_server.NewHTTPServer(
		core_http_server.NewConfigMust(),
		logger,
		core_http_middleware.RequestID(),
		core_http_middleware.Logger(logger),
		core_http_middleware.Panic(),
		core_http_middleware.Trace(),
	)
	apiVersionRouter := core_http_server.NewApiVersionRouter(core_http_server.ApiVersion1)
	apiVersionRouter.RegisterRouters(usersHandler.Routes()...)
	httpServer.RegisterAPIRouters(apiVersionRouter)

	if err := httpServer.Run(ctx); err != nil {
		logger.Error("HTTP server run error", zap.Error(err))
	}
}
