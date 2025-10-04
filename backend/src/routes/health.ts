import express, { type Request, type Response } from 'express';

//Health check
const getHealthStatus = (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

// Detailed health check
const getDetailedHealthStatus = (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
};

// Export the methods for use in other files
export const healthMethods = {
  getHealthStatus,
  getDetailedHealthStatus
};
