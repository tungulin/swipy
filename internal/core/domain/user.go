package domain

import (
	"fmt"

	core_errors "github.com/tungulin/swipy/internal/core/errors"
)

type User struct {
	ID        int
	UserId    int
	FirstName string
	LastName  *string
	AvatarURL *string
	Language  string
}

func NewUser(
	id int,
	firstName string,
	lastName *string,
	avatarURL *string,
	language string,
) User {
	return User{
		ID:        id,
		FirstName: firstName,
		LastName:  lastName,
		AvatarURL: avatarURL,
		Language:  language,
	}
}

func NewUserUnitialized(
	firstName string,
	lastName *string,
	avatarURL *string,
	language string,
) User {
	return NewUser(
		UninitializedID,
		firstName,
		lastName,
		avatarURL,
		language,
	)
}

func (u *User) Validate() error {
	firstNameLength := len([]rune(u.FirstName))
	if firstNameLength < 2 || firstNameLength > 100 {
		return fmt.Errorf("invalid `FirstName`: %d: %w",
			firstNameLength,
			core_errors.ErrInvalidArgument,
		)
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

	if u.AvatarURL != nil {
		avatarURLLength := len([]rune(*u.AvatarURL))
		if avatarURLLength > 500 {
			return fmt.Errorf("invalid `AvatarURL` len: %d: %w",
				avatarURLLength,
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
