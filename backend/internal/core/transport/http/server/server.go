package core_http_server

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	"go.uber.org/zap"
)

type HTTPServer struct {
	router chi.Router
	config Config
	log    *core_logger.Logger
}

func NewHTTPServer(config Config, log *core_logger.Logger) *HTTPServer {
	return &HTTPServer{
		router: chi.NewRouter(),
		config: config,
		log:    log,
	}
}

func (h *HTTPServer) Router() chi.Router {
	return h.router
}

func (h *HTTPServer) Run(ctx context.Context) error {
	server := &http.Server{
		Addr:    h.config.Addr,
		Handler: h.router,
	}
	h.log.Warn("start HTTP server", zap.String("addr", h.config.Addr))

	ch := make(chan error, 1)

	go func() {
		defer close(ch)
		err := server.ListenAndServe()

		if !errors.Is(err, http.ErrServerClosed) {
			ch <- err
		}

	}()

	select {
	case err := <-ch:
		if err != nil {
			return fmt.Errorf("listen and serve http: %w", err)
		}
	case <-ctx.Done():
		h.log.Warn("shutdown HTTP server")
		shutdownContext, cancel := context.WithTimeout(
			context.Background(),
			h.config.ShutdownTimeout,
		)
		defer cancel()

		if err := server.Shutdown(shutdownContext); err != nil {
			server.Close()

			return fmt.Errorf("shutdown error: %w", err)
		}

		h.log.Warn("HTTP server stopped")
	}

	return nil
}
