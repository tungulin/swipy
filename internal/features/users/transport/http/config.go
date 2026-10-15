package users_transport_http

import (
	"fmt"

	"github.com/kelseyhightower/envconfig"
)

type VKConfig struct {
	ClientSecret string `envconfig:"CLIENT_SECRET" required:"true"`
}

func NewVKConfig() (VKConfig, error) {
	var config VKConfig

	if err := envconfig.Process("VK", &config); err != nil {
		return VKConfig{}, fmt.Errorf("process envconfig: %w", err)
	}

	return config, nil
}

func NewVKConfigMust() VKConfig {
	config, err := NewVKConfig()

	if err != nil {
		err = fmt.Errorf("get VK config: %w", err)
		panic(err)
	}

	return config
}
