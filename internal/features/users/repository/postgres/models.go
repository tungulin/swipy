package users_postgres_repository

type UserModel struct {
	ID        int
	FirstName string
	LastName  *string
	AvatarURL *string
	Language  string
}
