package users_service

import (
	"context"

	"github.com/tungulin/swipy/internal/core/domain"
)

type UsersService struct {
	usersRepository UsersRepository
}

type UsersRepository interface {
	CreateUser(
		ctx context.Context,
		user domain.User,
	) (domain.User, error)

	InitializeVKUser(
		ctx context.Context,
		user domain.User,
	) (domain.User, error)

	ResetExpiredStreaks(
		ctx context.Context,
		userID int,
	) error

	GetProfile(
		ctx context.Context,
		userID int,
	) (domain.Profile, error)
}

func NewUsersService(usersRepository UsersRepository) *UsersService {
	return &UsersService{
		usersRepository: usersRepository,
	}
}
