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
		INSERT INTO swipy.users (first_name, last_name, avatar_url, language)
		VALUES ($1, $2, $3, $4)
		RETURNING id, first_name, last_name, avatar_url, language
	`

	row := r.pool.QueryRow(ctx, query, user.FirstName, user.LastName, user.AvatarURL, user.Language)

	var userModel UserModel

	err := row.Scan(
		&userModel.ID,
		&userModel.FirstName,
		&userModel.LastName,
		&userModel.AvatarURL,
		&userModel.Language,
	)

	if err != nil {
		return domain.User{}, fmt.Errorf("scan error:  %w", err)
	}

	userDomain := domain.NewUser(
		userModel.ID,
		userModel.FirstName,
		userModel.LastName,
		userModel.AvatarURL,
		userModel.Language,
	)

	return userDomain, nil

}
