package controller

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
)

// single instance of go-validator
var validate *validator.Validate

// regitster custom tag name for go-validator
func validateInit() {
	validate = validator.New()
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
}

// go-validator wrapper
func validateStruct(s interface{}) ValidationErrors {
	errors := ValidationErrors{}

	err := validate.Struct(s)
	if err != nil {
		ve, ok := err.(validator.ValidationErrors)
		if !ok {
			fmt.Println("####################################")
			fmt.Println("error: failed typecasting error interface => validator.ValidationErrors")
			fmt.Println("####################################")
			return errors
		}

		for _, fieldErr := range ve {
			errors[fieldErr.Field()] = fmt.Sprintf(errorTable[fieldErr.Tag()], fieldErr.Param())
		}

	}

	return errors
}
