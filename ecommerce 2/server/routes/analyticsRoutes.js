import express from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, requireAdmin, getDashboardAnalytics);

export default router;

