package db

import (
	"context"
	"database/sql"

	sq "github.com/Masterminds/squirrel"
	"github.com/syamilAbdillah/ecommerce/model"
)

func UserCount(ctx context.Context, role model.Role) (int64, error) {
	var total int64
	sqlBuilder := sq.Select("COUNT(id)").From("users")

	if role != "" {
		sqlBuilder = sqlBuilder.Where(sq.Eq{"role": role})
	}

	query, args, err := sqlBuilder.ToSql()
	if err != nil {
		return total, err
	}
	err = conn.QueryRowContext(ctx, query, args...).Scan(&total)
	return total, err
}

func UserCreate(ctx context.Context, u *model.User) error {
	sql, args, err := sq.Insert("users").
		Columns("name", "email", "password", "created_at", "role", "profile_picture").
		Values(u.Name, u.Email, u.Password, u.CreatedAt, u.Role, u.ProfilePicture).
		ToSql()
	if err != nil {
		return err
	}

	res, err := conn.ExecContext(ctx, sql, args...)
	if err != nil {
		return err
	}

	u.Id, err = res.RowsAffected()
	return err
}

func UserDelete(ctx context.Context, id int64) error {
	query, args, err := sq.Delete("users").Where(sq.Eq{"id": id}).ToSql()

	if err != nil {
		return err
	}

	_, err = conn.ExecContext(ctx, query, args...)
	return err
}

func UserFind(ctx context.Context, role model.Role, limit uint64, offset uint64) ([]*model.User, error) {
	var uu []*model.User

	sqlBuilder := sq.
		Select("id", "name", "email", "profile_picture", "created_at", "role").
		Where(sq.Eq{"role": role}).
		From("users").
		Limit(limit).
		Offset(offset)

	query, args, err := sqlBuilder.ToSql()

	if err != nil {
		return uu, err
	}

	err = conn.SelectContext(ctx, &uu, query, args...)
	return uu, err
}

func userGetBy(ctx context.Context, field string, value interface{}) (*model.User, error) {
	u := model.User{}

	query, args, err := sq.Select("*").
		From("users").
		Where(sq.Eq{
			field: value,
		}).ToSql()

	if err != nil {
		return nil, err
	}

	err = conn.GetContext(ctx, &u, query, args...)

	if err != nil {
		if err.Error() == sql.ErrNoRows.Error() {
			return nil, nil
		}

		return nil, err
	}

	return &u, nil
}

func UserGetByEmail(ctx context.Context, email string) (*model.User, error) {
	return userGetBy(ctx, "email", email)
}

func UserGetById(ctx context.Context, id int64) (*model.User, error) {
	return userGetBy(ctx, "id", id)
}

func UserUpdate(ctx context.Context, u *model.User) error {
	query, args, err := sq.Update("users").
		Set("name", u.Name).
		Set("password", u.Password).
		Set("profile_picture", u.ProfilePicture).
		Where(sq.Eq{"id": u.Id}).
		ToSql()

	if err != nil {
		return err
	}

	_, err = conn.ExecContext(ctx, query, args...)
	return err
}
