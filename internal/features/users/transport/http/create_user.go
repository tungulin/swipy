package users_transport_http

import (
	"encoding/json"
	"net/http"
)

type CreateUserRequest struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type CreateUserResponse struct {
	ID        string
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

func (h *UsersHTTPHandler) CreateUser(rw http.ResponseWriter, r *http.Request) {
	var request CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {

	}
}
