package model

import "go.mongodb.org/mongo-driver/bson/primitive"

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
	Id             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name           string             `json:"name" bson:"name" validate:"min=3,max=64"`
	Email          string             `json:"email" bson:"email" validate:"required,email"`
	Password       string             `json:"password,omitempty" bson:"password" validate:"min=8,max=16"`
	ProfilePicture string             `json:"profile_picture" bson:"profile_picture"`
	CreatedAt      int64              `json:"created_at" bson:"created_at"`
	Role           Role               `json:"role" bson:"role"`
}
