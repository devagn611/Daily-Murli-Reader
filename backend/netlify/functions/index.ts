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

// Netlify Function handler
export const handler = async (event: any, context: any) => {
  // Set longer timeout context
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const { httpMethod, path, queryStringParameters, body, headers } = event;
    
    // Handle CORS preflight
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, date, language',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Max-Age': '86400'
        },
        body: ''
      };
    }
    
    // Route handling - simplified for Netlify Functions
    if (path.includes('/murli/health')) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*'
        },
        body: JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'production',
          uptime: process.uptime()
        })
      };
    }
    
    // Default response for unhandled routes
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*'
      },
      body: JSON.stringify({
        error: 'Route not found',
        message: `The requested route ${path} does not exist`,
        method: httpMethod,
        timestamp: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Something went wrong with the serverless function',
        timestamp: new Date().toISOString()
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      }
    };
  }
};