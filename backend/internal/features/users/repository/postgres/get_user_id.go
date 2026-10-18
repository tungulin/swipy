package users_postgres_repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	core_errors "github.com/tungulin/swipy/internal/core/errors"
)

func (r *UsersRepository) GetUserID(
	ctx context.Context,
	provider string,
	externalID int64,
) (int, error) {
	ctx, cancel := context.WithTimeout(ctx, r.pool.OpTimeout())
	defer cancel()

	query := `
		SELECT id
		FROM swipy.users
		WHERE provider = $1 AND external_id = $2
	`

	var id int

	err := r.pool.QueryRow(ctx, query, provider, externalID).Scan(&id)
	if errors.Is(err, pgx.ErrNoRows) {
		return 0, fmt.Errorf("user %s/%d: %w", provider, externalID, core_errors.ErrNotFound)
	}

	if err != nil {
		return 0, fmt.Errorf("scan error: %w", err)
	}

	return id, nil
}
