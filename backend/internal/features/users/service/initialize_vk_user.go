package users_service

import (
	"context"
	"fmt"

	"github.com/tungulin/swipy/internal/core/domain"
)

func (s *UsersService) InitializeVKUser(
	ctx context.Context,
	user domain.User,
) (domain.User, error) {
	if err := user.Validate(); err != nil {
		return domain.User{}, fmt.Errorf("validate user domain: %w", err)
	}

	user, err := s.usersRepository.InitializeVKUser(ctx, user)
	if err != nil {
		return domain.User{}, fmt.Errorf("create user: %w", err)
	}

	return user, nil
}
