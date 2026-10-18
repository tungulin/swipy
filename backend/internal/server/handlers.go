package server

import (
	"github.com/go-chi/chi/v5"
	core_http_middleware "github.com/tungulin/swipy/internal/core/transport/http/middleware"
	users_postgres_repository "github.com/tungulin/swipy/internal/features/users/repository/postgres"
	users_service "github.com/tungulin/swipy/internal/features/users/service"
	users_transport_http "github.com/tungulin/swipy/internal/features/users/transport/http"
)

func (s *Server) MapHandlers(router chi.Router) {
	// Init repositories
	userRepo := users_postgres_repository.NewUsersRepository(s.pool)

	// Init services
	userService := users_service.NewUsersService(userRepo)

	// Init handlers
	usersHandler := users_transport_http.NewUsersHTTPHandler(userService)

	mw := core_http_middleware.NewMiddlewareManager(s.logger, s.cfg, userRepo)

	router.Use(mw.RequestID)
	router.Use(mw.Logger)
	router.Use(mw.Panic)
	router.Use(mw.Trace)

	// Map routes
	router.Get("/docs", DocsHandler)

	router.Route("/api/v1", func(r chi.Router) {
		users_transport_http.MapRoutes(r, usersHandler, mw)
	})
}
