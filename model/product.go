package model

type Product struct {
	Id        int64  `json:"id" bson:"_id"`
	Name      string `json:"name" bson:"name"`
	Price     int    `json:"price" bson:"price"`
	CreatedAt int64  `json:"created_at" bson:"created_at"`
	Image     string `json:"image" bson:"image"`
}
