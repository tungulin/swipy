package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/tungulin/swipy/config"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_postgres_pool "github.com/tungulin/swipy/internal/core/repository/pool"
	"github.com/tungulin/swipy/internal/server"
	"go.uber.org/zap"
)

func main() {
	ctx, cancel := signal.NotifyContext(
		context.Background(),
		syscall.SIGINT, syscall.SIGTERM,
	)
	defer cancel()

	cfg, err := config.NewConfig()
	if err != nil {
		fmt.Println("failed to load config:", err)
		os.Exit(1)
	}

	logger, err := core_logger.NewLogger(cfg.Logger)
	if err != nil {
		fmt.Println("failed to init logger:", err)
		os.Exit(1)
	}
	defer logger.Close()

	logger.Debug("initialize postgres connection pool")
	pool, err := core_postgres_pool.NewConnectionPool(
		ctx,
		cfg.Postgres,
	)
	if err != nil {
		logger.Fatal("failed to init postgres connection pool", zap.Error(err))
	}

	defer pool.Close()

	logger.Debug("initializing http server")

	server := server.NewServer(cfg, logger, pool)

	if err := server.Run(ctx); err != nil {
		logger.Error("HTTP server run error", zap.Error(err))
	}
}
