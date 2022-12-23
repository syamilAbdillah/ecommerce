package controller

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/syamilAbdillah/ecommerce/db"
	"github.com/syamilAbdillah/ecommerce/model"
	"golang.org/x/crypto/bcrypt"
)

const defaulProfilePicture string = "https://avatars.dicebear.com/api/adventurer/default-profile.svg"

/*
*
*
*
*
*
*
*
======================================================================================

	POST /users

======================================================================================
*/
func UserCreate(
	userGetByEmail func(context.Context, string) (*model.User, error),
	userCreate func(context.Context, *model.User) error,
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u := userPayload{}

		err := render.Bind(r, &u)
		if err != nil {
			render.Render(w, r, ValidationErr(err))
			return
		}

		exist, err := userGetByEmail(r.Context(), u.Email)

		if err != nil {
			render.Render(w, r, InternalErr(err))
			return
		}

		if exist != nil {
			render.Render(w, r, ValidationErr(ValidationErrors{
				"email": "already used by other user",
			}))
			return
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			render.Render(w, r, InternalErr(err))
			return
		}

		u.Password = string(hashed)
		u.ProfilePicture = defaulProfilePicture
		u.CreatedAt = time.Now().UnixMilli()
		u.Role = model.RoleSuperuser

		err = userCreate(r.Context(), &u.User)
		if err != nil {
			render.Render(w, r, InternalErr(err))
			return
		}

		render.Status(r, http.StatusCreated)
		render.Render(w, r, &userResponse{User: &u.User})
	}
}

/*
*
*
*
*
*
*
*
======================================================================================

	GET /users

======================================================================================
*/
func UserFind(
	userCount func(context.Context, model.Role) (int64, error),
	userFind func(context.Context, model.Role, uint64, uint64) ([]*model.User, error),
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		offset := uint64(0)
		take := uint64(20)
		role := model.RoleFromString(r.URL.Query().Get("role"))

		fmt.Printf("role: %v\n", role)

		if t, err := strconv.Atoi(r.URL.Query().Get("take")); err == nil {
			take = uint64(t)
		}

		if p, err := strconv.Atoi(r.URL.Query().Get("page")); err == nil {
			if p > 0 {
				offset = (uint64(p) * take) - take
			}
		}

		errChan := make(chan error)
		total := make(chan int64)

		go func() {
			t, err := userCount(r.Context(), role)
			errChan <- err
			total <- t
		}()

		uu, err := userFind(r.Context(), role, take, offset)
		if err != nil {
			render.Render(w, r, InternalErr(err))
			return
		}

		if <-errChan != nil {
			render.Render(w, r, InternalErr(<-errChan))
			return
		}

		render.Render(w, r, &userResponse{
			Users: uu,
			Total: <-total,
		})
	}
}

/*
*
*
*
*
*
*
*
======================================================================================

	GET /users/:id

======================================================================================
*/
func UserGet(
	userGetById func(context.Context, int64) (*model.User, error),
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		u := new(model.User)
		id, err := strconv.Atoi(chi.URLParam(r, "id"))

		if err != nil {
			render.Render(w, r, WrapErr(errors.New("user not found"), http.StatusNotFound))
			return
		}

		u.Id = int64(id)

		render.Render(w, r, &userResponse{
			User: u,
		})
	}
}

/*
*
*
*
*
*
*
*
======================================================================================

	User sub route

======================================================================================
*/
func UserRoute(r chi.Router) {
	r.Post("/", UserCreate(db.UserGetByEmail, db.UserCreate))
	r.Get("/", UserFind(db.UserCount, db.UserFind))
	r.Get("/{id}", UserGet(db.UserGetById))
}
