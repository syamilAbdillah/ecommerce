package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
)

// map[string]interface{} shortcut for convinience reason
type J map[string]interface{}

type BadValue struct {
	Rule  string `json:"rule"`
	Param string `json:"param,omitempty"`
}

type BadValueMap map[string]BadValue

// take "github.com/go-playground/validator/v10" validator.ValidationErrors and transform it to BadValueMap
func toBadValueMap(errs validator.ValidationErrors) BadValueMap {
	m := BadValueMap{}
	for _, fieldErr := range errs {
		m[fieldErr.Field()] = BadValue{fieldErr.Tag(), fieldErr.Param()}
	}
	return m
}

func respondWith(w http.ResponseWriter, v interface{}, status ...int) {
	var buff bytes.Buffer
	if err := json.NewEncoder(&buff).Encode(v); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf(`{"error": "%s"}`, err.Error())))
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
