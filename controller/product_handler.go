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
)

// context key, used by ProductCtx function
const productCtxKey string = "product"

// default product image
const productImageURL string = "https://res.cloudinary.com/abdillahsyamil77/image/upload/v1655644509/samples/ecommerce/shoes.png"

type (
	// 2nd param is take, 3rd param is skip
	dbProductFind    func(context.Context, int64, int64) ([]*model.Product, error)
	dbProductCount   func(context.Context) (int64, error)
	dbProductGetById func(context.Context, primitive.ObjectID) (*model.Product, error)
	// insert or update to db, 2nd params maybe mutate after op
	dbProductWrite  func(context.Context, *model.Product) error
	dbProductDelete func(context.Context, primitive.ObjectID) error
)

func ProductFind(find dbProductFind, count dbProductCount) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		take := int64(20)
		skip := int64(0)

		if t, ok := r.Context().Value("take").(int64); ok {
			take = t
		}

		if s, ok := r.Context().Value("skip").(int64); ok {
			skip = s
		}

		total := make(chan int64)
		errc := make(chan error)

		go func() {
			t, err := count(r.Context())
			errc <- err
			total <- t
		}()

		pp, err := find(r.Context(), take, skip)
		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		err = <-errc
		if err != nil {
			respondWithInternalErr(w, err)
			return
		}

		t := <-total
		respondWith(w, J{
			"products": pp,
			"total":    t,
		})
	}
}

func ProductGet() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		p, ok := r.Context().Value(productCtxKey).(*model.Product)
		if !ok {
			respondWithInternalErr(w, errors.New("INTERVAL_SERVER_ERROR"))
			return
		}

		respondWith(w, J{
			"product": p,
		})
	}
}

func ProductCreate(create dbProductWrite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		p := model.Product{}

		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		p.Name = strings.Trim(p.Name, " ")
		if err := validate.Struct(&p); err != nil {
			ve, ok := err.(validator.ValidationErrors)
			if !ok {
				respondWithInternalErr(w, err)
				return
			}

			respondWith(w, J{
				"invalid_errors": toBadValueMap(ve),
			}, http.StatusBadRequest)
			return
		}

		p.CreatedAt = time.Now().UnixMilli()

		if err := create(r.Context(), &p); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		respondWith(w, J{"product": &p}, http.StatusCreated)
	}
}

func ProductUpdate(update dbProductWrite) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		p, ok := r.Context().Value(productCtxKey).(*model.Product)
		if !ok {
			respondWithInternalErr(w, errors.New("INTERNAL_SERVER_ERROR"))
			return
		}

		if err := json.NewDecoder(r.Body).Decode(p); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		p.Name = strings.Trim(p.Name, " ")
		if err := validate.Struct(p); err != nil {
			ve, ok := err.(validator.ValidationErrors)
			if !ok {
				respondWithInternalErr(w, err)
				return
			}

			respondWith(w, J{
				"invalid_errors": toBadValueMap(ve),
			}, http.StatusBadRequest)
			return
		}

		if err := update(r.Context(), p); err != nil {
			respondWith(w, err)
			return
		}

		respondWith(w, J{"product": p})
	}
}

func ProductDelete(delete dbProductDelete) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		p, ok := r.Context().Value(productCtxKey).(*model.Product)
		if !ok {
			respondWithInternalErr(w, errors.New("INTERNAL_SERVER_ERROR"))
			return
		}

		if err := delete(r.Context(), p.Id); err != nil {
			respondWithInternalErr(w, err)
			return
		}

		respondWith(w, J{
			"product": p,
		})
	}
}

func ProductCtx(getOne dbProductGetById) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			id, err := primitive.ObjectIDFromHex(chi.URLParam(r, "id"))
			if err != nil {
				respondWithNotFound(w)
				return
			}

			p, err := getOne(r.Context(), id)
			if err != nil {
				respondWithInternalErr(w, err)
				return
			}

			if p == nil {
				respondWithNotFound(w)
				return
			}

			ctx := context.WithValue(r.Context(), productCtxKey, p)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func ProductRoute(r chi.Router) {
	r.With(paginate).Get("/", ProductFind(db.ProductFind, db.ProductCount))
	r.With(superuserOnly).Post("/", ProductCreate(db.ProductCreate))

	r.Route("/{id}", func(r chi.Router) {
		r.Use(ProductCtx(db.ProductGetById))
		r.Get("/", ProductGet())

		r.With(superuserOnly).Group(func(r chi.Router) {
			r.Put("/", ProductUpdate(db.ProductUpdate))
			r.Delete("/", ProductDelete(db.ProductDelete))
		})
	})
}
