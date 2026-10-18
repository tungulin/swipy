package users_postgres_repository

import (
	"context"
	"fmt"

	"github.com/tungulin/swipy/internal/core/domain"
)

func (r *UsersRepository) InitializeUser(
	ctx context.Context,
	user domain.User,
) (domain.User, error) {
	ctx, cancel := context.WithTimeout(ctx, r.pool.OpTimeout())
	defer cancel()

	query := `
		INSERT INTO swipy.users (provider, external_id, first_name, last_name, language)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (provider, external_id) DO UPDATE SET provider = EXCLUDED.provider
		RETURNING ` + userColumns

	row := r.pool.QueryRow(ctx, query, user.Provider, user.ExternalID, user.FirstName, user.LastName, user.Language)

	initialized, err := scanUser(row)
	if err != nil {
		return domain.User{}, fmt.Errorf("scan error: %w", err)
	}

	return initialized, nil
}
