package core_http_server

import "time"

// Имя переменной строится из имени поля (split_words): ShutdownTimeout -> HTTP_SHUTDOWN_TIMEOUT.
type Config struct {
	Addr            string        `split_words:"true" required:"true"`
	ShutdownTimeout time.Duration `split_words:"true" required:"true"`
}
