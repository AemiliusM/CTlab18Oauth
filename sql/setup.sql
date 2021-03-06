DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS comments;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    github_login TEXT UNIQUE NOT NULL,
    github_avatar_url TEXT NOT NULL
);

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT
);

CREATE TABLE tags (
   id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   tag TEXT,
   post_id BIGINT, 
   FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comment_by BIGINT,
    FOREIGN KEY(comment_by) REFERENCES users(id) ON DELETE CASCADE,
    post BIGINT,
    FOREIGN KEY(post) REFERENCES posts(id) ON DELETE CASCADE,
    comment TEXT
);