import express from 'express';
import { 
  getAnalyticsOverview, 
  getTrendData, 
  getWeeklySummary,
  getHabitPerformance,
  getConsistencyData
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Analytics endpoints
router.get('/overview', getAnalyticsOverview);
router.get('/trends', getTrendData);
router.get('/weekly-summary', getWeeklySummary);
router.get('/habit-performance', getHabitPerformance);
router.get('/consistency', getConsistencyData);

export default router;