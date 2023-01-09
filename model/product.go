package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Product struct {
	Id        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name      string             `json:"name" bson:"name" validate:"required,max=128"`
	Price     int                `json:"price" bson:"price" validate:"gt=0"`
	CreatedAt int64              `json:"created_at" bson:"created_at"`
	Image     string             `json:"image" bson:"image"`
}
