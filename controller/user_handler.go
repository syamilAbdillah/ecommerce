package controller

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/syamilAbdillah/ecommerce/db"
	"github.com/syamilAbdillah/ecommerce/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	userFind func(context.Context, model.Role, int64, int64) ([]*model.User, error),
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		take := int64(20)
		role := model.RoleFromString(r.URL.Query().Get("role"))
		skip := int64(0)

		if t, err := strconv.Atoi(r.URL.Query().Get("take")); err == nil {
			take = int64(t)
		}

		if p, err := strconv.Atoi(r.URL.Query().Get("page")); err == nil && p > 0 {
			page := int64(p)
			fmt.Printf("skip = (%d * %d) - %d \n", page, take, take)
			skip = (page * take) - take
		}

		fmt.Printf("skip: %d\n", skip)

		errChan := make(chan error)
		total := make(chan int64)

		go func() {
			t, err := userCount(r.Context(), role)
			errChan <- err
			total <- t
		}()

		uu, err := userFind(r.Context(), role, take, skip)
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
	userGetById func(context.Context, primitive.ObjectID) (*model.User, error),
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u *model.User

		id, err := primitive.ObjectIDFromHex(chi.URLParam(r, "id"))

		if err != nil {
			render.Render(w, r, NotFoundErr("user"))
			return
		}

		u, err = userGetById(r.Context(), id)

		if err != nil {
			render.Render(w, r, InternalErr(err))
			return
		}

		if u == nil {
			render.Render(w, r, NotFoundErr("user"))
			return
		}

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

	PUT /users/:id

======================================================================================
*/
func UserUpdate(
	userUpdate func(context.Context, *model.User) error,
	userGetById func(context.Context, primitive.ObjectID) (*model.User, error),
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(chi.URLParam(r, "id"))
		if err != nil {
			render.Render(w, r, NotFoundErr("user"))
			return
		}

		u, err := userGetById(r.Context(), id)
		if err != nil {
			render.Render(w, r, InternalErr(err))
			return
		}

		if u == nil {
			render.Render(w, r, NotFoundErr("user"))
			return
		}

		userData := userPayload{User: *u}
		err = render.Bind(r, &userData)
		if err != nil {
			render.Render(w, r, ValidationErr(err))
			return
		}

		err = userUpdate(r.Context(), &userData.User)
		if err != nil {
			render.Render(w, r, InternalErr(err))
			return
		}

		render.Render(w, r, &userResponse{
			User: &userData.User,
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

	DELETE /users/:id

======================================================================================
*/
func UserDelete(
	userDeleteById func(context.Context, primitive.ObjectID) error,
	userGetById func(context.Context, primitive.ObjectID) (*model.User, error),
) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := primitive.ObjectIDFromHex(chi.URLParam(r, "id"))
		if err != nil {
			render.Render(w, r, NotFoundErr("user"))
			return
		}

		u, err := userGetById(r.Context(), id)
		if err != nil {
			render.Render(w, r, NotFoundErr("user"))
			return
		}

		if u == nil {
			render.Render(w, r, NotFoundErr("user"))
			return
		}

		err = userDeleteById(r.Context(), id)
		if err != nil {
			render.Render(w, r, InternalErr(err))
			return
		}

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
	r.Route("/{id}", func(r chi.Router) {
		r.Get("/", UserGet(db.UserGetById))
		r.Put("/", UserUpdate(db.UserUpdate, db.UserGetById))
		r.Delete("/", UserDelete(db.UserDelete, db.UserGetById))
	})
}
