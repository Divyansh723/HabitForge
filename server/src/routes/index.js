import express from 'express';
import authRoutes from './auth.js';
import habitRoutes from './habits.js';
import gamificationRoutes from './gamification.js';
import wellbeingRoutes from './wellbeing.js';
import analyticsRoutes from './analytics.js';
import aiRoutes from './ai.js';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/habits', habitRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/wellbeing', wellbeingRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'HabitForge API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HabitForge API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
        profile: 'PATCH /api/auth/profile',
        changePassword: 'POST /api/auth/change-password'
      },
      habits: {
        list: 'GET /api/habits',
        create: 'POST /api/habits',
        get: 'GET /api/habits/:id',
        update: 'PATCH /api/habits/:id',
        delete: 'DELETE /api/habits/:id',
        complete: 'POST /api/habits/:id/complete',
        stats: 'GET /api/habits/:id/stats',
        completions: 'GET /api/habits/:id/completions',
        todayCompletions: 'GET /api/habits/completions/today'
      },
      gamification: {
        data: 'GET /api/gamification/data',
        addXP: 'POST /api/gamification/xp',
        forgiveness: 'POST /api/gamification/forgiveness',
        xpHistory: 'GET /api/gamification/xp/history'
      },
      wellbeing: {
        createMoodEntry: 'POST /api/wellbeing/mood-entries',
        getMoodEntries: 'GET /api/wellbeing/mood-entries',
        wellbeingScore: 'GET /api/wellbeing/score',
        habitImpact: 'GET /api/wellbeing/habit-impact',
        insights: 'GET /api/wellbeing/insights'
      },
      analytics: {
        overview: 'GET /api/analytics/overview',
        trends: 'GET /api/analytics/trends',
        weeklySummary: 'GET /api/analytics/weekly-summary'
      },
      ai: {
        insights: 'GET /api/ai/insights',
        suggestions: 'POST /api/ai/suggestions',
        patterns: 'GET /api/ai/patterns/:habitId',
        motivation: 'GET /api/ai/motivation',
        moodCorrelation: 'GET /api/ai/mood-correlation',
        coaching: 'POST /api/ai/coaching',
        optimize: 'GET /api/ai/optimize/:habitId'
      }
    }
  });
});

export default router;