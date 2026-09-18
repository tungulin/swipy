package domain

type User struct {
	ID        int
	UserId    int
	FirstName string
	LastName  *string
	AvatarURL string
	Language  string
}
