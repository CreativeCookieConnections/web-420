/*
Author: Aisha Keller
Date: 01/29/2026
File name: app.js
Description: Main application file for the Cookbook app.
*/

const express = require('express');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const { type } = require('os');
const users = require("../database/users");
const Ajv = require("ajv");
const ajv = new Ajv();

const app = express(); // Creates an express application

const defaultSecurityQuestions = [
    { answer: "Hedwig" },
    { answer: "Quidditch Through the Ages" },
    { answer: "Evans" }
];

const securityQuestionsSchema = {
    type: "object",
    properties: {
        newPassword: { type: "string" },
        securityQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    answer: { type: "string" }
                },
                required: ["answer"],
                additionalProperties: false
            }
        }
    },
    required: ["newPassword", "securityQuestions"],
    additionalProperties: false
};

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.get("/", async (req, res, next) => {
    // HTML content for landing page
const html = `
<html>
<head>
<title>Cookbook App</title>
<style>
body, h1, h2, h3 {margin: 0; padding: 0; border: 0;}
body {
    background: #424242;
    color: #fff;
    margin: 1.25rem;
    font-size: 1.25rem;
    }
h1, h2, h3 { color: #EF5350; font-family: 'Emblema One', cursive;}
h1, h2 { text-align: center }
h3 {color: #fff;}
.container {width: 50%; margin: 0 auto; font-family: 'Lora', serif;}
.recipe {border: 1px solid #EF5350; padding: 1rem; margin: 1rem 0;}
.recipe h3 {margin-top: 0;}

main a {color: #fff; text-decoration: none;}
main a:hover {color #EF5350; text-decoration: underline;}
</style>
</head>
<body>
<div class="container">
<header>
<h1>Cookbook App</h1>
<h2>Discover and Share Amazing Recipes</h2>
</header>
<br />
<main>
<div class="recipe">
<h3>Classic Beef Tacos</h3>
<p>1. Brown the ground beef in a skillet.<br>2. Warm the taco shells in the oven.<br>3. Fill the taco shells with beef, lettuce, and cheese.</p>
</div>
<div class="recipe">
<h3>Vegetarian Lasagna</h3>
<p>1. Layer lasagna noodles, marinara sauce, and cheese in a baking dish.<br>2. Bake at 375 degrees for 45 minutes.<br>3. Let cool before serving.</p>
</div>
</main>
</div>
</body>
</html>
`; // end HTML content for the landing page

res.send(html); // Send the HTML content to the client

});

// Add validation to the POST endpoint that checks if the email address is already in use. If it is, generate a 409 error and pass it to our middleware handler
app.post("/api/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const expectedKeys = ["email", "password"];
        const receivedKeys = Object.keys(req.body);

        if(!receivedKeys.every(key => expectedKeys.includes(key)) ||
        receivedKeys.length !== expectedKeys.length) {
            console.error("Bad Request: Missing keys or extra keys", receivedKeys); // Log error for bad request
            return next(createError(400, "Bad Request")); // Send 400 error for bad request
        }
        
        let duplicateUser;
        try {
            duplicateUser = await users.findOne({ email: email }); // Check if a user with the same email already exists
        } catch (err) {
            duplicateUser = null; // If an error occurs during the database query, treat it as if no duplicate user was found
        }

        if(duplicateUser) {
            console.error("Conflict: User already exists"); // Log error for duplicate user
            return next(createError(409, "Conflict")); // Send 409 error for duplicate user
        }

        const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password using bcrypt with 10 salt rounds

        console.log("email:", email); // Log the email address
        console.log("password:", hashedPassword); // Log the hashed password

        const user = await users.insertOne({
            email: email,
            password: hashedPassword,
            securityQuestions: defaultSecurityQuestions
        });

        res.status(200).send({ user: user, message: "Registration successful" }); // Send response with user information and success message

    } catch (err) {
        console.error("Error:", err); // Log error message
        console.error("Error:", err.message); // Log error message
        next(err); // Passes error to the next middleware
    }
});

const recipes = require("../database/recipes"); // Import recipes database module

// API fetch, log, send response, logs error, and passes error to the next middleware

app.get("/api/recipes", async (req, res, next) => {
    try {
        const allRecipes = await recipes.find(); // Fetch all recipes from the database
        console.log("All Recipes:", allRecipes); // Log all recipes
        res.send(allRecipes); // Sends response with all books
    } catch (err) {
        console.error("Error:", err.message); // Logs error message
        next(err); // Passes error to the next middleware
    }
});

// Get single recipe by ID, log the recipe, send response, log error, and pass error to the next middleware

app.get("/api/recipes/:id", async (req, res, next) => {
    try {
        let {id} =req.params;
        id = parseInt(id);

        if (isNaN(id)) {
            return next(createError(400, "Input must be a number"));
    }

    const recipe = await recipes.findOne({ id: id }); // Fetch recipe by ID

    console.log("Recipe:", recipe); // Log the fetched recipe
    res.send(recipe); // Sends response with the fetched recipe
    } catch (err) {
        console.error("Error:", err.message); // Logs error message
        next(err); // Passes error to the next middleware
    }
});

