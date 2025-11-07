import express from 'express';
import {
  getHabitInsights,
  getHabitSuggestions,
  analyzeHabitPatterns,
  getMotivationalContent,
  getMoodHabitCorrelation,
  getPersonalizedCoaching,
  getHabitOptimization,
  getAIStatus
} from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// All AI routes require authentication
router.use(authenticate);

// Comprehensive habit insights
router.get('/insights', getHabitInsights);

// Smart habit suggestions
router.post('/suggestions', getHabitSuggestions);

// Habit pattern analysis
router.get('/patterns/:habitId', validateObjectId('habitId'), analyzeHabitPatterns);

// Motivational content
router.get('/motivation', getMotivationalContent);

// Mood-habit correlation analysis
router.get('/mood-correlation', getMoodHabitCorrelation);

// Personalized coaching
router.post('/coaching', getPersonalizedCoaching);

// Habit optimization recommendations
router.get('/optimize/:habitId', validateObjectId('habitId'), getHabitOptimization);

// AI service status
router.get('/status', getAIStatus);

export default router;