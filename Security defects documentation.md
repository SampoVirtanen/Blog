# Security defects documentation
I decided to add these 4 defects.
* Allows a non-admin user to access the admin page and render the admin view.
* Allows an unauthenticated user to create a post.
* Logs in a user with invalid credentials without checking the password.
* Doesn't hash the password when registering.

## Changes
``` diff
app.get('/admin', (req, res) => {
-  if (!req.user || req.user.username !== 'admin') {
-      return res.status(403).send('Access denied');
-  }
  res.render('admin', { title: 'Admin Page', user: req.user });
});
```

``` diff
app.post('/new-post', (req, res) => {
-  if (!req.user) {
-    return res.redirect('/auth/login');
-  }
  const { title, content } = req.body;
  db.run("INSERT INTO posts (title, content) VALUES (?, ?)", [title, content], (err) => {
      if (err) throw err;
      res.redirect('/');
  });
});
```

``` diff
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) throw err;
-        if (user && bcrypt.compareSync(password, user.password)) {
+        if (user) {
            const sessionId = crypto.createHash('sha256').update(user.username).digest('hex');
            db.run("UPDATE users SET sessionId = ? WHERE username = ?", [sessionId, user.username], (err) => {
                if (err) throw err;
                res.cookie('sessionId', sessionId, { httpOnly: true });
                console.log('Login successful, sessionId:', sessionId);
                res.redirect('/');
            });
        } else {
            res.render('login', { title: 'Login', error: 'Invalid username or password' });
        }
    });
});
```

``` diff
router.post('/register', (req, res) => {
    const { username, password } = req.body;
-    const hashedPassword = bcrypt.hashSync(password, 10);
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) throw err;
        if (!user) {
-            db.run("INSERT INTO users (username, password, sessionId) VALUES (?, ?, ?)", [username, hashedPassword, 0], (err) => {
+            db.run("INSERT INTO users (username, password, sessionId) VALUES (?, ?, ?)", [username, password, 0], (err) => {
                if (err) throw err;
            });
        }
        res.redirect('/auth/login');
    });
});
```
## Test results
```
npm test

> blog@0.0.0 test
> jest --runInBand

 FAIL  tests/app.test.js
  ● Admin page › Not admin

    expect(received).toBe(expected) // Object.is equality

    Expected: 403
    Received: 200

      50 |              const response = await request(app)
      51 |                      .get("/admin");
    > 52 |              expect(response.status).toBe(403);
         |                                      ^
      53 |              expect(response.text).toBe("Access denied");
      54 |      });
      55 |

      at Object.toBe (tests/app.test.js:52:27)

  ● Creating posts › Not logged in

    expect(received).toBe(expected) // Object.is equality

    Expected: "/auth/login"
    Received: "/"

      136 |                     });
      137 |             expect(response.status).toBe(302);
    > 138 |             expect(response.headers.location).toBe("/auth/login");
          |                                               ^
      139 |             const post = await new Promise((resolve, reject) => {
      140 |                     db.get("SELECT * FROM posts ORDER BY id desc LIMIT 1", (err, row) => {
      141 |                             if (err) reject(err);

      at Object.toBe (tests/app.test.js:138:37)

 FAIL  tests/auth.test.js
  ● Logging in › Invalid

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 302

      50 |                              password: "wrongpassword"
      51 |                      });
    > 52 |              expect(response.status).toBe(200);
         |                                      ^
      53 |              expect(response.text).toContain("Invalid username or password");
      54 |              const user = await new Promise((resolve, reject) => {
      55 |                      db.get("SELECT sessionId FROM users WHERE username = ?", ["username"], (err, row) =>

      at Object.toBe (tests/auth.test.js:52:27)

  ● Registering › New account

    expect(received).toBe(expected) // Object.is equality

    Expected: true
    Received: false

      85 |                      );
      86 |              });
    > 87 |              expect(bcrypt.compareSync("password", user.password)).toBe(true);
         |                                                                    ^
      88 |      });
      89 | 
      90 |      test("Duplicate", async () => {

      at Object.toBe (tests/auth.test.js:87:57)

Test Suites: 2 failed, 2 total
Tests:       4 failed, 7 passed, 11 total
Snapshots:   0 total
Time:        0.746 s, estimated 1 s
Ran all test suites.
```