package controller

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/syamilAbdillah/ecommerce/db"
	"github.com/syamilAbdillah/ecommerce/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

const defaulProfilePicture string = "https://avatars.dicebear.com/api/adventurer/default-profile.svg"

const userCtxKey string = "user"

type (
	dbUserGetByEmail func(context.Context, string) (*model.User, error)
	dbUserGetById    func(context.Context, primitive.ObjectID) (*model.User, error)
	dbUserCount      func(context.Context, model.Role) (int64, error)
	dbUserFind       func(context.Context, model.Role, int64, int64) ([]*model.User, error)
	dbUserWrite      func(context.Context, *model.User) error
	dbUserDelete     func(context.Context, primitive.ObjectID) error
)

func UserCreate(userGetByEmail dbUserGetByEmail, userCreate dbUserWrite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u := model.User{}

		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		u.Name = strings.Trim(u.Name, " ")
		if err := validate.Struct(&u); err != nil {
			if ve, ok := err.(validator.ValidationErrors); ok {
				respondWith(w, J{
					"invalid_errors": toBadValueMap(ve),
				}, http.StatusBadRequest)
				return
			}

			respondWithInternalErr(w, err)
			return
		}

		exist, err := userGetByEmail(r.Context(), u.Email)

		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		if exist != nil {
			respondWith(w, J{
				"invalid_errors": BadValueMap{
					"email": {Rule: "unique"},
				},
			}, http.StatusBadRequest)
			return
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		u.Password = string(hashed)
		u.ProfilePicture = defaulProfilePicture
		u.CreatedAt = time.Now().UnixMilli()
		u.Role = model.RoleSuperuser

		err = userCreate(r.Context(), &u)
		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		respondWith(w, J{"user": &u}, http.StatusCreated)
	}
}

func UserFind(userCount dbUserCount, userFind dbUserFind) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		take := int64(20)
		role := model.RoleFromString(r.URL.Query().Get("role"))
		skip := int64(0)

		if t, ok := r.Context().Value("take").(int64); ok {
			take = t
		}

		if s, ok := r.Context().Value("skip").(int64); ok {
			skip = s
		}

		errc := make(chan error)
		totalc := make(chan int64)

		go func() {
			t, err := userCount(r.Context(), role)
			errc <- err
			totalc <- t
		}()

		uu, err := userFind(r.Context(), role, take, skip)
		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		err = <-errc
		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		total := <-totalc
		respondWith(w, J{"users": uu, "total": total})
	}
}

func UserGet() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u, ok := r.Context().Value(userCtxKey).(*model.User)
		if !ok {
			respondWithInternalErr(w, errors.New("INTERNAL_SERVER_ERROR"))
			return
		}

		u.Password = ""

		respondWith(w, J{
			"user": u,
		})
	}
}

func UserUpdate(update dbUserWrite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u, ok := r.Context().Value(userCtxKey).(*model.User)
		if !ok {
			respondWithInternalErr(w, errors.New("INTERNAL_SERVER_ERROR"))
			return
		}

		if err := json.NewDecoder(r.Body).Decode(u); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		u.Name = strings.Trim(u.Name, " ")
		if err := validate.Struct(u); err != nil {
			if ve, ok := err.(validator.ValidationErrors); ok {
				respondWith(w, J{
					"invalid_errors": toBadValueMap(ve),
				}, http.StatusBadRequest)
				return
			}
			respondWithInternalErr(w, err)
			return
		}

		if err := update(r.Context(), u); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		respondWith(w, J{
			"user": u,
		})
	}
}

func UserDelete(delete dbUserDelete) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u, ok := r.Context().Value(userCtxKey).(*model.User)
		if !ok {
			respondWithInternalErr(w, errors.New("INTERNAL_SERVER_ERROR"))
			return
		}

		if err := delete(r.Context(), u.Id); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		respondWith(w, J{
			"user": u,
		})
	}
}

func UserCtx(get dbUserGetById) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			id, err := primitive.ObjectIDFromHex(chi.URLParam(r, "id"))

			if err != nil {
				respondWithNotFound(w)
				return
			}

			u, err := get(r.Context(), id)

			if err != nil {
				respondWithInternalErr(w, err)
				return
			}

			if u == nil {
				respondWithNotFound(w)
				return
			}

			ctx := context.WithValue(r.Context(), userCtxKey, u)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func UserRoute(r chi.Router) {
	r.Post("/", UserCreate(db.UserGetByEmail, db.UserCreate))
	r.With(paginate).Get("/", UserFind(db.UserCount, db.UserFind))
	r.Route("/{id}", func(r chi.Router) {
		r.Use(UserCtx(db.UserGetById))
		r.Get("/", UserGet())
		r.Put("/", UserUpdate(db.UserUpdate))
		r.Delete("/", UserDelete(db.UserDelete))
	})
}
