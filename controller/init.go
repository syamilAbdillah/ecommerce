package controller

import (
	"net/http"
	"reflect"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-playground/validator/v10"
)

// single instance of go-validator
var validate *validator.Validate

func Init() http.Handler {
	validate = validator.New()
	validate.RegisterTagNameFunc(validatorRegisterTagName)

	r := chi.NewRouter()

	// middleware setup
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors())
	r.Use(contentTypeJson)
	r.Get("/ping", ping)

	// initialize handler
	r.Route("/users", UserRoute)
	r.Route("/products", ProductRoute)

	return r
}

func ping(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"ping": "pong"}`))
}

func validatorRegisterTagName(fld reflect.StructField) string {
	name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
	if name == "-" {
		return ""
	}
	return name
}
