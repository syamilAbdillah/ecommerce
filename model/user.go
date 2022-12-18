package model

type Role string

const (
	RoleGuest     Role = "guest"
	RoleUser      Role = "user"
	RoleSuperuser Role = "superuser"
)

func RoleFromString(r string) Role {
	if r == "user" {
		return RoleUser
	}

	if r == "superuser" {
		return RoleSuperuser
	}

	return RoleGuest
}

type User struct {
	Id             int64  `json:"id" db:"id"`
	Name           string `json:"name" db:"name" validate:"min=3,max=64"`
	Email          string `json:"email" db:"email" validate:"required,email"`
	Password       string `json:"password,omitempty" db:"password" validate:"min=8,max=16"`
	ProfilePicture string `json:"profile_picture" db:"profile_picture"`
	CreatedAt      int64  `json:"created_at" db:"created_at"`
	Role           Role   `json:"role" db:"role"`
}
