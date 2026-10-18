package core_postgres_pool

import "time"

type Config struct {
	Host     string        `split_words:"true" default:"localhost"`
	Port     string        `split_words:"true" default:"5432"`
	User     string        `split_words:"true" required:"true"`
	Password string        `split_words:"true" required:"true"`
	DB       string        `split_words:"true" required:"true"`
	Timeout  time.Duration `split_words:"true" required:"true"`
}
