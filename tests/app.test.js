const request = require("supertest");
const app = require("../app");
const db = require("../database");

describe("Root path", () => {
	beforeEach(async () => {
		await new Promise((resolve, reject) => {
			db.run(
				"INSERT INTO users (username, password, sessionId) VALUES (?, ?, ?)",
				["username", "password", "0123456789"],
				(err) => (err ? reject(err) : resolve())
			);
		});
	});

	afterEach(async () => {
		await new Promise((resolve, reject) => {
			db.run("DELETE FROM users WHERE username = ?", ["username"], (err) =>
				err ? reject(err) : resolve()
			);
		});
	});

	test("Not logged in", async () => {
		const response = await request(app)
			.get("/")
			.redirects(0);

		expect(response.status).toBe(302);
		expect(response.headers.location).toBe("/auth/login");
	});

	test("Logged in", async () => {
		const response = await request(app)
			.get("/")
			.set("Cookie", "sessionId=0123456789");

		expect(response.status).toBe(200);
		expect(response.text).toContain("My Blog");
		db.all("SELECT * FROM posts", (err, posts) => {
			for (const post of posts) {
				expect(response.text).toContain(post.title);
			}
		});
	});
});

describe("Admin page", () => {
	test("Not admin", async () => {
		const response = await request(app)
			.get("/admin");
		expect(response.status).toBe(403);
		expect(response.text).toBe("Access denied");
	});

	test("Admin", async () => {
		db.get(
			"SELECT sessionId FROM users WHERE username = ?",
			["admin"],
			async (err, row) => {
				if (err) throw err;
				const sessionID = row?.sessionId;
				const response = await request(app)
					.get("/admin")
					.set("Cookie", `sessionId=${sessionID}`);
				expect(response.status).toBe(200);
				expect(response.text).toContain("Admin Page");
			}
		);
	});
});


describe("Creating posts", () => {
	beforeEach(async () => {
		await new Promise((resolve, reject) => {
			db.run(
				"INSERT INTO users (username, password, sessionId) VALUES (?, ?, ?)",
				["username", "password", "0123456789"],
				(err) => (err ? reject(err) : resolve())
			);
		});
	});

	afterEach(async () => {
		await new Promise((resolve, reject) => {
			db.run("DELETE FROM users WHERE username = ?", ["username"], (err) =>
				err ? reject(err) : resolve()
			);
		});
	});

	test("Logged in", async () => {
		const response = await request(app)
			.post("/new-post")
			.set("Cookie", "sessionId=0123456789")
			.type("form")
			.send({
				title: "Test post (Logged in)",
				content: "This is a test (Logged in)"
			});
		expect(response.status).toBe(302);
		expect(response.headers.location).toBe("/");
		const post = await new Promise((resolve, reject) => {
			db.get("SELECT * FROM posts WHERE title = ?", ["Test post (Logged in)"], (err, row) => {
				if (err) reject(err);
				else resolve(row);
			});
		});

		expect(post.title).toBe("Test post (Logged in)");
		expect(post.content).toBe("This is a test");
	});

	test("Not logged in", async () => {
		const response = await request(app)
			.post("/new-post")
			.type("form")
			.send({
				title: "Test post (Not logged in)",
				content: "This is a test (Not logged in)"
			});
		expect(response.status).toBe(302);
		expect(response.headers.location).toBe("/auth/login");
		db.get(
			"SELECT * FROM posts LIMIT 1",
			(err, post) => {
				if (err) throw err;
				expect(post.title).not.toBe("Test post (Not logged in)");
				expect(post.content).not.toBe("This is a test (Not logged in)");
			}
		);
	});
});