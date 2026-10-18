package users_transport_http

import (
	"net/http"

	"github.com/tungulin/swipy/internal/core/domain"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_http_middleware "github.com/tungulin/swipy/internal/core/transport/http/middleware"
	core_http_response "github.com/tungulin/swipy/internal/core/transport/http/response"
)

type GetMeResponse struct {
	ID           int                   `json:"id"`
	FirstName    *string               `json:"first_name"`
	LastName     *string               `json:"last_name"`
	Username     string                `json:"username"`
	Points       int                   `json:"points"`
	Stats        StatsResponse         `json:"stats"`
	Courses      []CourseResponse      `json:"courses"`
	FriendRaces  []FriendRaceResponse  `json:"friend_races"`
	Achievements []AchievementResponse `json:"achievements"`
}

type StatsResponse struct {
	StreakDays     int `json:"streak_days"`
	FollowersCount int `json:"followers_count"`
	FollowingCount int `json:"following_count"`
}

type CourseResponse struct {
	ID       int              `json:"id"`
	Language LanguageResponse `json:"language"`
	Level    int              `json:"level"`
}

type LanguageResponse struct {
	Code string `json:"code"`
	Name string `json:"name"`
	Icon string `json:"icon"`
}

type FriendRaceResponse struct {
	ID         int                `json:"id"`
	Friend     RaceFriendResponse `json:"friend"`
	StreakDays int                `json:"streak_days"`
}

type RaceFriendResponse struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
}

type AchievementResponse struct {
	ID       int    `json:"id"`
	IconURL  string `json:"icon_url"`
	IsLocked bool   `json:"is_locked"`
}

func (h *UsersHTTPHandler) GetMe(rw http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := core_logger.FromContext(ctx)
	responseHandler := core_http_response.NewHTTPResponseHandler(log, rw)

	userID := core_http_middleware.UserIDFromContext(ctx)

	profile, err := h.userService.GetMe(ctx, userID)
	if err != nil {
		responseHandler.ErrorResponse(err, "failed to get profile")
		return
	}

	response := newGetMeResponse(profile)
	responseHandler.JSONResponse(response, http.StatusOK)
}

func newGetMeResponse(profile domain.Profile) GetMeResponse {
	courses := make([]CourseResponse, 0, len(profile.Courses))
	for _, course := range profile.Courses {
		courses = append(courses, CourseResponse{
			ID: course.ID,
			Language: LanguageResponse{
				Code: course.Language.Code,
				Name: course.Language.Name,
				Icon: course.Language.Icon,
			},
			Level: course.Level,
		})
	}

	friendRaces := make([]FriendRaceResponse, 0, len(profile.FriendRaces))
	for _, race := range profile.FriendRaces {
		friendRaces = append(friendRaces, FriendRaceResponse{
			ID: race.ID,
			Friend: RaceFriendResponse{
				ID:       race.Friend.ID,
				Username: race.Friend.Username,
			},
			StreakDays: race.StreakDays,
		})
	}

	achievements := make([]AchievementResponse, 0, len(profile.Achievements))
	for _, achievement := range profile.Achievements {
		achievements = append(achievements, AchievementResponse{
			ID:       achievement.ID,
			IconURL:  achievement.IconURL,
			IsLocked: achievement.IsLocked,
		})
	}

	return GetMeResponse{
		ID:        profile.User.ID,
		FirstName: profile.User.FirstName,
		LastName:  profile.User.LastName,
		Username:  profile.User.Username,
		Points:    profile.User.Points,
		Stats: StatsResponse{
			StreakDays:     profile.User.StreakDays,
			FollowersCount: profile.Stats.FollowersCount,
			FollowingCount: profile.Stats.FollowingCount,
		},
		Courses:      courses,
		FriendRaces:  friendRaces,
		Achievements: achievements,
	}
}
