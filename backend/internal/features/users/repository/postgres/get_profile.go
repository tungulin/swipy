package users_postgres_repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/tungulin/swipy/internal/core/domain"
	core_errors "github.com/tungulin/swipy/internal/core/errors"
)

const (
	profileFriendRacesLimit  = 5
	profileAchievementsLimit = 4
)

func (r *UsersRepository) GetProfile(
	ctx context.Context,
	userID int,
) (domain.Profile, error) {
	ctx, cancel := context.WithTimeout(ctx, r.pool.OpTimeout())
	defer cancel()

	profile, err := r.getProfileHeader(ctx, userID)
	if err != nil {
		return domain.Profile{}, fmt.Errorf("get header: %w", err)
	}

	if profile.Courses, err = r.getProfileCourses(ctx, userID); err != nil {
		return domain.Profile{}, fmt.Errorf("get courses: %w", err)
	}

	if profile.FriendRaces, err = r.getProfileFriendRaces(ctx, userID); err != nil {
		return domain.Profile{}, fmt.Errorf("get friend races: %w", err)
	}

	if profile.Achievements, err = r.getProfileAchievements(ctx, userID); err != nil {
		return domain.Profile{}, fmt.Errorf("get achievements: %w", err)
	}

	return profile, nil
}

func (r *UsersRepository) getProfileHeader(ctx context.Context, userID int) (domain.Profile, error) {
	query := `
		SELECT ` + userColumns + `,
			(SELECT count(*) FROM swipy.follow WHERE following_id = users.id),
			(SELECT count(*) FROM swipy.follow WHERE follower_id = users.id)
		FROM swipy.users
		WHERE id = $1
	`

	var (
		model UserModel
		stats domain.ProfileStats
	)

	dest := append(model.scanDest(), &stats.FollowersCount, &stats.FollowingCount)

	err := r.pool.QueryRow(ctx, query, userID).Scan(dest...)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.Profile{}, fmt.Errorf("user %d: %w", userID, core_errors.ErrNotFound)
	}

	if err != nil {
		return domain.Profile{}, fmt.Errorf("scan error: %w", err)
	}

	return domain.Profile{
		User:  model.toDomain(),
		Stats: stats,
	}, nil
}

func (r *UsersRepository) getProfileCourses(ctx context.Context, userID int) ([]domain.Course, error) {
	query := `
		SELECT ulp.id, l.code, l.name, l.icon, ulp.level
		FROM swipy.user_language_pair AS ulp
		JOIN swipy.language AS l ON l.id = ulp.learning_language_id
		WHERE ulp.user_id = $1
		ORDER BY ulp.created_at, ulp.id
	`

	rows, err := r.pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}
	defer rows.Close()

	courses := make([]domain.Course, 0)

	for rows.Next() {
		var course domain.Course

		err := rows.Scan(
			&course.ID,
			&course.Language.Code,
			&course.Language.Name,
			&course.Language.Icon,
			&course.Level,
		)
		if err != nil {
			return nil, fmt.Errorf("scan error: %w", err)
		}

		courses = append(courses, course)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return courses, nil
}

func (r *UsersRepository) getProfileFriendRaces(ctx context.Context, userID int) ([]domain.FriendRace, error) {
	query := `
		SELECT fr.id, f.id, f.username, fr.streak_days
		FROM swipy.friend_race AS fr
		JOIN swipy.users AS f
			ON f.id = CASE WHEN fr.user_a_id = $1 THEN fr.user_b_id ELSE fr.user_a_id END
		WHERE $1 IN (fr.user_a_id, fr.user_b_id)
		ORDER BY fr.streak_days DESC, fr.id
		LIMIT $2
	`

	rows, err := r.pool.Query(ctx, query, userID, profileFriendRacesLimit)
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}
	defer rows.Close()

	races := make([]domain.FriendRace, 0)

	for rows.Next() {
		var race domain.FriendRace

		err := rows.Scan(
			&race.ID,
			&race.Friend.ID,
			&race.Friend.Username,
			&race.StreakDays,
		)
		if err != nil {
			return nil, fmt.Errorf("scan error: %w", err)
		}

		races = append(races, race)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return races, nil
}

// getProfileAchievements возвращает сначала полученные награды (новые первыми) с иконкой
// текущего уровня, затем случайные неполученные с иконкой уровня 1.
func (r *UsersRepository) getProfileAchievements(ctx context.Context, userID int) ([]domain.ProfileAchievement, error) {
	query := `
		SELECT a.id, al.icon_url, ua.user_id IS NULL AS is_locked
		FROM swipy.achievement AS a
		LEFT JOIN swipy.user_achievement AS ua
			ON ua.achievement_id = a.id AND ua.user_id = $1
		JOIN swipy.achievement_level AS al
			ON al.achievement_id = a.id AND al.level = COALESCE(ua.level, 1)
		ORDER BY is_locked, ua.unlocked_at DESC, random()
		LIMIT $2
	`

	rows, err := r.pool.Query(ctx, query, userID, profileAchievementsLimit)
	if err != nil {
		return nil, fmt.Errorf("query error: %w", err)
	}
	defer rows.Close()

	achievements := make([]domain.ProfileAchievement, 0)

	for rows.Next() {
		var achievement domain.ProfileAchievement

		err := rows.Scan(
			&achievement.ID,
			&achievement.IconURL,
			&achievement.IsLocked,
		)
		if err != nil {
			return nil, fmt.Errorf("scan error: %w", err)
		}

		achievements = append(achievements, achievement)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return achievements, nil
}
