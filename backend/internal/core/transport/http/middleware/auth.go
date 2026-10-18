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

type identityContextKey struct{}

type userIDContextKey struct{}

// Identity — кто прислал запрос по данным платформы. Пользователя в БД может ещё не быть.
type Identity struct {
	Provider   string
	ExternalID int64
	Language   string
}

// AuthIdentityMiddleware проверяет заголовок Authorization (см. docs/api/auth.md) и кладёт
// Identity в контекст. В БД не ходит, поэтому подходит для инициализации нового пользователя.
// В обработчике: IdentityFromContext.
func (mw *MiddlewareManager) AuthIdentityMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		responseHandler := core_http_response.NewHTTPResponseHandler(core_logger.FromContext(ctx), w)

		identity, err := identityFromRequest(r, mw.cfg.VKClientSecret)
		if err != nil {
			responseHandler.ErrorResponse(err, "failed to authenticate")
			return
		}

		ctx = context.WithValue(ctx, identityContextKey{}, identity)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// AuthUserMiddleware делает то же, что AuthIdentityMiddleware, и дополнительно находит
// users.id. Если пользователь не инициализирован, отвечает 404.
// В обработчике: UserIDFromContext (и IdentityFromContext).
func (mw *MiddlewareManager) AuthUserMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		log := core_logger.FromContext(ctx)
		responseHandler := core_http_response.NewHTTPResponseHandler(log, w)

		identity, err := identityFromRequest(r, mw.cfg.VKClientSecret)
		if err != nil {
			responseHandler.ErrorResponse(err, "failed to authenticate")
			return
		}

		userID, err := mw.userResolver.GetUserID(ctx, identity.Provider, identity.ExternalID)
		if err != nil {
			responseHandler.ErrorResponse(err, "failed to get user")
			return
		}

		ctx = context.WithValue(ctx, identityContextKey{}, identity)
		ctx = context.WithValue(ctx, userIDContextKey{}, userID)
		ctx = context.WithValue(ctx, "log", log.With(zap.Int("user_id", userID)))

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// IdentityFromContext возвращает Identity для маршрутов с AuthIdentityMiddleware или AuthUserMiddleware.
func IdentityFromContext(ctx context.Context) Identity {
	identity, ok := ctx.Value(identityContextKey{}).(Identity)

	if !ok {
		panic("no identity in context: route without AuthIdentityMiddleware or AuthUserMiddleware")
	}

	return identity
}

// UserIDFromContext возвращает ID пользователя для маршрутов с AuthUserMiddleware.
func UserIDFromContext(ctx context.Context) int {
	userID, ok := ctx.Value(userIDContextKey{}).(int)

	if !ok {
		panic("no user id in context: route without AuthUserMiddleware")
	}

	return userID
}

func identityFromRequest(r *http.Request, vkClientSecret string) (Identity, error) {
	scheme, credentials, ok := strings.Cut(r.Header.Get(authorizationHeader), " ")
	if !ok || credentials == "" {
		return Identity{}, fmt.Errorf("missing Authorization header: %w", core_errors.ErrUnauthorized)
	}

	switch scheme {
	case authSchemeVK:
		if err := core_vk.VerifyLaunchParams(credentials, vkClientSecret); err != nil {
			return Identity{}, err
		}

		launchParams, err := core_vk.ParseLaunchParams(credentials)
		if err != nil {
			return Identity{}, fmt.Errorf("%v: %w", err, core_errors.ErrUnauthorized)
		}

		return Identity{
			Provider:   "vk",
			ExternalID: launchParams.UserID,
			Language:   launchParams.Language,
		}, nil

	default:
		return Identity{}, fmt.Errorf("unsupported auth scheme %q: %w", scheme, core_errors.ErrUnauthorized)
	}
}
