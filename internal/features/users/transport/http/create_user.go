package users_transport_http

import (
	"net/http"

	"github.com/tungulin/swipy/internal/core/domain"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_http_request "github.com/tungulin/swipy/internal/core/transport/http/request"
	core_http_response "github.com/tungulin/swipy/internal/core/transport/http/response"
)

type CreateUserRequest struct {
	FirstName string `json:"first_name" validate:"required,min=3,max=100"`
	LastName  string `json:"last_name" validate:"omitempty,min=2,max=100"`
	AvatarURL string `json:"avatar_url" validate:"omitempty,min=10,max=15"`
	Language  string `json:"language"`
}

type CreateUserResponse struct {
	ID        int
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	AvatarURL string `json:"avatar_url"`
	Language  string `json:"language"`
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

	userDomain := domainFromDTO(request)

	userDomain, err := h.userService.CreateUser(ctx, userDomain)
	if err != nil {
		responseHandler.ErrorResponse(err, "fialder to create user")
		return
	}

	response := dtoFromDomain(userDomain)
	responseHandler.JSONResponse(response, http.StatusCreated)
}

func domainFromDTO(dto CreateUserRequest) domain.User {
	return domain.NewUserUnitialized(dto.FirstName, &dto.LastName, &dto.AvatarURL, dto.Language)
}

func dtoFromDomain(user domain.User) CreateUserResponse {
	return CreateUserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  *user.LastName,
		AvatarURL: *user.AvatarURL,
		Language:  user.Language,
	}
}
