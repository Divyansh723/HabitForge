import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User, Habit, Completion } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '../../.env') });

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

async function testForgivenessTokenSecurity() {
  try {
    log.section('FORGIVENESS TOKEN SECURITY TEST');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    log.success('Connected to MongoDB');

    // Get test users
    const users = await User.find({ isActive: true, softDeleted: false }).limit(5);
    log.info(`Found ${users.length} active users`);

    for (const user of users) {
      log.section(`Testing User: ${user.email}`);
      log.info(`Forgiveness Tokens: ${user.forgivenessTokens}/3`);
      log.info(`Timezone: ${user.timezone || 'UTC'}`);

      // Get user's habits
      const habits = await Habit.find({ userId: user._id, active: true, archived: false });
      log.info(`Active Habits: ${habits.length}`);

      if (habits.length === 0) {
        log.warning('No habits found for this user');
        continue;
      }

      // Test 1: Check forgiveness usage in last 7 days
      log.info('\n📊 Forgiveness Usage Analysis:');
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const forgivenessCompletions = await Completion.find({
        userId: user._id,
        forgivenessUsed: true,
        completedAt: { $gte: sevenDaysAgo }
      }).populate('habitId', 'name');

      if (forgivenessCompletions.length > 0) {
        log.info(`  Total forgiveness used (last 7 days): ${forgivenessCompletions.length}`);
        forgivenessCompletions.forEach(c => {
          const daysLate = c.metadata?.daysLate || 'unknown';
          const habitName = c.habitId?.name || 'Unknown habit';
          console.log(`    - ${habitName}: ${new Date(c.completedAt).toLocaleDateString()} (${daysLate} days late)`);
        });
      } else {
        log.info('  No forgiveness tokens used in last 7 days');
      }

      // Test 2: Check today's forgiveness usage (rate limiting)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayForgivenessCount = await Completion.countDocuments({
        userId: user._id,
        forgivenessUsed: true,
        createdAt: { $gte: todayStart, $lte: todayEnd }
      });

      log.info(`\n🚦 Rate Limiting:`);
      log.info(`  Forgiveness used today: ${todayForgivenessCount}/3`);
      if (todayForgivenessCount >= 3) {
        log.warning('  ⚠ Daily limit reached!');
      } else {
        log.success(`  ✓ ${3 - todayForgivenessCount} forgiveness tokens available today`);
      }

      // Test 3: Check for suspicious patterns
      log.info(`\n🔍 Security Analysis:`);
      
      // Check for forgiveness on consecutive days (potential abuse)
      const allForgivenessCompletions = await Completion.find({
        userId: user._id,
        forgivenessUsed: true
      }).sort({ completedAt: -1 }).limit(10);

      if (allForgivenessCompletions.length >= 3) {
        const dates = allForgivenessCompletions.map(c => new Date(c.completedAt).toDateString());
        const uniqueDates = new Set(dates);
        
        if (dates.length - uniqueDates.size > 0) {
          log.warning(`  ⚠ Multiple forgiveness tokens used on same date detected`);
        }

        // Check for consecutive days
        let consecutiveDays = 0;
        for (let i = 0; i < allForgivenessCompletions.length - 1; i++) {
          const date1 = new Date(allForgivenessCompletions[i].completedAt);
          const date2 = new Date(allForgivenessCompletions[i + 1].completedAt);
          const daysDiff = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= 1) {
            consecutiveDays++;
          }
        }

        if (consecutiveDays >= 3) {
          log.warning(`  ⚠ Forgiveness used on ${consecutiveDays} consecutive days - possible abuse pattern`);
        } else {
          log.success('  ✓ No suspicious consecutive usage detected');
        }
      } else {
        log.success('  ✓ Insufficient data for pattern analysis');
      }

      // Test 4: Check automatic forgiveness eligibility
      log.info(`\n🛡️ Automatic Forgiveness Eligibility:`);
      
      const autoForgivenessEnabled = user.notificationPreferences?.autoForgiveness !== false;
      log.info(`  Auto-forgiveness enabled: ${autoForgivenessEnabled ? 'Yes' : 'No'}`);
      
      if (user.forgivenessTokens > 0 && autoForgivenessEnabled) {
        const habitsWithStreaks = habits.filter(h => h.currentStreak > 0);
        log.info(`  Habits with active streaks: ${habitsWithStreaks.length}`);
        
        if (habitsWithStreaks.length > 0) {
          log.success(`  ✓ Eligible for automatic forgiveness`);
          log.info(`  Longest streak: ${Math.max(...habitsWithStreaks.map(h => h.currentStreak))} days`);
        } else {
          log.warning('  No habits with active streaks to protect');
        }
      } else {
        if (!autoForgivenessEnabled) {
          log.info('  Auto-forgiveness disabled by user');
        } else {
          log.warning('  No forgiveness tokens available');
        }
      }

      // Test 5: Validate forgiveness completions integrity
      log.info(`\n🔐 Data Integrity Check:`);
      
      const invalidForgivenessCompletions = await Completion.find({
        userId: user._id,
        forgivenessUsed: true,
        $or: [
          { xpEarned: { $ne: 5 } }, // Should always be 5 XP
          { editedFlag: { $ne: true } } // Should always be marked as edited
        ]
      });

      if (invalidForgivenessCompletions.length > 0) {
        log.error(`  ✗ Found ${invalidForgivenessCompletions.length} invalid forgiveness completions`);
      } else {
        log.success('  ✓ All forgiveness completions have correct XP and flags');
      }

      // Check for future-dated forgiveness (should never happen)
      const now = new Date();
      const futureForgivenessCompletions = await Completion.find({
        userId: user._id,
        forgivenessUsed: true,
        completedAt: { $gt: now }
      });

      if (futureForgivenessCompletions.length > 0) {
        log.error(`  ✗ CRITICAL: Found ${futureForgivenessCompletions.length} future-dated forgiveness completions!`);
      } else {
        log.success('  ✓ No future-dated forgiveness completions');
      }

      // Check for very old forgiveness (beyond 7-day window)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const oldForgivenessCompletions = await Completion.find({
        userId: user._id,
        forgivenessUsed: true,
        completedAt: { $lt: thirtyDaysAgo },
        createdAt: { $gte: thirtyDaysAgo } // Created recently but for old date
      });

      if (oldForgivenessCompletions.length > 0) {
        log.warning(`  ⚠ Found ${oldForgivenessCompletions.length} forgiveness completions for dates >30 days old`);
      } else {
        log.success('  ✓ No suspicious old-dated forgiveness completions');
      }
    }

    // Overall statistics
    log.section('OVERALL STATISTICS');
    
    const totalUsers = await User.countDocuments({ isActive: true, softDeleted: false });
    const usersWithTokens = await User.countDocuments({ 
      isActive: true, 
      softDeleted: false,
      forgivenessTokens: { $gt: 0 }
    });
    const usersWithMaxTokens = await User.countDocuments({ 
      isActive: true, 
      softDeleted: false,
      forgivenessTokens: 3
    });

    log.info(`Total active users: ${totalUsers}`);
    log.info(`Users with forgiveness tokens: ${usersWithTokens} (${((usersWithTokens/totalUsers)*100).toFixed(1)}%)`);
    log.info(`Users with max tokens (3): ${usersWithMaxTokens} (${((usersWithMaxTokens/totalUsers)*100).toFixed(1)}%)`);

    const totalForgivenessCompletions = await Completion.countDocuments({ forgivenessUsed: true });
    const totalCompletions = await Completion.countDocuments();
    
    log.info(`\nTotal completions: ${totalCompletions}`);
    log.info(`Forgiveness completions: ${totalForgivenessCompletions} (${((totalForgivenessCompletions/totalCompletions)*100).toFixed(1)}%)`);

    // Forgiveness usage by time period
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const forgiveness24h = await Completion.countDocuments({ 
      forgivenessUsed: true,
      createdAt: { $gte: last24Hours }
    });
    const forgiveness7d = await Completion.countDocuments({ 
      forgivenessUsed: true,
      createdAt: { $gte: last7Days }
    });
    const forgiveness30d = await Completion.countDocuments({ 
      forgivenessUsed: true,
      createdAt: { $gte: last30Days }
    });

    log.info(`\nForgiveness usage:`);
    log.info(`  Last 24 hours: ${forgiveness24h}`);
    log.info(`  Last 7 days: ${forgiveness7d}`);
    log.info(`  Last 30 days: ${forgiveness30d}`);

    // Security recommendations
    log.section('SECURITY RECOMMENDATIONS');
    
    const recommendations = [];
    
    if (forgiveness24h > totalUsers * 2) {
      recommendations.push('⚠ High forgiveness usage detected - consider reviewing user behavior');
    }
    
    const avgTokensPerUser = usersWithTokens > 0 
      ? (await User.aggregate([
          { $match: { isActive: true, softDeleted: false } },
          { $group: { _id: null, avgTokens: { $avg: '$forgivenessTokens' } } }
        ]))[0]?.avgTokens || 0
      : 0;
    
    if (avgTokensPerUser < 1) {
      recommendations.push('ℹ Users are actively using forgiveness tokens - system is working as intended');
    }
    
    if (recommendations.length > 0) {
      recommendations.forEach(r => console.log(`  ${r}`));
    } else {
      log.success('  ✓ No security concerns detected');
    }

    log.section('TEST COMPLETED');
    log.success('Forgiveness token security test complete!');

    process.exit(0);
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run test
testForgivenessTokenSecurity();
