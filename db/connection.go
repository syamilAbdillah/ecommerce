package db

import (
	"sync"

	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var conn *sqlx.DB
var once sync.Once

func Connect() (*sqlx.DB, error) {
	var err error
	once.Do(func() {
		conn, err = sqlx.Open("sqlite3", "file:dev.db?cache=shared&_journal=WAL")
	})

	return conn, err
}