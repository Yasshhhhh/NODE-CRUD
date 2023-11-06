# NODE-CRUD
This code sets up a Node.js Express application with several API routes for user registration, user login, and product management. Here's a summary of the APIs and their functionality:

User Registration API (POST /register):

This API allows users to register by providing a username and password.
It checks if the user already exists in the MongoDB database.
If the user doesn't exist, it hashes the password and saves the user to the database.
User Login API (POST /login):

Users can log in using their username and password.
It validates the provided username and compares the hashed password with the stored password in the database.
If the credentials are correct, it generates a JSON Web Token (JWT) and sends it in the response.
Protected Route for Product Creation (POST /create):

This is a protected route that requires a valid JWT token for authentication.
It allows authorized users to insert a new product with hardcoded values (name, quantity, and price) into the database.
Get All Products API (GET /products):

Another protected route that requires a valid JWT token for authentication.
It fetches and returns all the products stored in the MongoDB database.
Middleware for JWT Authentication (authenticateToken):

This middleware is used to verify the JWT token in the request's "Authorization" header.
If the token is missing or invalid, it returns appropriate error responses.
If the token is valid, it adds the user information to the request object for further processing.
Database Connection and Server Start:

The code establishes a connection to a MongoDB database using the provided URL.
If the connection is successful, the Express app starts listening on port 3000.
Error handling is in place for both database connection and API server start.
