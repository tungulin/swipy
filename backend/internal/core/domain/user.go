package domain

import (
	"fmt"

	core_errors "github.com/tungulin/swipy/internal/core/errors"
)

// User — строка таблицы swipy.users. Profile (экран профиля) содержит User
// и добавляет данные из остальных таблиц.
type User struct {
	ID         int
	Provider   string
	ExternalID int64
	FirstName  *string
	LastName   *string
	Language   string
	Username   *string
	Points     int
	StreakDays int
	Timezone   string
}

func NewUser(
	id int,
	provider string,
	externalID int64,
	firstName *string,
	lastName *string,
	language string,
) User {
	return User{
		ID:         id,
		Provider:   provider,
		ExternalID: externalID,
		FirstName:  firstName,
		LastName:   lastName,
		Language:   language,
	}
}

func NewUserUnitialized(
	provider string,
	externalID int64,
	firstName *string,
	lastName *string,
	language string,
) User {
	return NewUser(
		UninitializedID,
		provider,
		externalID,
		firstName,
		lastName,
		language,
	)
}

func (u *User) Validate() error {
	if u.Provider != "telegram" && u.Provider != "vk" && u.Provider != "internal" {
		return fmt.Errorf("invalid `Provider`: %q: %w",
			u.Provider,
			core_errors.ErrInvalidArgument,
		)
	}

	if u.ExternalID <= 0 {
		return fmt.Errorf("invalid `ExternalID`: %d: %w",
			u.ExternalID,
			core_errors.ErrInvalidArgument,
		)
	}

	if u.FirstName != nil {
		firstNameLength := len([]rune(*u.FirstName))
		if firstNameLength < 2 || firstNameLength > 100 {
			return fmt.Errorf("invalid `FirstName`: %d: %w",
				firstNameLength,
				core_errors.ErrInvalidArgument,
			)
		}
	}

	if u.LastName != nil {
		lastNameLength := len([]rune(*u.LastName))
		if lastNameLength > 100 {
			return fmt.Errorf("invalid `LastName` len: %d: %w",
				lastNameLength,
				core_errors.ErrInvalidArgument,
			)
		}
	}

	languageLength := len([]rune(u.Language))
	if languageLength > 10 {
		return fmt.Errorf("invalid `Language` len: %d: %w",
			languageLength,
			core_errors.ErrInvalidArgument,
		)
	}

	return nil
}
