# Unit test documentation
I asked an AI and it gave me these. I wrote the tests myself, though I asked it for help at a couple spots.
* Redirects an unauthenticated user from the home page to the login page.
* Renders the blog homepage with all posts and the current user when a valid session cookie is present.
* Blocks a non-admin user from accessing the admin page and returns a 403 response.
* Allows an admin user to access the admin page and render the admin view.
* Creates a new blog post when a logged-in user submits valid title and content data.
* Prevents a non-authenticated user from creating a post and redirects them to login.
* Logs in a user with valid credentials by checking the stored hash, setting the session cookie, and redirecting to the home page.
* Rejects a login attempt with invalid credentials and re-renders the login page with an error message.
* Registers a new user by hashing the password, storing the account, and redirecting to the login page without creating duplicates.
* Clears the session cookie and redirects the user to the login page when they log out.