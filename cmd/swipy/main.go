package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_http_server "github.com/tungulin/swipy/internal/core/transport/http/server"
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

	logger.Debug("Starting application")

	usersTransportHTTP := users_transport_http.NesUsersHTTPHandler(nil)
	usersRouters := usersTransportHTTP.Routes()

	apiVersionRouter := core_http_server.NewApiVersionRouter(core_http_server.ApiVersion1)
	apiVersionRouter.RegiisterRouters(usersRouters...)

	httpServer := core_http_server.NewHTTPServer(
		core_http_server.NewConfigMust(),
		logger,
	)

	httpServer.RegisterAPIRouters(apiVersionRouter)

	if err := httpServer.Run(ctx); err != nil {
		logger.Error("HTTP server run error", zap.Error(err))
	}
}
