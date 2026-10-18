package domain

type Profile struct {
	User         User
	Stats        ProfileStats
	Courses      []Course
	FriendRaces  []FriendRace
	Achievements []ProfileAchievement
}

type ProfileStats struct {
	FollowersCount int
	FollowingCount int
}

type Course struct {
	ID       int
	Language Language
	Level    int
}

type Language struct {
	Code string
	Name string
	Icon string
}

type FriendRace struct {
	ID         int
	Friend     RaceFriend
	StreakDays int
}

type RaceFriend struct {
	ID       int
	Username string
}

type ProfileAchievement struct {
	ID       int
	IconURL  string
	IsLocked bool
}
