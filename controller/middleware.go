package controller

import (
	"net/http"

	chiCors "github.com/go-chi/cors"
)

func cors() func(http.Handler) http.Handler {
	return chiCors.Handler(chiCors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Credentials"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
	})
}
