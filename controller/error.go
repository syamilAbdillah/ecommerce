package controller

import (
	"net/http"

	"github.com/go-chi/render"
)

type ErrorResponse struct {
	HTTPStatusCode int              `json:"-"`
	ErrText        string           `json:"error,omitempty"`
	ValidationErr  ValidationErrors `json:"invalid_errors,omitempty"`
}

func (er *ErrorResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, er.HTTPStatusCode)
	return nil
}

// error helper
var (
	ErrRender = &ErrorResponse{
		HTTPStatusCode: http.StatusInternalServerError,
		ErrText:        "error while parsing json",
	}

	ErrUnauthorize = &ErrorResponse{
		HTTPStatusCode: http.StatusUnauthorized,
		ErrText:        "login required",
	}
)

// wrap internal server error
func InternalErr(err error) *ErrorResponse {
	er := new(ErrorResponse)
	er.HTTPStatusCode = http.StatusInternalServerError
	er.ErrText = err.Error()
	return er
}

// validation error
func ValidationErr(err error) *ErrorResponse {
	ie, ok := err.(ValidationErrors)
	if !ok {
		return InternalErr(err)
	}

	return &ErrorResponse{
		HTTPStatusCode: http.StatusBadRequest,
		ValidationErr:  ie,
	}
}

func WrapErr(err error, status int) *ErrorResponse {
	return &ErrorResponse{
		HTTPStatusCode: status,
		ErrText:        err.Error(),
	}
}
