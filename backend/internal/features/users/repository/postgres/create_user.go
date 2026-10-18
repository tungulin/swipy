package users_postgres_repository

import (
	"context"
	"fmt"

	"github.com/tungulin/swipy/internal/core/domain"
)

func (r *UsersRepository) CreateUser(
	ctx context.Context,
	user domain.User,
) (domain.User, error) {
	ctx, cancel := context.WithTimeout(ctx, r.pool.OpTimeout())
	defer cancel()

	query := `
		INSERT INTO swipy.users (provider, external_id, first_name, last_name, language)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, provider, external_id, first_name, last_name, language
	`

	row := r.pool.QueryRow(ctx, query, user.Provider, user.ExternalID, user.FirstName, user.LastName, user.Language)

	var userModel UserModel

	err := row.Scan(
		&userModel.ID,
		&userModel.Provider,
		&userModel.ExternalID,
		&userModel.FirstName,
		&userModel.LastName,
		&userModel.Language,
	)

	if err != nil {
		return domain.User{}, fmt.Errorf("scan error:  %w", err)
	}

	userDomain := domain.NewUser(
		userModel.ID,
		userModel.Provider,
		userModel.ExternalID,
		userModel.FirstName,
		userModel.LastName,
		userModel.Language,
	)

	return userDomain, nil

}
