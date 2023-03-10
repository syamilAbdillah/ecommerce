package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/syamilAbdillah/ecommerce/controller"
	"github.com/syamilAbdillah/ecommerce/db"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%s \n", err)
		os.Exit(1)
	}
}

func run() error {
	godotenv.Load()

	disconnect, err := db.Connect()
	if err != nil {
		return err
	}

	defer disconnect()

	if err := db.Ping(); err != nil {
		return err
	}

	fmt.Println("running on port " + getPort())
	return http.ListenAndServe(getPort(), controller.Init())
}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = ":3000"
	} else {
		port = ":" + port
	}

	return port
}
