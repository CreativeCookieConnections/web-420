/**
 * Author: Professor Krasso
 * Date: 4/1/2024
 * File Name: app.js
 * Description: Main application file for cookbook
 */

'use strict';

const express = require('express');
const createError = require('http-errors');
const mongoose = require('mongoose');

const app = express();

// MongoDB Atlas connection string
const CONN = 'mongodb+srv://web335_user:s3cret@bellevueuniversity.bfy9zvm.mongodb.net/web420DB?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(CONN)
  .then(() => {
    console.log('Connection to MongoDB Atlas successful');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the cookbook API' });
});

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  });
});

module.exports = app;
