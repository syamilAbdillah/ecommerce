package db

import (
	"context"
	"os"
	"sync"

	_ "github.com/mattn/go-sqlite3"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var db *mongo.Database
var conn *mongo.Client
var once sync.Once

type Disconnect func() error

// initialize connection once (singleton pattern), returning disconnect function and error
func Connect() (Disconnect, error) {
	var err error
	ctx := context.Background()

	once.Do(func() {
		conn, err = mongo.Connect(
			ctx,
			options.Client().ApplyURI(os.Getenv("DATABASE_URI")),
		)

		db = conn.Database(os.Getenv("DATABASE_NAME"))
	})

	return func() error {
		return conn.Disconnect(ctx)
	}, err
}

func Ping() error {
	return conn.Ping(context.Background(), readpref.Primary())
}
