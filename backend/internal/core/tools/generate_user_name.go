package tools

import "math/rand/v2"

var kindAnimals = []string{
	"panda", "otter", "koala", "bunny", "kitten", "puppy", "dolphin", "penguin",
	"hedgehog", "alpaca", "capybara", "fawn", "lamb", "duckling", "chick", "seal",
	"hamster", "squirrel", "sloth", "lemur", "fox", "owl", "turtle", "hippo",
	"llama", "quokka", "corgi", "ladybug", "butterfly", "beaver",
}

// GenerateUserName возвращает случайное имя доброго животного. Ник пользователя собирается
// как <имя>_<users.id>: id делает его уникальным, а само имя может повторяться.
func GenerateUserName() string {
	return kindAnimals[rand.IntN(len(kindAnimals))]
}
