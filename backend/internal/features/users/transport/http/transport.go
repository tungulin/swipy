package users_transport_http

import (
	"context"

	"github.com/tungulin/swipy/internal/core/domain"
)

type UsersHTTPHandler struct {
	userService UsersService
}

type UsersService interface {
	InitializeUser(
		ctx context.Context,
		user domain.User,
	) (domain.User, error)

	GetMe(
		ctx context.Context,
		userID int,
	) (domain.Profile, error)
}

func NewUsersHTTPHandler(usersService UsersService) *UsersHTTPHandler {
	return &UsersHTTPHandler{
		userService: usersService,
	}
}
