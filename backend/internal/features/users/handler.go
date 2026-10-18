package users

import (
	core_postgres_pool "github.com/tungulin/swipy/internal/core/repository/pool"
	core_http_middleware "github.com/tungulin/swipy/internal/core/transport/http/middleware"
	users_postgres_repository "github.com/tungulin/swipy/internal/features/users/repository/postgres"
	users_service "github.com/tungulin/swipy/internal/features/users/service"
	users_transport_http "github.com/tungulin/swipy/internal/features/users/transport/http"
)

func NewHTTPHandler(
	pool core_postgres_pool.Pool,
	vkConfig users_transport_http.VKConfig,
	authMiddleware core_http_middleware.Middleware,
) *users_transport_http.UsersHTTPHandler {
	repository := users_postgres_repository.NewUsersRepository(pool)
	service := users_service.NewUsersService(repository)
	return users_transport_http.NewUsersHTTPHandler(service, vkConfig, authMiddleware)
}

// NewAuthMiddleware создаёт middleware авторизации для маршрутов всех фич.
func NewAuthMiddleware(
	pool core_postgres_pool.Pool,
	vkConfig users_transport_http.VKConfig,
) core_http_middleware.Middleware {
	repository := users_postgres_repository.NewUsersRepository(pool)
	return core_http_middleware.Auth(vkConfig.ClientSecret, repository)
}
