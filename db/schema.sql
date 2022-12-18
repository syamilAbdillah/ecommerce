CREATE TABLE users (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	profile_picture TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	role TEXT DEFAULT "user"
);