package db

import "errors"

var insertedIDErr = errors.New("[mongo-driver] res.insertedID is not primitive.ObjectID")
