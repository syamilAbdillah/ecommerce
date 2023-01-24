package controller

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"

	chiCors "github.com/go-chi/cors"
	"github.com/gorilla/sessions"
	"github.com/syamilAbdillah/ecommerce/model"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

type getSession func(*http.Request, string) (*sessions.Session, error)

func getUserFromSession(
	getOne dbUserGetById,
	getSess getSession,
) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			g := &model.User{Role: model.RoleGuest}

			sess, err := getSess(r, SESSION_NAME)
			if err != nil {
				log.Printf("err: %v \n", err)
				respondWithInternalErr(w, err)
				return
			}

			log.Printf("sess: %v \n", sess)

			if sess.IsNew {
				log.Println("sess.IsNew: true")
				ctx := context.WithValue(r.Context(), CURRENT_USER_CTX_KEY, g)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}

			strid, ok := sess.Values[SESSION_ID_KEY].(string)
			log.Printf("strid: %s \n", strid)
			if !ok {
				respondWithInternalErr(w, errors.New("INTERNAL_SERVER_ERROR"))
				return
			}

			id, err := primitive.ObjectIDFromHex(strid)
			if err != nil {
				log.Printf("err casting ObjectIDFromHex: %v \n", err)
				respondWithInternalErr(w, err)
				return
			}

			u, err := getOne(r.Context(), id)
			if err != nil {
				respondWithInternalErr(w, err)
				return
			}

			if u == nil {
				ctx := context.WithValue(r.Context(), CURRENT_USER_CTX_KEY, g)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}

			ctx := context.WithValue(r.Context(), CURRENT_USER_CTX_KEY, u)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func superuserOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u, ok := r.Context().Value(CURRENT_USER_CTX_KEY).(*model.User)
		if !ok {
			respondWithInternalErr(w, errors.New("INTERNAL_SERVER_ERROR"))
			return
		}

		if u == nil {
			respondWithUnauthorized(w)
			return
		}

		if u.Role != model.RoleSuperuser {
			respondWithUnauthorized(w)
			return
		}

		fmt.Printf("current_user: %s \n", u.Email)
		next.ServeHTTP(w, r)
	})
}
