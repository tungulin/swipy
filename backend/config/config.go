package config

import (
	"fmt"

	"github.com/kelseyhightower/envconfig"
	core_logger "github.com/tungulin/swipy/internal/core/logger"
	core_postgres_pool "github.com/tungulin/swipy/internal/core/repository/pool"
	core_http_server "github.com/tungulin/swipy/internal/core/transport/http/server"
)

type Config struct {
	HTTP           core_http_server.Config   `envconfig:"HTTP"`
	Postgres       core_postgres_pool.Config `envconfig:"POSTGRES"`
	Logger         core_logger.Config        `envconfig:"LOGGER"`
	VKClientSecret string                    `envconfig:"VK_CLIENT_SECRET" required:"true"`
}

// NewConfig читает конфиг из переменных окружения (локально — из .env через Makefile).
func NewConfig() (*Config, error) {
	var c Config

	if err := envconfig.Process("", &c); err != nil {
		return nil, fmt.Errorf("process envconfig: %w", err)
	}

	return &c, nil
}
