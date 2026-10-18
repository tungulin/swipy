package users_postgres_repository

import (
	"context"
	"fmt"

	"github.com/tungulin/swipy/internal/core/domain"
	"github.com/tungulin/swipy/internal/core/tools"
)

func (r *UsersRepository) InitializeUser(
	ctx context.Context,
	user domain.User,
) (domain.User, error) {
	ctx, cancel := context.WithTimeout(ctx, r.pool.OpTimeout())
	defer cancel()

	// id резервируется заранее, чтобы собрать ник <животное>_<id> в том же INSERT.
	// При конфликте значение из sequence просто пропадает, как и при обычном SERIAL.
	query := `
		WITH next AS (
			SELECT nextval(pg_get_serial_sequence('swipy.users', 'id')) AS id
		)
		INSERT INTO swipy.users (id, provider, external_id, first_name, last_name, language, username)
		SELECT next.id, $1, $2, $3, $4, $5, $6::text || '_' || next.id
		FROM next
		ON CONFLICT (provider, external_id) DO UPDATE SET provider = EXCLUDED.provider
		RETURNING ` + userColumns

	row := r.pool.QueryRow(
		ctx, query,
		user.Provider, user.ExternalID, user.FirstName, user.LastName, user.Language,
		tools.GenerateUserName(),
	)

	initialized, err := scanUser(row)
	if err != nil {
		return domain.User{}, fmt.Errorf("scan error: %w", err)
	}

	return initialized, nil
}
