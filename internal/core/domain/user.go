package domain

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
