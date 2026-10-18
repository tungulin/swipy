package core_http_middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	core_errors "github.com/tungulin/swipy/internal/core/errors"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_http_response "github.com/tungulin/swipy/internal/core/transport/http/response"
	core_vk "github.com/tungulin/swipy/internal/core/vk"
	"go.uber.org/zap"
)

const (
	authorizationHeader = "Authorization"
	authSchemeVK        = "vk"
)

type userIDContextKey struct{}

type UserIDResolver interface {
	GetUserID(ctx context.Context, provider string, externalID int64) (int, error)
}

func Auth(vkClientSecret string, resolver UserIDResolver) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			log := core_logger.FromContext(ctx)
			responseHandler := core_http_response.NewHTTPResponseHandler(log, w)

			provider, externalID, err := authenticate(r, vkClientSecret)
			if err != nil {
				responseHandler.ErrorResponse(err, "failed to authenticate")
				return
			}

			userID, err := resolver.GetUserID(ctx, provider, externalID)
			if err != nil {
				responseHandler.ErrorResponse(err, "failed to get user")
				return
			}

			ctx = context.WithValue(ctx, userIDContextKey{}, userID)
			ctx = context.WithValue(ctx, "log", log.With(zap.Int("user_id", userID)))

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// UserIDFromContext возвращает ID пользователя, которого определил Auth.
func UserIDFromContext(ctx context.Context) int {
	userID, ok := ctx.Value(userIDContextKey{}).(int)

	if !ok {
		panic("no user id in context: route without Auth middleware")
	}

	return userID
}

func authenticate(r *http.Request, vkClientSecret string) (string, int64, error) {
	scheme, credentials, ok := strings.Cut(r.Header.Get(authorizationHeader), " ")
	if !ok || credentials == "" {
		return "", 0, fmt.Errorf("missing Authorization header: %w", core_errors.ErrUnauthorized)
	}

	switch scheme {
	case authSchemeVK:
		if err := core_vk.VerifyLaunchParams(credentials, vkClientSecret); err != nil {
			return "", 0, err
		}

		vkUserID, err := core_vk.ParseUserID(credentials)
		if err != nil {
			return "", 0, fmt.Errorf("%v: %w", err, core_errors.ErrUnauthorized)
		}

		return "vk", vkUserID, nil

	default:
		return "", 0, fmt.Errorf("unsupported auth scheme %q: %w", scheme, core_errors.ErrUnauthorized)
	}
}
