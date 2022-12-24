package db

import (
	"context"
	"errors"

	"github.com/syamilAbdillah/ecommerce/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func UserCount(ctx context.Context, role model.Role) (total int64, err error) {
	filter := bson.M{}

	if role == model.RoleSuperuser || role == model.RoleUser {
		filter["role"] = role
	}

	total, err = db.Collection("users").CountDocuments(ctx, filter)
	return total, err
}

func UserCreate(ctx context.Context, u *model.User) error {
	res, err := db.Collection("users").InsertOne(ctx, u)
	if err != nil {
		return err
	}

	id, ok := res.InsertedID.(primitive.ObjectID)
	if !ok {
		return errors.New("[mongo-driver] res.insertedID is not primitive.ObjectID")
	}

	u.Id = id

	return nil
}

func UserDelete(ctx context.Context, id primitive.ObjectID) error {
	_, err := db.Collection("users").DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func UserFind(
	ctx context.Context,
	role model.Role,
	limit int64,
	lastId primitive.ObjectID,
) ([]*model.User, error) {
	var uu []*model.User
	filter := bson.M{"_id": bson.M{"$gt": lastId}}
	opt := options.Find().SetLimit(limit).SetProjection(bson.D{{"password", 0}})

	if role == model.RoleSuperuser || role == model.RoleUser {
		filter["role"] = role
	}

	cur, err := db.Collection("users").Find(ctx, filter, opt)
	if err != nil {
		return uu, err
	}

	defer cur.Close(ctx)

	for cur.Next(ctx) {
		var u model.User
		err := cur.Decode(&u)
		if err != nil {
			return uu, err
		}
		uu = append(uu, &u)
	}

	return uu, err
}

func userGetBy(ctx context.Context, field string, value interface{}) (*model.User, error) {
	var u *model.User
	err := db.Collection("users").FindOne(ctx, bson.M{field: value}).Decode(u)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}

	return u, err
}

func UserGetByEmail(ctx context.Context, email string) (*model.User, error) {
	return userGetBy(ctx, "email", email)
}

func UserGetById(ctx context.Context, id primitive.ObjectID) (*model.User, error) {
	return userGetBy(ctx, "id", id)
}

func UserUpdate(ctx context.Context, u *model.User) error {
	_, err := db.Collection("users").UpdateByID(ctx, u.Id, bson.M{
		"name":            u.Name,
		"password":        u.Password,
		"profile_picture": u.ProfilePicture,
	})
	return err
}
