package users_postgres_repository

import (
	"context"
	"fmt"
)

// ResetExpiredStreaks обнуляет серию пользователя и его забеги, если день последнего
// выполнения (по поясу участника) раньше вчерашнего. Ленивый сброс, см. docs/db.md.
func (r *UsersRepository) ResetExpiredStreaks(
	ctx context.Context,
	userID int,
) error {
	ctx, cancel := context.WithTimeout(ctx, r.pool.OpTimeout())
	defer cancel()

	query := `
		WITH reset_user AS (
			UPDATE swipy.users
			SET streak_days = 0
			WHERE id = $1
				AND streak_days > 0
				AND (last_completed_date AT TIME ZONE timezone)::date < (now() AT TIME ZONE timezone)::date - 1
		)
		UPDATE swipy.friend_race AS fr
		SET streak_days = 0
		FROM swipy.users AS ua, swipy.users AS ub
		WHERE ua.id = fr.user_a_id
			AND ub.id = fr.user_b_id
			AND $1 IN (fr.user_a_id, fr.user_b_id)
			AND fr.streak_days > 0
			AND (
				(fr.user_a_last_done AT TIME ZONE ua.timezone)::date < (now() AT TIME ZONE ua.timezone)::date - 1
				OR (fr.user_b_last_done AT TIME ZONE ub.timezone)::date < (now() AT TIME ZONE ub.timezone)::date - 1
			)
	`

	if _, err := r.pool.Exec(ctx, query, userID); err != nil {
		return fmt.Errorf("exec error: %w", err)
	}

	return nil
}
