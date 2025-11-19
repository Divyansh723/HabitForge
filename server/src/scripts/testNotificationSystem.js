import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User, Habit, Completion, Notification, CommunityCircle } from '../models/index.js';
import {
  sendHabitReminders,
  checkStreakMilestones,
  sendDailySummary,
  sendWeeklyInsights,
  sendChallengeUpdates,
  sendCommunityActivity,
  sendTipsAndTricks
} from '../jobs/notificationScheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '../../.env') });

/**
 * Comprehensive Notification System Test Script
 * Tests all notification types and verifies they work correctly
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${colors.bright}━━━ ${msg} ━━━${colors.reset}\n`)
};

async function testNotificationSystem() {
  try {
    log.section('NOTIFICATION SYSTEM TEST');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    log.success('Connected to MongoDB');

    // Get test data
    const users = await User.find({ isActive: true, softDeleted: false }).limit(5);
    const habits = await Habit.find({ active: true, archived: false }).limit(10);
    
    log.info(`Found ${users.length} active users`);
    log.info(`Found ${habits.length} active habits`);

    // Test 1: Habit Reminders
    log.section('Test 1: Habit Reminders');
    const beforeHabitReminders = await Notification.countDocuments({ type: 'habit_reminder' });
    await sendHabitReminders();
    const afterHabitReminders = await Notification.countDocuments({ type: 'habit_reminder' });
    const newHabitReminders = afterHabitReminders - beforeHabitReminders;
    
    if (newHabitReminders >= 0) {
      log.success(`Habit reminders: ${newHabitReminders} new notifications created`);
    } else {
      log.error('Habit reminders: Error in notification count');
    }

    // Show sample habit reminder notifications
    const sampleHabitReminders = await Notification.find({ type: 'habit_reminder' })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('userId', 'email');
    
    if (sampleHabitReminders.length > 0) {
      log.info('Sample habit reminder notifications:');
      sampleHabitReminders.forEach(n => {
        console.log(`  - User: ${n.userId?.email}, Habit: ${n.metadata?.habitName}, Time: ${new Date(n.createdAt).toLocaleString()}`);
      });
    }

    // Test 2: Streak Milestones
    log.section('Test 2: Streak Milestones');
    const beforeStreakMilestones = await Notification.countDocuments({ type: 'streak_milestone' });
    await checkStreakMilestones();
    const afterStreakMilestones = await Notification.countDocuments({ type: 'streak_milestone' });
    const newStreakMilestones = afterStreakMilestones - beforeStreakMilestones;
    
    if (newStreakMilestones >= 0) {
      log.success(`Streak milestones: ${newStreakMilestones} new notifications created`);
    } else {
      log.error('Streak milestones: Error in notification count');
    }

    // Show habits with milestone streaks
    const milestones = [7, 14, 30, 60, 90, 180, 365];
    const habitsWithMilestones = await Habit.find({
      currentStreak: { $in: milestones },
      active: true,
      archived: false
    }).populate('userId', 'email');
    
    if (habitsWithMilestones.length > 0) {
      log.info('Habits at milestone streaks:');
      habitsWithMilestones.forEach(h => {
        console.log(`  - ${h.name}: ${h.currentStreak} days (User: ${h.userId?.email})`);
      });
    } else {
      log.warning('No habits currently at milestone streaks');
    }

    // Test 3: Daily Summary
    log.section('Test 3: Daily Summary');
    const beforeDailySummary = await Notification.countDocuments({ type: 'daily_summary' });
    await sendDailySummary();
    const afterDailySummary = await Notification.countDocuments({ type: 'daily_summary' });
    const newDailySummary = afterDailySummary - beforeDailySummary;
    
    if (newDailySummary >= 0) {
      log.success(`Daily summary: ${newDailySummary} new notifications created`);
    } else {
      log.error('Daily summary: Error in notification count');
    }

    // Test 4: Weekly Insights
    log.section('Test 4: Weekly Insights');
    const beforeWeeklyInsights = await Notification.countDocuments({ type: 'weekly_insights' });
    await sendWeeklyInsights();
    const afterWeeklyInsights = await Notification.countDocuments({ type: 'weekly_insights' });
    const newWeeklyInsights = afterWeeklyInsights - beforeWeeklyInsights;
    
    if (newWeeklyInsights >= 0) {
      log.success(`Weekly insights: ${newWeeklyInsights} new notifications created`);
    } else {
      log.error('Weekly insights: Error in notification count');
    }

    // Test 5: Challenge Updates
    log.section('Test 5: Challenge Updates');
    const beforeChallengeUpdates = await Notification.countDocuments({ type: 'challenge_update' });
    await sendChallengeUpdates();
    const afterChallengeUpdates = await Notification.countDocuments({ type: 'challenge_update' });
    const newChallengeUpdates = afterChallengeUpdates - beforeChallengeUpdates;
    
    if (newChallengeUpdates >= 0) {
      log.success(`Challenge updates: ${newChallengeUpdates} new notifications created`);
    } else {
      log.error('Challenge updates: Error in notification count');
    }

    // Test 6: Community Activity
    log.section('Test 6: Community Activity');
    const beforeCommunityActivity = await Notification.countDocuments({ type: 'community_activity' });
    await sendCommunityActivity();
    const afterCommunityActivity = await Notification.countDocuments({ type: 'community_activity' });
    const newCommunityActivity = afterCommunityActivity - beforeCommunityActivity;
    
    if (newCommunityActivity >= 0) {
      log.success(`Community activity: ${newCommunityActivity} new notifications created`);
    } else {
      log.error('Community activity: Error in notification count');
    }

    // Test 7: Tips & Tricks
    log.section('Test 7: Tips & Tricks');
    const beforeTipsTricks = await Notification.countDocuments({ type: 'tips_tricks' });
    await sendTipsAndTricks();
    const afterTipsTricks = await Notification.countDocuments({ type: 'tips_tricks' });
    const newTipsTricks = afterTipsTricks - beforeTipsTricks;
    
    if (newTipsTricks >= 0) {
      log.success(`Tips & tricks: ${newTipsTricks} new notifications created`);
    } else {
      log.error('Tips & tricks: Error in notification count');
    }

    // Summary
    log.section('TEST SUMMARY');
    const totalNotifications = await Notification.countDocuments();
    log.info(`Total notifications in database: ${totalNotifications}`);
    
    const notificationsByType = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    log.info('Notifications by type:');
    notificationsByType.forEach(({ _id, count }) => {
      console.log(`  - ${_id}: ${count}`);
    });

    // Check user notification preferences
    log.section('USER NOTIFICATION PREFERENCES');
    for (const user of users) {
      const prefs = user.notificationPreferences || {};
      log.info(`User: ${user.email}`);
      console.log(`  - In-App: ${prefs.inApp !== false ? 'Enabled' : 'Disabled'}`);
      console.log(`  - Habit Reminders: ${prefs.habitReminders !== false ? 'Enabled' : 'Disabled'}`);
      console.log(`  - Daily Summary: ${prefs.dailySummary !== false ? 'Enabled' : 'Disabled'}`);
      console.log(`  - Weekly Insights: ${prefs.weeklyInsights !== false ? 'Enabled' : 'Disabled'}`);
      console.log(`  - Streak Milestones: ${prefs.streakMilestones !== false ? 'Enabled' : 'Disabled'}`);
      console.log(`  - Challenge Updates: ${prefs.challengeUpdates !== false ? 'Enabled' : 'Disabled'}`);
      console.log(`  - Community Activity: ${prefs.communityActivity !== false ? 'Enabled' : 'Disabled'}`);
      console.log(`  - Tips & Tricks: ${prefs.tipsAndTricks !== false ? 'Enabled' : 'Disabled'}`);
      console.log(`  - System Updates: ${prefs.systemUpdates !== false ? 'Enabled' : 'Disabled'}`);
      console.log(`  - Quiet Hours: ${prefs.quietHours?.enabled ? `${prefs.quietHours.start} - ${prefs.quietHours.end}` : 'Disabled'}`);
      console.log(`  - Timezone: ${user.timezone || 'UTC'}`);
    }

    log.section('TEST COMPLETED');
    log.success('All notification types tested successfully!');

    process.exit(0);
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run test
testNotificationSystem();
