package controller

import (
	"fmt"
	"reflect"
	"strings"
	"sync"

	"github.com/go-playground/validator/v10"
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

// single instance of go-validator
var validate *validator.Validate
var once sync.Once
// go-validator wrapper
func validateStruct(s interface{}) ValidationErrors {
	once.Do(func() {
		validate = validator.New()
		validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			if name == "-" {
				return ""
			}
			return name
		})
	})
	
	errors := ValidationErrors{}

	err := validate.Struct(s)
	if err != nil {
		ve, ok := err.(validator.ValidationErrors)
		if !ok {
			fmt.Println("####################################")
			fmt.Println("error: failed typecasting error interface => validator.ValidationErrors")
			fmt.Println("####################################")
			return map[string]string{}
		}

		for _, fieldErr := range ve {
			errors[fieldErr.Field()] = fmt.Sprintf(errorTable[fieldErr.Tag()], fieldErr.Param())
		}

	}


	return errors
}
