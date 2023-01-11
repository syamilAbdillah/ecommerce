package controller

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/syamilAbdillah/ecommerce/db"
	"github.com/syamilAbdillah/ecommerce/model"
	"golang.org/x/crypto/bcrypt"
)

func AuthLogin(getUser dbUserGetByEmail) http.HandlerFunc {
	type credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	return func(w http.ResponseWriter, r *http.Request) {
		c := credentials{}

		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		u, err := getUser(r.Context(), c.Email)
		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		if u == nil {
			respondWithUnauthorized(w)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(c.Password)); err != nil {
			respondWithUnauthorized(w)
			return
		}

		sess, err := store.Get(r, SESSION_NAME)
		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		sess.Values[SESSION_ID_KEY] = u.Id.Hex()
		if err := store.Save(r, w, sess); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		u.Password = ""
		respondWith(w, J{"user": u})
	}
}

func AuthMe() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u, ok := r.Context().Value(CURRENT_USER_CTX_KEY).(*model.User)
		if !ok || u == nil {
			respondWithInternalErr(w, errors.New("INTERNAL_SERVER_ERROR"))
			return
		}

		if u.Role == model.RoleGuest {
			respondWithUnauthorized(w)
			return
		}

		respondWith(w, J{
			"user": u,
		})
	}
}

func AuthLogout() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sess, err := store.Get(r, SESSION_NAME)
		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		sess.Options.MaxAge = -1
		if err = sess.Save(r, w); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		respondWith(w, J{"message": "ok"})
	}
}

func AuthRoute(r chi.Router) {
	r.Get("/me", AuthMe())
	r.Post("/login", AuthLogin(db.UserGetByEmail))
	r.Delete("/logout", AuthLogout())
}
