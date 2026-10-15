package users_transport_http

import (
	"net/http"

	"github.com/tungulin/swipy/internal/core/domain"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_http_request "github.com/tungulin/swipy/internal/core/transport/http/request"
	core_http_response "github.com/tungulin/swipy/internal/core/transport/http/response"
)

type CreateUserRequest struct {
	Provider   string `json:"provider" validate:"required,oneof=telegram vk"`
	ExternalID int64  `json:"external_id" validate:"required,gt=0"`
	FirstName  string `json:"first_name" validate:"required,min=2,max=100"`
	LastName   string `json:"last_name" validate:"omitempty,min=2,max=100"`
	AvatarURL  string `json:"avatar_url" validate:"omitempty,min=10,max=15"`
	Language   string `json:"language"`
}

type CreateUserResponse struct {
	ID         int
	Provider   string `json:"provider"`
	ExternalID int64  `json:"external_id"`
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	AvatarURL  string `json:"avatar_url"`
	Language   string `json:"language"`
}

func (h *UsersHTTPHandler) CreateUser(rw http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := core_logger.FromContext(ctx)
	responseHandler := core_http_response.NewHTTPResponseHandler(log, rw)

	var request CreateUserRequest

	if err := core_http_request.DecodeAndValidateRequest(r, &request); err != nil {
		responseHandler.ErrorResponse(err, "failed to decode and validate HTTP request")
		return
	}

	userDomain := request.toDomain()

	userDomain, err := h.userService.CreateUser(ctx, userDomain)
	if err != nil {
		responseHandler.ErrorResponse(err, "fialed to create user")
		return
	}

	response := newCreateUserResponse(userDomain)
	responseHandler.JSONResponse(response, http.StatusCreated)
}

func (r CreateUserRequest) toDomain() domain.User {
	return domain.NewUserUnitialized(r.Provider, r.ExternalID, r.FirstName, &r.LastName, &r.AvatarURL, r.Language)
}

func newCreateUserResponse(user domain.User) CreateUserResponse {
	return CreateUserResponse{
		ID:         user.ID,
		Provider:   user.Provider,
		ExternalID: user.ExternalID,
		FirstName:  user.FirstName,
		LastName:   *user.LastName,
		AvatarURL:  *user.AvatarURL,
		Language:   user.Language,
	}
}
