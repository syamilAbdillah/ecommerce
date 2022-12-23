package controller

import (
	"fmt"
	"net/http"
)

type ValidationErrors map[string]string

func (ie ValidationErrors) Error() string {
	var k string
	var v string

	for k, v = range ie {
		break
	}

	return fmt.Sprintf("[%s] %s \n", k, v)
}

var errorTable = map[string]string{
	"required": "shouldn't be empty %v",
	"email":    "invalid email format %v",
	"max":      "at most %v char(s)",
	"min":      "at least %v char(s)",
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
