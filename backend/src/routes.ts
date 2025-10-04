import express, { type Request, type Response } from 'express';
import { murliMethods } from './routes/murli.js';
import { healthMethods } from './routes/health.js';

const router = express.Router();

// Health check routes
router.get('/health', healthMethods.getHealthStatus);
router.get('/health/detailed', healthMethods.getDetailedHealthStatus);

// System and User-Agent testing routes
router.get('/system/status', murliMethods.getSystemStatus);
router.get('/system/test-user-agent', murliMethods.testUserAgent);

// Language routes
router.get('/languages/available', murliMethods.getAvailableLanguages);

// Murli routes
router.get('/', murliMethods.getMurliData);
router.post('/', murliMethods.getMurliDataPost);
router.get('/:date', murliMethods.getMurliByDate);

// router.get('/murli/search/:query', murliMethods.searchMurlis);

export default router;
