CREATE TABLE user (
  id SERIAL NOT NULL,
  name VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(255),
  password VARCHAR(255),
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT user_name_key UNIQUE (name)
);

CREATE TABLE todos (
  id INTEGER NOT NULL DEFAULT nextval('todo_id_seq'::regclass) PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(258) NOT NULL,
  completed BOOLEAN NOT NULL,
  CONSTRAINT todos_fkey FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE posts (
  id INTEGER NOT NULL DEFAULT nextval('post_id_seq'::regclass) PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  body VARCHAR(500),
  todosid INTEGER,
  CONSTRAINT posts_fkey FOREIGN KEY (todo_id) REFERENCES todos(id)
);

-- Query to get the post title, post body, todo title, todo completed status, and user name for each post.
SELECT 
    posts.title AS post_title,
    posts.body AS post_body,
    todos.completed AS todos_completed,
    todos.title AS todos_title,
    users.name AS user_name
FROM posts
JOIN users ON posts.user_id = users.id
JOIN todos ON todos.user_id = users.id;