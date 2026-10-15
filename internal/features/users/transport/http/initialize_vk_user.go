package users_transport_http

import (
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"github.com/SevereCloud/vksdk/v3/vkapps"
	"github.com/tungulin/swipy/internal/core/domain"
	core_errors "github.com/tungulin/swipy/internal/core/errors"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_http_request "github.com/tungulin/swipy/internal/core/transport/http/request"
	core_http_response "github.com/tungulin/swipy/internal/core/transport/http/response"
)

type InitializeVKUserRequest struct {
	LaunchParams string `json:"launch_params" validate:"required"`
}

type InitializeVKUserResponse struct {
	ID         int
	Provider   string  `json:"provider"`
	ExternalID int64   `json:"external_id"`
	FirstName  string  `json:"first_name"`
	LastName   *string `json:"last_name"`
	AvatarURL  *string `json:"avatar_url"`
	Language   string  `json:"language"`
}

func (h *UsersHTTPHandler) InitializeVKUser(rw http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := core_logger.FromContext(ctx)
	responseHandler := core_http_response.NewHTTPResponseHandler(log, rw)

	var request InitializeVKUserRequest

	if err := core_http_request.DecodeAndValidateRequest(r, &request); err != nil {
		responseHandler.ErrorResponse(err, "failed to decode and validate HTTP request")
		return
	}

	isVerifiedParams, err := vkapps.ParamsVerify(request.LaunchParams, h.vkConfig.ClientSecret)

	if err != nil {
		responseHandler.ErrorResponse(err, "failed parse VK params")
		return
	}

	if !isVerifiedParams {
		responseHandler.ErrorResponse(core_errors.ErrInvalidArgument, "failed verify VK params")
		return
	}

	userDomain, err := request.toDomain()

	if err != nil {
		responseHandler.ErrorResponse(err, "failed to parse VK launch params")
		return
	}

	userDomain, err = h.userService.InitializeVKUser(ctx, userDomain)
	if err != nil {
		responseHandler.ErrorResponse(err, "failed to initilize vk user")
		return
	}

	response := newInitializeVKUserResponse(userDomain)
	responseHandler.JSONResponse(response, http.StatusCreated)
}

func (r InitializeVKUserRequest) toDomain() (domain.User, error) {
	params, err := url.ParseQuery(r.LaunchParams)
	if err != nil {
		return domain.User{}, fmt.Errorf("parse launch params: %v: %w", err, core_errors.ErrInvalidArgument)
	}

	vkUserID, err := strconv.ParseInt(params.Get("vk_user_id"), 10, 64)
	if err != nil {
		return domain.User{}, fmt.Errorf("parse vk_user_id: %v: %w", err, core_errors.ErrInvalidArgument)
	}

	return domain.NewUserUnitialized("vk", vkUserID, "TODO", nil, nil, params.Get("vk_language")), nil
}

func newInitializeVKUserResponse(user domain.User) InitializeVKUserResponse {
	return InitializeVKUserResponse{
		ID:         user.ID,
		Provider:   user.Provider,
		ExternalID: user.ExternalID,
		FirstName:  user.FirstName,
		LastName:   user.LastName,
		AvatarURL:  user.AvatarURL,
		Language:   user.Language,
	}
}
