const request = require("supertest");
const app = require("../app");
const db = require("../database");
const bcrypt = require("bcrypt");

describe("Logging in", () => {
	beforeEach(async () => {
		await new Promise((resolve, reject) => {
			db.run(
				"INSERT INTO users (username, password, sessionId) VALUES (?, ?, ?)",
				["username", bcrypt.hashSync("password", 10), "0123456789"],
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

	test("Valid", async () => {
		const response = await request(app)
			.post("/auth/login")
			.type("form")
			.send({
				username: "username",
				password: "password"
			});
		expect(response.status).toBe(302);
		expect(response.headers.location).toBe("/");
		const sessionId = response.headers["set-cookie"][0].split(";")[0].split("=")[1];
		const user = await new Promise((resolve, reject) => {
			db.get("SELECT sessionId FROM users WHERE username = ?", ["username"], (err, row) =>
				err ? reject(err) : resolve(row)
			);
		});
		expect(user.sessionId).toBe(sessionId);
	});

	test("Invalid", async () => {
		const response = await request(app)
			.post("/auth/login")
			.type("form")
			.send({
				username: "username",
				password: "wrongpassword"
			});
		expect(response.status).toBe(200);
		expect(response.text).toContain("Invalid username or password");
		const user = await new Promise((resolve, reject) => {
			db.get("SELECT sessionId FROM users WHERE username = ?", ["username"], (err, row) =>
				err ? reject(err) : resolve(row)
			);
		});
		expect(user.sessionId).toBe("0123456789");
	});
});

describe("Registering", () => {
	afterEach(async () => {
		await new Promise((resolve, reject) => {
			db.run("DELETE FROM users WHERE username = ?", ["username"], (err) =>
				err ? reject(err) : resolve()
			);
		});
	});

	test("New account", async () => {
		const response = await request(app)
			.post("/auth/register")
			.type("form")
			.send({
				username: "username",
				password: "password"
			});
		expect(response.status).toBe(302);
		expect(response.headers.location).toBe("/auth/login");
		const user = await new Promise((resolve, reject) => {
			db.get("SELECT * FROM users WHERE username = ?", ["username"], (err, row) =>
				err ? reject(err) : resolve(row)
			);
		});
		expect(bcrypt.compareSync("password", user.password)).toBe(true);
	});
	
	test("Duplicate", async () => {
		const response = await request(app)
			.post("/auth/register")
			.type("form")
			.send({
				username: "admin",
				password: "password"
			});
		expect(response.status).toBe(302);
		expect(response.headers.location).toBe("/auth/login");
		const user = await new Promise((resolve, reject) => {
			db.get("SELECT * FROM users WHERE username = ?", ["admin"], (err, row) =>
				err ? reject(err) : resolve(row)
			);
		});
		expect(bcrypt.compareSync("password", user.password)).toBe(false);
	});
});

describe("Logging out", () => {
	beforeEach(async () => {
		await new Promise((resolve, reject) => {
			db.run(
				"INSERT INTO users (username, password, sessionId) VALUES (?, ?, ?)",
				["username", bcrypt.hashSync("password", 10), "0123456789"],
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

	test("Logging out", async () => {
		const response = await request(app)
			.get("/auth/logout")
		expect(response.status).toBe(302);
		expect(response.headers.location).toBe("/auth/login");
		expect(response.headers["set-cookie"][0].split(";")[0].split("=")[1]).toBe("")
	});
});