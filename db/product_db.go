package db

import (
	"context"

	"github.com/syamilAbdillah/ecommerce/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const PRODUCT_COLLECTION string = "products"

func ProductCreate(ctx context.Context, p *model.Product) error {
	res, err := db.Collection(PRODUCT_COLLECTION).InsertOne(ctx, p)
	if err != nil {
		return err
	}

	id, ok := res.InsertedID.(primitive.ObjectID)
	if !ok {
		return insertedIDErr
	}

	p.Id = id

	return nil
}

func ProductFind(ctx context.Context, limit, skip int64) ([]*model.Product, error) {
	pp := []*model.Product{}
	o := (&options.FindOptions{}).
		SetLimit(limit).
		SetSkip(skip).
		SetSort(bson.D{
			{Key: "_id", Value: -1},
		})

	cur, err := db.Collection(PRODUCT_COLLECTION).Find(ctx, bson.M{}, o)
	if err != nil {
		return pp, err
	}

	defer cur.Close(ctx)

	for cur.Next(ctx) {
		var p model.Product
		if err := cur.Decode(&p); err != nil {
			return pp, err
		}
		pp = append(pp, &p)
	}

	return pp, nil
}

func ProductGetById(ctx context.Context, id primitive.ObjectID) (*model.Product, error) {
	var p model.Product
	err := db.Collection(PRODUCT_COLLECTION).
		FindOne(ctx, bson.M{"_id": id}).
		Decode(&p)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}

	return &p, err
}

func ProductCount(ctx context.Context) (int64, error) {
	return db.Collection(PRODUCT_COLLECTION).CountDocuments(ctx, bson.M{})
}

func ProductUpdate(ctx context.Context, p *model.Product) error {
	_, err := db.Collection(PRODUCT_COLLECTION).UpdateByID(ctx, p.Id, bson.M{
		"$set": bson.M{
			"name":  p.Name,
			"price": p.Price,
			"image": p.Image,
		},
	})

	return err
}

func ProductDelete(ctx context.Context, id primitive.ObjectID) error {
	_, err := db.Collection(PRODUCT_COLLECTION).
		DeleteOne(ctx, bson.M{"_id": id})

	return err
}
