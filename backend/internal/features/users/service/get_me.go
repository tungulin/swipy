package users_service

import (
	"context"
	"fmt"

	"github.com/tungulin/swipy/internal/core/domain"
)

func (s *UsersService) GetMe(
	ctx context.Context,
	userID int,
) (domain.Profile, error) {
	if err := s.usersRepository.ResetExpiredStreaks(ctx, userID); err != nil {
		return domain.Profile{}, fmt.Errorf("reset expired streaks: %w", err)
	}

	profile, err := s.usersRepository.GetProfile(ctx, userID)
	if err != nil {
		return domain.Profile{}, fmt.Errorf("get profile: %w", err)
	}

	return profile, nil
}
