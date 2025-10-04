// Import required modules directly (avoiding circular dependency)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import your route handlers directly
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'date', 'language'],
  optionsSuccessStatus: 200
};

const serverless = require('serverless-http');

// Import the Express app
const app = require('../../dist/index.js').default;

// Export the handler for Netlify
exports.handler = serverless(app, {
  binary: false
});