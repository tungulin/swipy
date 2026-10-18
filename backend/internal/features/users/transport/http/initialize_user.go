package users_transport_http

import (
	"net/http"

	"github.com/tungulin/swipy/internal/core/domain"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_http_middleware "github.com/tungulin/swipy/internal/core/transport/http/middleware"
	core_http_response "github.com/tungulin/swipy/internal/core/transport/http/response"
)

type InitializeUserResponse struct {
	ID         int     `json:"id"`
	Provider   string  `json:"provider"`
	ExternalID int64   `json:"external_id"`
	FirstName  *string `json:"first_name"`
	LastName   *string `json:"last_name"`
	Language   string  `json:"language"`
	Username   string  `json:"username"`
}

// InitializeUser создаёт пользователя по данным из заголовка Authorization или
// возвращает уже созданного. Платформу (vk, telegram) определяет схема заголовка,
// подпись уже проверил AuthIdentityMiddleware.
func (h *UsersHTTPHandler) InitializeUser(rw http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := core_logger.FromContext(ctx)
	responseHandler := core_http_response.NewHTTPResponseHandler(log, rw)

	identity := core_http_middleware.IdentityFromContext(ctx)

	userDomain := domain.NewUserUnitialized(identity.Provider, identity.ExternalID, nil, nil, identity.Language)

	userDomain, err := h.userService.InitializeUser(ctx, userDomain)
	if err != nil {
		responseHandler.ErrorResponse(err, "failed to initialize user")
		return
	}

	response := newInitializeUserResponse(userDomain)
	responseHandler.JSONResponse(response, http.StatusCreated)
}

func newInitializeUserResponse(user domain.User) InitializeUserResponse {
	return InitializeUserResponse{
		ID:         user.ID,
		Provider:   user.Provider,
		ExternalID: user.ExternalID,
		FirstName:  user.FirstName,
		LastName:   user.LastName,
		Language:   user.Language,
		Username:   user.Username,
	}
}
