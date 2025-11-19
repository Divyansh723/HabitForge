import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User, Notification } from '../models/index.js';
import { formatInTimeZone } from 'date-fns-tz';

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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${colors.bright}━━━ ${msg} ━━━${colors.reset}\n`)
};

async function verifyNotificationDisplay() {
  try {
    log.section('NOTIFICATION DISPLAY VERIFICATION');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    log.success('Connected to MongoDB');

    // Get all users
    const users = await User.find({ isActive: true, softDeleted: false });
    log.info(`Found ${users.length} active users`);

    for (const user of users) {
      log.section(`User: ${user.email} (${user.name})`);
      log.info(`Timezone: ${user.timezone || 'UTC'}`);
      
      // Get user's notifications
      const notifications = await Notification.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(10);
      
      log.info(`Total notifications: ${notifications.length}`);
      
      if (notifications.length === 0) {
        log.warning('No notifications found for this user');
        continue;
      }

      // Count by type
      const notificationsByType = {};
      notifications.forEach(n => {
        notificationsByType[n.type] = (notificationsByType[n.type] || 0) + 1;
      });

      log.info('Notifications by type:');
      Object.entries(notificationsByType).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });

      // Count read vs unread
      const unreadCount = notifications.filter(n => !n.read).length;
      const readCount = notifications.filter(n => n.read).length;
      log.info(`Read: ${readCount}, Unread: ${unreadCount}`);

      // Show recent notifications with timezone-aware timestamps
      log.info('\nRecent notifications:');
      notifications.slice(0, 5).forEach((n, index) => {
        const userTimezone = user.timezone || 'UTC';
        const localTime = formatInTimeZone(n.createdAt, userTimezone, 'MMM dd, yyyy HH:mm:ss');
        const status = n.read ? '✓ Read' : '○ Unread';
        
        console.log(`\n  ${index + 1}. ${colors.magenta}${n.type}${colors.reset} ${status}`);
        console.log(`     Title: ${n.title}`);
        console.log(`     Message: ${n.message.substring(0, 80)}${n.message.length > 80 ? '...' : ''}`);
        console.log(`     Created: ${localTime} (${userTimezone})`);
        if (n.metadata && Object.keys(n.metadata).length > 0) {
          console.log(`     Metadata: ${JSON.stringify(n.metadata)}`);
        }
      });

      // Check for notifications created in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentNotifications = await Notification.find({
        userId: user._id,
        createdAt: { $gte: oneHourAgo }
      });

      if (recentNotifications.length > 0) {
        log.success(`\n${recentNotifications.length} notification(s) created in the last hour`);
        recentNotifications.forEach(n => {
          const userTimezone = user.timezone || 'UTC';
          const localTime = formatInTimeZone(n.createdAt, userTimezone, 'HH:mm:ss');
          console.log(`  - ${n.type}: "${n.title}" at ${localTime}`);
        });
      } else {
        log.info('\nNo notifications created in the last hour');
      }

      // Check notification preferences
      const prefs = user.notificationPreferences || {};
      log.info('\nNotification Preferences:');
      console.log(`  - In-App Enabled: ${prefs.inApp !== false ? 'Yes' : 'No'}`);
      console.log(`  - Habit Reminders: ${prefs.habitReminders !== false ? 'Yes' : 'No'}`);
      console.log(`  - Daily Summary: ${prefs.dailySummary !== false ? 'Yes' : 'No'}`);
      console.log(`  - Weekly Insights: ${prefs.weeklyInsights !== false ? 'Yes' : 'No'}`);
      console.log(`  - Streak Milestones: ${prefs.streakMilestones !== false ? 'Yes' : 'No'}`);
      console.log(`  - Challenge Updates: ${prefs.challengeUpdates !== false ? 'Yes' : 'No'}`);
      console.log(`  - Community Activity: ${prefs.communityActivity !== false ? 'Yes' : 'No'}`);
      console.log(`  - Tips & Tricks: ${prefs.tipsAndTricks !== false ? 'Yes' : 'No'}`);
      console.log(`  - System Updates: ${prefs.systemUpdates !== false ? 'Yes' : 'No'}`);
      
      if (prefs.quietHours?.enabled) {
        console.log(`  - Quiet Hours: ${prefs.quietHours.start} - ${prefs.quietHours.end}`);
        
        // Check if currently in quiet hours
        const now = new Date();
        const userTimezone = user.timezone || 'UTC';
        const zonedNow = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
        const currentHour = zonedNow.getHours();
        const currentMinute = zonedNow.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        const [startHour, startMinute] = prefs.quietHours.start.split(':').map(Number);
        const [endHour, endMinute] = prefs.quietHours.end.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        let isInQuietHours = false;
        if (startTime > endTime) {
          // Overnight quiet hours
          isInQuietHours = currentTime >= startTime || currentTime <= endTime;
        } else {
          isInQuietHours = currentTime >= startTime && currentTime <= endTime;
        }

        if (isInQuietHours) {
          log.warning('  ⚠ Currently in quiet hours - notifications suppressed');
        } else {
          log.success('  ✓ Not in quiet hours - notifications active');
        }
      } else {
        console.log(`  - Quiet Hours: Disabled`);
      }
    }

    // Overall statistics
    log.section('OVERALL STATISTICS');
    const totalNotifications = await Notification.countDocuments();
    const totalUnread = await Notification.countDocuments({ read: false });
    const totalRead = await Notification.countDocuments({ read: true });
    
    log.info(`Total notifications: ${totalNotifications}`);
    log.info(`Unread: ${totalUnread} (${((totalUnread / totalNotifications) * 100).toFixed(1)}%)`);
    log.info(`Read: ${totalRead} (${((totalRead / totalNotifications) * 100).toFixed(1)}%)`);

    // Notifications by type (all users)
    const allNotificationsByType = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    log.info('\nNotifications by type (all users):');
    allNotificationsByType.forEach(({ _id, count }) => {
      const percentage = ((count / totalNotifications) * 100).toFixed(1);
      console.log(`  - ${_id}: ${count} (${percentage}%)`);
    });

    // Notifications created today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayNotifications = await Notification.countDocuments({
      createdAt: { $gte: todayStart }
    });

    log.info(`\nNotifications created today: ${todayNotifications}`);

    // Check if notifications are being created regularly
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentNotifications = await Notification.countDocuments({
      createdAt: { $gte: last24Hours }
    });

    log.info(`Notifications created in last 24 hours: ${recentNotifications}`);

    if (recentNotifications === 0) {
      log.warning('\n⚠ No notifications created in the last 24 hours!');
      log.info('This might indicate:');
      console.log('  1. Notification scheduler is not running');
      console.log('  2. All users have notifications disabled');
      console.log('  3. No events triggered notifications');
      console.log('  4. All users are in quiet hours');
    } else {
      log.success('\n✓ Notifications are being created regularly');
    }

    log.section('VERIFICATION COMPLETED');
    log.success('Notification display verification complete!');
    log.info('\nTo view notifications in the app:');
    console.log('  1. Open http://localhost:3002');
    console.log('  2. Log in with a test user');
    console.log('  3. Click the notification bell icon');
    console.log('  4. Or navigate to /notifications page');

    process.exit(0);
  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run verification
verifyNotificationDisplay();
