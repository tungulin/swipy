package users_postgres_repository

import (
	"github.com/jackc/pgx/v5"
	"github.com/tungulin/swipy/internal/core/domain"
)

// userColumns — колонки swipy.users в порядке UserModel.scanDest.
// external_id и language в схеме nullable, а в domain.User это int64 и string,
// поэтому NULL читается как 0 и пустая строка.
const userColumns = `
	id, provider, COALESCE(external_id, 0), first_name, last_name, COALESCE(language, ''),
	username, points, streak_days, timezone
`

type UserModel struct {
	ID         int
	Provider   string
	ExternalID int64
	FirstName  *string
	LastName   *string
	Language   string
	Username   *string
	Points     int
	StreakDays int
	Timezone   string
}

func (m *UserModel) scanDest() []any {
	return []any{
		&m.ID,
		&m.Provider,
		&m.ExternalID,
		&m.FirstName,
		&m.LastName,
		&m.Language,
		&m.Username,
		&m.Points,
		&m.StreakDays,
		&m.Timezone,
	}
}

func (m UserModel) toDomain() domain.User {
	return domain.User{
		ID:         m.ID,
		Provider:   m.Provider,
		ExternalID: m.ExternalID,
		FirstName:  m.FirstName,
		LastName:   m.LastName,
		Language:   m.Language,
		Username:   m.Username,
		Points:     m.Points,
		StreakDays: m.StreakDays,
		Timezone:   m.Timezone,
	}
}

// scanUser читает строку с колонками userColumns.
func scanUser(row pgx.Row) (domain.User, error) {
	var model UserModel

	if err := row.Scan(model.scanDest()...); err != nil {
		return domain.User{}, err
	}

	return model.toDomain(), nil
}
