package users_transport_http

import (
	"context"
	"net/http"

	"github.com/tungulin/swipy/internal/core/domain"
	core_http_server "github.com/tungulin/swipy/internal/core/transport/http/server"
)

type UsersHTTPHandler struct {
	userService UsersService
	vkConfig    VKConfig
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
}

func NewUsersHTTPHandler(usersService UsersService, vkConfig VKConfig) *UsersHTTPHandler {
	return &UsersHTTPHandler{
		userService: usersService,
		vkConfig:    vkConfig,
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
	}
}
