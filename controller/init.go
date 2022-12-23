package controller

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/render"
)

func Init() http.Handler {
	validateInit()
	r := chi.NewRouter()

	// middleware setup
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors())
	r.Use(render.SetContentType(render.ContentTypeJSON))
	r.Get("/ping", ping)

	// initialize handler
	r.Route("/users", UserRoute)

	return r
}

func ping(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"ping": "pong"}`))
}
