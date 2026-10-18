package users_postgres_repository

type UserModel struct {
	ID         int
	Provider   string
	ExternalID int64
	FirstName  string
	LastName   *string
	Language   string
}
