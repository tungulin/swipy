package users

import (
	core_postgres_pool "github.com/tungulin/swipy/internal/core/repository/pool"
	users_postgres_repository "github.com/tungulin/swipy/internal/features/users/repository/postgres"
	users_service "github.com/tungulin/swipy/internal/features/users/service"
	users_transport_http "github.com/tungulin/swipy/internal/features/users/transport/http"
)

func NewHTTPHandler(pool core_postgres_pool.Pool, vkConfig users_transport_http.VKConfig) *users_transport_http.UsersHTTPHandler {
	repository := users_postgres_repository.NewUsersRepository(pool)
	service := users_service.NewUsersService(repository)
	return users_transport_http.NewUsersHTTPHandler(service, vkConfig)
}
