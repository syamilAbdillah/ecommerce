package controller

import (
	"net/http"
	"os"
	"reflect"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-playground/validator/v10"
	"github.com/gorilla/sessions"
	"github.com/syamilAbdillah/ecommerce/db"
)

func ping(w http.ResponseWriter, r *http.Request) {
	sess, err := store.Get(r, SESSION_NAME)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess.Values[SESSION_ID_KEY] = "ping-pong"
	store.Save(r, w, sess)
	w.Write([]byte(`{"ping": "pong"}`))
}

// single instance of go-validator
var validate *validator.Validate

func validatorRegisterTagName(fld reflect.StructField) string {
	name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
	if name == "-" {
		return ""
	}
	return name
}

func validateInit() {
	validate = validator.New()
	validate.RegisterTagNameFunc(validatorRegisterTagName)
}

// singel instance of github.com/gorilla/sessions
var store *sessions.CookieStore

const (
	SESSION_NAME         string = "session_id"
	SESSION_ID_KEY       string = "_id"
	CURRENT_USER_CTX_KEY string = "current_user"
)

func sessionStoreInit() {
	store = sessions.NewCookieStore([]byte(os.Getenv("SESSIONS_AUTH_KEY")), []byte(os.Getenv("SESSIONS_ENCRYPT_KEY")))
	store.Options.HttpOnly = true
	store.Options.SameSite = http.SameSiteLaxMode
	store.Options.Path = "/"
	store.Options.MaxAge = 0
	store.Options.Secure = false
}

func Init() http.Handler {
	validateInit()
	sessionStoreInit()

	r := chi.NewRouter()

	// middleware setup
	r.Use(middleware.RequestID)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors())
	r.Use(contentTypeJson)
	r.Use(getUserFromSession(db.UserGetById, store.Get))
	r.Get("/ping", ping)

	// initialize handler
	r.Route("/auth", AuthRoute)
	r.With(superuserOnly).Route("/users", UserRoute)
	r.Route("/products", ProductRoute)

	return r
}
