CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(60) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(60) NOT NULL,
    content TEXT,
    file_tree JSONB
);

CREATE INDEX idx_projects_user_id ON projects(user_id);