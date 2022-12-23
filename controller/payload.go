package controller

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/syamilAbdillah/ecommerce/model"
)

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
