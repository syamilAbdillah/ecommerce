package controller

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/go-chi/render"
	"github.com/syamilAbdillah/ecommerce/model"
)

// map[string]interface{} shortcut for convinience reason
type J map[string]interface{}

func respondWith(w http.ResponseWriter, v interface{}, status ...int) {
	var buff bytes.Buffer
	if err := json.NewEncoder(&buff).Encode(v); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write(FormatErrResp(err.Error()))
		return
	}

	code := http.StatusOK

	if len(status) > 0 {
		code = status[0]
	}

	w.WriteHeader(code)
	w.Write(buff.Bytes())
}

func respondWithNotFound(w http.ResponseWriter) {
	respondWith(w, J{"error": "NOT_FOUND"}, http.StatusNotFound)
}

func respondWithInternalErr(w http.ResponseWriter, err error) {
	respondWith(w, J{"error": err.Error()}, http.StatusInternalServerError)
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

	ERROR

======================================================================================
*/
type ErrorResponse struct {
	HTTPStatusCode int              `json:"-"`
	ErrText        string           `json:"error,omitempty"`
	ValidationErr  ValidationErrors `json:"invalid_errors,omitempty"`
}

func (er *ErrorResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, er.HTTPStatusCode)
	return nil
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

	USER

======================================================================================
*/
type userResponse struct {
	User  *model.User   `json:"user,omitempty"`
	Users []*model.User `json:"users,omitempty"`
	Total int64         `json:"total,omitempty"`
}

func (u *userResponse) Render(w http.ResponseWriter, r *http.Request) error {
	if u.User != nil {
		u.User.Password = ""
	}
	return nil
}

type userPayload struct {
	model.User
}

func (u *userPayload) Bind(r *http.Request) error {
	ve := validateStruct(u)
	if len(ve) > 0 {
		return ve
	}
	return nil
}

type productResponse struct {
	Product  *model.Product   `json:"product,omitempty"`
	Products []*model.Product `json:"products,omitempty"`
	Total    int64            `json:"total,omitempty"`
}

func (pr *productResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

type productPayload struct {
	model.Product
}

func (pp *productPayload) Bind(r *http.Request) error {
	ve := validateStruct(pp)
	if len(ve) > 0 {
		return ve
	}

	return nil
}
