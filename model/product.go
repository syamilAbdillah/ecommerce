package model

type Product struct {
	Id        int64  `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	Price     int    `json:"price" db:"price"`
	CreatedAt int64  `json:"created_at" db:"created_at"`
	Image     string `json:"image" db:"image"`
}
