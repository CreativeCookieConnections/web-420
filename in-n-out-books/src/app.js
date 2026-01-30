/*
Name: Aisha Keller
Date: 01/29/2026
File: app.js
Description: in-n-out-books app.
*/

// Import required modules
const express = require('express');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const { type } = require('os');
const path = require('path');

// Create an express application
const app = express();

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.static(path.join(__dirname, '../Images'))); // Serve static files from Images folder

app.get("/", async (req, res, next) => {
    // HTML content for landing page
const html = `
<html>
<head>
<title>In-N-Out Books - Magical Book Emporium</title>
<style>
* {margin: 0; padding: 0; box-sizing: border-box;}
body {
    background: linear-gradient(135deg, #1a0033 0%, #2d0a4e 25%, #1a0033 50%, #0a0015 100%);
    background-attachment: fixed;
    color: #e6d5ff;
    margin: 0;
    font-size: 1.1rem;
    font-family: 'Georgia', serif;
    min-height: 100vh;
    position: relative;
}

@keyframes glow {
    0%, 100% { text-shadow: 0 0 10px #b794f6, 0 0 20px #b794f6, 0 0 30px #9370db; }
    50% { text-shadow: 0 0 20px #d4bbff, 0 0 30px #d4bbff, 0 0 40px #b794f6; }
}
h1, h2, h3 { 
    color: #d4bbff; 
    font-family: 'Brush Script MT', cursive, 'Georgia', serif;
}
h1 { 
    text-align: center;
    font-size: 3rem;
    text-shadow: 0 0 20px #b794f6, 0 0 30px #9370db;
    animation: glow 2s ease-in-out infinite;
    margin: 1rem 0;
}
h2 { 
    text-align: center;
    font-size: 1.8rem;
    color: #ffd700;
    text-shadow: 0 0 10px #ffa500;
    font-style: italic;
    margin-bottom: 2rem;
}
h3 {
    color: #ffd700;
    font-size: 2rem;
    text-shadow: 0 0 10px #ff8c00;
    margin: 1.5rem 0 1rem 0;
    border-bottom: 2px solid #9370db;
    padding-bottom: 0.5rem;
    text-align: center;
}
.container {
    max-width: 900px; 
    margin: 2rem auto; 
    background: rgba(30, 10, 60, 0.7);
    border: 3px solid #9370db;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 0 30px #9370db, 0 0 60px rgba(147, 112, 219, 0.3);
    backdrop-filter: blur(10px);
}
header {
    text-align: center;
    margin-bottom: 2rem;
}
header img {
    max-width: 300px;
    border-radius: 50%;
    border: 4px solid #ffd700;
    box-shadow: 0 0 20px #ffd700, 0 0 40px #ff8c00;
    margin-bottom: 1rem;
    animation: float 3s ease-in-out infinite;
}
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}
main {
    background: rgba(20, 5, 40, 0.5);
    padding: 2rem;
    border-radius: 15px;
    border: 2px solid #6a4c93;
}
main p {
    color: #e6d5ff;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 1.2rem;
}
.membership-info, .top-books, .top-anime, .top-comics, .digital-media, .hours-of-operation, .contact-information {
    background: rgba(50, 20, 80, 0.4);
    padding: 1.5rem;
    margin: 1.5rem 0;
    border-radius: 10px;
    border: 1px solid #8a5fd1;
    transition: all 0.3s ease;
}
.membership-info:hover, .top-books:hover, .top-anime:hover, .top-comics:hover, .digital-media:hover, 
.hours-of-operation:hover, .contact-information:hover {
    background: rgba(70, 30, 100, 0.6);
    box-shadow: 0 0 20px #9370db;
    transform: translateY(-5px);
}
ul {
    list-style: none;
    padding-left: 1rem;
    color: #d4bbff;
    line-height: 2;
}
ul::before {
    content: '⭐ ';
}
main a {
    color: #ffd700;
    text-decoration: none;
    transition: all 0.3s;
}
main a:hover {
    color: #ffed4e;
    text-shadow: 0 0 10px #ffd700;
    text-decoration: underline;
}
</style>
</head>
<body>
<div class="container">
<header>
<img src="wizardcatlogo.png" alt="cat wizard reading a book surrounded by books."/>
<h1>In-N-Out Books</h1>
<h2>⭐ Your Magical Gateway to Great Reads ⭐</h2>
</header>
<br />
<main>
<p>Welcome to the In-N-Out Books App! Explore our collection of books, Anime, Comics, and digital media to find your next favorite read. We at In-N-Out Books have made the pleasant journey to find all the best stories for our adventurers to enjoy. Come visit us at our Little Nook which houses many interesting titles and also serves delightfully fresh beverages, tasty snacks and desirable pastries. Also visit our digital store to check out thousands of amazing titles and become immersed in our vast digital collection.</p>
<div class="membership-info">
<h3>Membership Information</h3>
<p>Join our In-N-Out Books Guild today and unlock exclusive benefits that are sure to get you quite cozy! As a guild member, you unlock access to our special shipping experience, "The Cozy Bundle" - a specially handpicked selection of books, snacks, pastries, and beverages delivered right to your door. Enjoy members-only discounts, early access to new releases, and invitations to exclusive events at the Little Nook. Sign up today and start your magical reading adventure with us!</p>
</div>
<div class="top-books">
<h3>Top Selling Books</h3>
<ul>Harry Potter Series by J.K. Rowling</ul>
<ul>The Lord of the Rings by J.R.R. Tolkien</ul>
<ul>To Kill a Mockingbird by Harper Lee</ul>
</div>
<div class="top-anime">
<h3>Top Selling Anime</h3>
<ul>Naruto by Masashi Kishimoto</ul>
<ul>Attack on Titan by Hajime Isayama</ul>
<ul>My Hero Academia by Kohei Horikoshi</ul>
</div>
<div class="top-comics">
<h3>Top Selling Comics</h3>
<ul>Batman by DC Comics</ul>
<ul>Spider-Man by Marvel Comics</ul>
<ul>The Walking Dead by Robert Kirkman</ul>
</div>
<div class="digital-media">
<h3>Top Digital Media</h3>
<ul>Kindle E-books</ul>
<ul>Audiobooks</ul>
<ul>Graphic Novels</ul>
</div>
<br />
<div class="hours-of-operation">
<h3>Hours of Operation</h3>
<p>Monday - Friday: 9:00 AM - 8:00 PM<br>Saturday: 10:00 AM - 6:00 PM<br>Sunday: 11:00 AM - 5:00 PM<br> Online Hours: Anytime</p>
</div>
<div class="contact-information">
<h3>Contact Information</h3>
<p>Email: info@innoutbooks.com<br>Phone: (123) 456-7890<br>Address: 123 Book St, Reading City, 45678</p>
</div>
</main>
</div>
</body>
</html>
`; // end HTML content for the landing page

res.send(html); // Send the HTML content to the client
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
