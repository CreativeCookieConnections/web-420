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

const app = express(); // Creates an express application

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

const recipes = require("../database/recipes"); // Import recipes database module

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

// Delete a recipe by ID
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

