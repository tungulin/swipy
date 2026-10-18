package core_logger

type Config struct {
	Level  string `split_words:"true" required:"true"`
	Folder string `split_words:"true" default:"out/logs"`
}