// Add a new recipe, log the result, send response with the new recipe ID, log error, and pass error to the next middleware

app.post("/api/recipes", async (req, res, next) => {
    try {
        const newRecipe = req.body; // Get new recipe data from request body

        const expectedKeys = ["id", "name", "ingredients"];
        const receivedKeys = Object.keys(newRecipe);

        if(!receivedKeys.every(key =>expectedKeys.includes(key)) ||
        receivedKeys.length !== expectedKeys.length) {
            console.error("Bad Request: Missing keys or extra keys", receivedKeys); // Log error for bad request
            return next(createError(400, "Bad Request")); // Send 400 error for bad request
        }

        const result = await recipes.insertOne(newRecipe); // Insert new recipe into the database
        console.log("Result:", result); // Log the result of the insertion
        res.status(201).send({id: result.ops[0].id}); // Send response with the ID of the newly created recipe
    } catch (err) {
        console.error("Error:", err.message); // Logs error message
        next(err); // Passes error to the next middleware
    }
});

// Delete a recipe by ID, log the result, send response, log error, and pass error to the next middleware
app.delete("/api/recipes/:id", async (req, res, next) => {
    try {
        const { id } = req.params; // Get recipe ID from request parameters
        const result = await recipes.deleteOne({ id: parseInt(id) }); // Delete recipe from the database
        console.log("Result:", result); // Log the result of the deletion
        res.status(204).send(); // Send 204 No Content response
    } catch (err) {
        if (err.message === "No matching item found") {
            return next(createError(404, "Recipe not found")); // Send 404 error if recipe is not found
        }

        console.error("Error:", err.message); // Logs error message
        next(err); // Passes error to the next middleware
    }
});

// Create a new POST endpoint. Add a try-catch block for unexpected errors, update the user's password, and return 200 status code with a message of "Password reset successful" message.
app.post("/api/users/:email/reset-password", async (req, res, next) => {
    try {
        const { email } = req.params; // Get email from request parameters
        const { newPassword, securityQuestions } =req.body; // Get new password and security questions from request body

        const validate = ajv.compile(securityQuestionsSchema); // Compile the AJV schema
        const valid = validate(req.body); // Validate the request body against the schema

        if (!valid) {
            console.error("Bad Request: Invalid request body", validate.errors); // Log error for invalid request body
            return next(createError(400, "Bad Request")); // Send 400 error for invalid request body
        }

        let user;
        try {
            user = await users.findOne({ email: email }); // Find user by email
        } catch (err) {
            console.error("Unauthorized: User not found");
            return next(createError(401, "Unauthorized"));
        }

        if (!Array.isArray(securityQuestions) || securityQuestions.length < 3 ||
            !Array.isArray(user.securityQuestions) || user.securityQuestions.length < 3) {
            console.error("Unauthorized: Security questions do not match");
            return next(createError(401, "Unauthorized"));
        }

        if (securityQuestions[0].answer !== user.securityQuestions[0].answer ||
            securityQuestions[1].answer !== user.securityQuestions[1].answer ||
            securityQuestions[2].answer !== user.securityQuestions[2].answer) {
                console.error("Unauthorized: Security questions do not match"); // Log error for unauthorized access
                return next(createError(401, "Unauthorized")); // Send 401 error for unauthorized access
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password using bcrypt with 10 salt rounds
        user.password = hashedPassword; // Update user's password with the hashed new password

        const result = await users.updateOne({ email: email }, {user}); // Update the user in the database
        
        console.log("Result:", result); // Log the result of the update
        res.status(200).send({ message: "Password reset successful", user: user }); // Send response with success message and updated user information
    } catch (err) {
        console.error("Error:", err.message); // Logs error message
        next(err); // Passes error to the next middleware
    }
});


// Return a 400 status code when adding a new recipe and input must be a number
app.put("/api/recipes/:id", async (req, res, next) => {
    try {
        let {id} = req.params;
        let recipe = req.body;
        id = parseInt(id);

        if (isNaN(id)) {
            return next(createError(400, "Input must be a number")); // Send 400 error if ID is not a number
        }

        const expectedKeys = ["name", "ingredients"];
        const receivedKeys = Object.keys(recipe);

        if(!receivedKeys.every(key => expectedKeys.includes(key)) ||
    receivedKeys.length !== expectedKeys.length) {
        console.error("Bad Request: Missing keys or extra keys", receivedKeys); // Log error for bad request
        return next(createError(400, "Bad Request")); // Send 400 error for bad request
    }

        const result = await recipes.updateOne({ id: id }, recipe); // Update recipe in the database
        console.log("Result:", result); // Log the result of the update
        res.status(204).send(); // Send 204 No Content response
    } catch (err) {
        if (err.message === "No matching item found") {
            console.log("Recipe not found", err.message); // Log error if recipe is not found
            return next(createError(404, "Recipe not found")); // Send 404 error if recipe is not found
        }

        console.error("Error:", err.message); // Logs error message
        next(err); // Passes error to the next middleware
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    res.json({
        type: 'error',
        status: err.status,
        message: err.message,
        stack: req.app.get('env') === 'development' ? err.stack : undefined
    });
});

module.exports = app; // Export the app for use in other files

