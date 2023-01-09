package controller

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

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

func paginate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		take := int64(20)
		skip := int64(0)

		if t, err := strconv.Atoi(r.URL.Query().Get("take")); err == nil {
			take = int64(t)
		}

		if p, err := strconv.Atoi(r.URL.Query().Get("page")); err == nil && p > 0 {
			skip = int64(p-1) * take
		}
		fmt.Printf("skip = %d, take = %d \n", skip, take)

		ctx := context.WithValue(r.Context(), "take", take)
		ctx = context.WithValue(ctx, "skip", skip)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func contentTypeJson(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		next.ServeHTTP(w, r)
	})
}
