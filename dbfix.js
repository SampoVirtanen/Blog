const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('blog.db');

db.serialize(() => {
	db.run("CREATE TABLE posts_id (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)");
	db.run(`INSERT INTO posts_id(title, content)
		SELECT title, content
		FROM posts`);
	db.run("DROP TABLE posts");
	db.run("ALTER TABLE posts_id RENAME TO posts");
});