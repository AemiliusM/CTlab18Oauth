DELETE TABLE IF EXISTS users, posts, comments;

CREATE TABLE users (
    id GENERATED ALWAYS AS PRIMARY KEY,
    github_login TEXT UNIQUE NOT NULL,
    github_avatar_url TEXT NOT NULL
);

CREATE TABLE posts (
    id GENERATED ALWAYS AS PRIMARY KEY,
    user_id BIGINT,
    FORIEGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    tag_id BIGINT,
    FORIEGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE tags (
   id GENERATED ALWAYS AS PRIMARY KEY,
   tag TEXT 
   post_id BIGINT, 
   FORIEGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE,
);

CREATE TABLE comments (
    id GENERATED ALWAYS AS PRIMARY KEY,
    comment_by TEXT,
    FORIEGN KEY(comment_by) REFERENCES(users(id)) ON DELETE CASCADE,
    post BIGINT,
    FORIEGN KEY(post) REFERENCES(posts(id)) ON DELETE CASCADE,
    comment TEXT
);