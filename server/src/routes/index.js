import express from 'express';
import authRoutes from './auth.js';
import habitRoutes from './habits.js';
import gamificationRoutes from './gamification.js';
import wellbeingRoutes from './wellbeing.js';
import analyticsRoutes from './analytics.js';
import aiRoutes from './ai.js';
import communityRoutes from './community.js';
import challengeRoutes from './challenges.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/habits', habitRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/wellbeing', wellbeingRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/community', communityRoutes);
router.use('/challenges', challengeRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HabitForge API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      habits: '/api/habits',
      gamification: '/api/gamification',
      wellbeing: '/api/wellbeing',
      analytics: '/api/analytics',
      ai: '/api/ai',
      community: '/api/community',
      challenges: '/api/challenges'
    }
  });
});

export default router;
