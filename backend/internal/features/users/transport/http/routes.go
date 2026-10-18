package users_transport_http

import (
	"github.com/go-chi/chi/v5"
	core_http_middleware "github.com/tungulin/swipy/internal/core/transport/http/middleware"
)

func MapRoutes(r chi.Router, h *UsersHTTPHandler, mw *core_http_middleware.MiddlewareManager) {
	r.With(mw.AuthIdentityMiddleware).Post("/users/initialize", h.InitializeUser)
	r.With(mw.AuthUserMiddleware).Get("/users/me", h.GetMe)
}
