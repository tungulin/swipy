package users_transport_http

import (
	"context"
	"net/http"

	"github.com/tungulin/swipy/internal/core/domain"
	core_http_middleware "github.com/tungulin/swipy/internal/core/transport/http/middleware"
	core_http_server "github.com/tungulin/swipy/internal/core/transport/http/server"
)

type UsersHTTPHandler struct {
	userService    UsersService
	vkConfig       VKConfig
	authMiddleware core_http_middleware.Middleware
}

type UsersService interface {
	CreateUser(
		ctx context.Context,
		user domain.User,
	) (domain.User, error)

	InitializeVKUser(
		ctx context.Context,
		user domain.User,
	) (domain.User, error)

	GetMe(
		ctx context.Context,
		userID int,
	) (domain.Profile, error)
}

func NewUsersHTTPHandler(
	usersService UsersService,
	vkConfig VKConfig,
	authMiddleware core_http_middleware.Middleware,
) *UsersHTTPHandler {
	return &UsersHTTPHandler{
		userService:    usersService,
		vkConfig:       vkConfig,
		authMiddleware: authMiddleware,
	}
}

func (h *UsersHTTPHandler) Routes() []core_http_server.Route {
	return []core_http_server.Route{
		{
			Method:  http.MethodPost,
			Path:    "/users",
			Handler: h.CreateUser,
		},
		{
			Method:  http.MethodPost,
			Path:    "/users/initialize/vk",
			Handler: h.InitializeVKUser,
		},
		{
			Method:     http.MethodGet,
			Path:       "/users/me",
			Handler:    h.GetMe,
			Middleware: [
				core_http_middleware.Auth()
			]
		},
	}
}
// []core_http_middleware.Middleware{h.authMiddleware},