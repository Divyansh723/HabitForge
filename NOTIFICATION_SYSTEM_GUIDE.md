# Notification System Guide

## Overview

HabitForge has a comprehensive notification system that sends various types of notifications to keep users engaged and informed. All notifications respect user preferences, quiet hours, and timezone settings.

## Notification Types

### 1. **Habit Reminders** 🎯
- **Trigger**: Every minute (checks if current time matches habit reminder time)
- **Condition**: Habit has `reminderEnabled: true` and `reminderTime` set
- **Logic**: Only sends if habit is not completed today
- **Preference**: `habitReminders`
- **Example**: "🎯 Time for your habit! Don't forget to complete 'Morning Exercise' today!"

### 2. **Streak Milestones** 🔥
- **Trigger**: Every hour
- **Milestones**: 7, 14, 30, 60, 90, 180, 365 days
- **Condition**: Habit's `currentStreak` matches a milestone
- **Logic**: Only sends once per milestone (checks for existing notification in last 24 hours)
- **Preference**: `streakMilestones`
- **Example**: "🔥 7-Day Streak! Amazing! You've maintained 'Morning Exercise' for 7 days straight!"

### 3. **Daily Summary** 📊
- **Trigger**: 9:00 PM (user's timezone)
- **Condition**: User has at least one habit
- **Logic**: Calculates completion rate for today
- **Preference**: `dailySummary`
- **Example**: "📊 Your Daily Summary - You completed 3 out of 5 habits today (60%). Keep it up!"

### 4. **Weekly Insights** 📈
- **Trigger**: Every Monday at 9:00 AM (user's timezone)
- **Condition**: User has at least one habit
- **Logic**: Calculates weekly completion rate and identifies best performing habit
- **Preference**: `weeklyInsights`
- **Example**: "📈 Your Weekly Insights - This week you completed 21 habits with a 60% completion rate. Your star habit was 'Morning Exercise' with 7 completions!"

### 5. **Challenge Updates** 🏆
- **Trigger**: 9:00 AM and 9:00 PM (user's timezone)
- **Condition**: User has active personal or community challenges
- **Logic**: Counts active challenges and calculates days remaining
- **Preference**: `challengeUpdates`
- **Example**: "🏆 Challenge Progress Update - You have 2 active challenge(s). 5 days left to complete your current challenge!"

### 6. **Community Activity** 👥
- **Trigger**: 9:00 AM and 9:00 PM (user's timezone)
- **Condition**: User is member of at least one circle
- **Logic**: Counts new messages, announcements, and members in last 24 hours
- **Preference**: `communityActivity`
- **Example**: "👥 Community Activity - Your community has been active! 5 new message(s), 1 new announcement(s)"

### 7. **Tips & Tricks** 💡
- **Trigger**: 9:00 AM and 9:00 PM (user's timezone)
- **Condition**: User has at least one habit
- **Logic**: Randomly selects a tip from predefined list
- **Preference**: `tipsAndTricks`
- **Example**: "💡 Tip of the Day - Start small! Building a habit is easier when you begin with just 2 minutes a day."

### 8. **System Updates** ⚙️
- **Trigger**: Manual (triggered by administrators)
- **Condition**: None (sent to all active users)
- **Logic**: Sends custom message to all users
- **Preference**: `systemUpdates`
- **Example**: "⚙️ New Feature - We've added timezone support! Update your timezone in settings."

## Notification Preferences

Users can control which notifications they receive through their notification preferences:

```javascript
{
  inApp: true,                    // Master switch for all notifications
  habitReminders: true,           // Habit reminder notifications
  streakMilestones: true,         // Streak milestone celebrations
  dailySummary: true,             // End-of-day summaries
  weeklyInsights: true,           // Weekly analytics
  challengeUpdates: true,         // Challenge progress updates
  communityActivity: true,        // Community activity updates
  tipsAndTricks: true,            // Helpful tips
  systemUpdates: true,            // System announcements
  quietHours: {
    enabled: true,
    start: "22:00",               // Quiet hours start time
    end: "08:00"                  // Quiet hours end time
  }
}
```

## Quiet Hours

When quiet hours are enabled, no notifications will be sent during the specified time period. The system correctly handles:
- **Same-day quiet hours**: e.g., 14:00 - 18:00
- **Overnight quiet hours**: e.g., 22:00 - 08:00 (crosses midnight)
- **Timezone-aware**: Quiet hours are calculated in user's local timezone

## Timezone Handling

All time-based notifications respect the user's timezone:

1. **Habit Reminders**: Checked every minute against user's local time
2. **Daily Summary**: Sent at 9:00 PM in user's local time
3. **Weekly Insights**: Sent at 9:00 AM on Monday in user's local time
4. **Challenge Updates**: Sent at 9:00 AM and 9:00 PM in user's local time
5. **Community Activity**: Sent at 9:00 AM and 9:00 PM in user's local time
6. **Tips & Tricks**: Sent at 9:00 AM and 9:00 PM in user's local time

## Cron Schedule

The notification scheduler uses the following cron schedules:

```javascript
// Habit reminders - Every minute
cron.schedule('* * * * *', sendHabitReminders);

// Streak milestones - Every hour
cron.schedule('0 * * * *', checkStreakMilestones);

// Daily summary - 9 PM every day
cron.schedule('0 21 * * *', sendDailySummary);

// Weekly insights - 9 AM every Monday
cron.schedule('0 9 * * 1', sendWeeklyInsights);

// Challenge updates - 9 AM and 9 PM
cron.schedule('0 9,21 * * *', sendChallengeUpdates);

// Community activity - 9 AM and 9 PM
cron.schedule('0 9,21 * * *', sendCommunityActivity);

// Tips & Tricks - 9 AM and 9 PM
cron.schedule('0 9,21 * * *', sendTipsAndTricks);

// Auto-forgiveness tokens - 11:50 PM every day
cron.schedule('50 23 * * *', autoUseForgivenessTokens);
```

## Testing

### Run Comprehensive Test

Test all notification types:

```bash
cd server
node src/scripts/testNotificationSystem.js
```

This will:
- Test each notification type
- Show how many notifications were created
- Display sample notifications
- Show user notification preferences
- Provide a summary of all notifications

### Manual Testing

To manually trigger specific notification types for testing:

1. **Habit Reminders**: Set a habit's `reminderTime` to current time + 1 minute
2. **Streak Milestones**: Manually set a habit's `currentStreak` to a milestone value (7, 14, 30, etc.)
3. **Daily Summary**: Wait until 9:00 PM or manually call `sendDailySummary()`
4. **Weekly Insights**: Wait until Monday 9:00 AM or manually call `sendWeeklyInsights()`
5. **Challenge Updates**: Create an active challenge and wait for 9:00 AM or 9:00 PM
6. **Community Activity**: Post messages in a circle and wait for 9:00 AM or 9:00 PM
7. **Tips & Tricks**: Wait for 9:00 AM or 9:00 PM or manually call `sendTipsAndTricks()`

## Troubleshooting

### Notifications Not Being Sent

1. **Check user preferences**: Ensure `inApp` is enabled and specific notification type is not disabled
2. **Check quiet hours**: Verify current time is not within user's quiet hours
3. **Check timezone**: Ensure user's timezone is set correctly
4. **Check habit settings**: For habit reminders, verify `reminderEnabled: true` and `reminderTime` is set
5. **Check logs**: Look for error messages in server logs

### Notifications Sent at Wrong Time

1. **Verify user timezone**: Check user's `timezone` field in database
2. **Check server timezone**: Ensure server is using UTC
3. **Verify cron schedule**: Ensure cron jobs are running correctly

### Duplicate Notifications

1. **Check for duplicate cron jobs**: Ensure scheduler is only initialized once
2. **Check milestone logic**: Streak milestones should only send once per milestone
3. **Review logs**: Look for multiple job executions

## Best Practices

1. **Always respect user preferences**: Check `hasNotificationEnabled()` before sending
2. **Always check quiet hours**: Use `isWithinQuietHours()` before sending
3. **Use user's timezone**: Convert all times to user's local timezone
4. **Avoid duplicates**: Check for existing notifications before creating new ones
5. **Log everything**: Use console.log for debugging and monitoring
6. **Handle errors gracefully**: Wrap notification creation in try-catch blocks
7. **Test thoroughly**: Use the test script before deploying changes

## Database Schema

### Notification Model

```javascript
{
  userId: ObjectId,              // User who receives the notification
  type: String,                  // Notification type (habit_reminder, daily_summary, etc.)
  title: String,                 // Notification title
  message: String,               // Notification message
  metadata: Object,              // Additional data (habitId, habitName, etc.)
  read: Boolean,                 // Whether notification has been read
  createdAt: Date,               // When notification was created
  updatedAt: Date                // When notification was last updated
}
```

### User Notification Preferences

```javascript
{
  notificationPreferences: {
    inApp: Boolean,
    habitReminders: Boolean,
    streakMilestones: Boolean,
    dailySummary: Boolean,
    weeklyInsights: Boolean,
    challengeUpdates: Boolean,
    communityActivity: Boolean,
    tipsAndTricks: Boolean,
    systemUpdates: Boolean,
    quietHours: {
      enabled: Boolean,
      start: String,             // HH:mm format
      end: String                // HH:mm format
    }
  },
  timezone: String                // IANA timezone (e.g., 'America/New_York')
}
```

## Future Enhancements

Potential improvements to the notification system:

1. **Email notifications**: Send notifications via email
2. **Push notifications**: Browser and mobile push notifications
3. **SMS notifications**: Text message notifications for critical updates
4. **Notification batching**: Group multiple notifications into a single digest
5. **Smart scheduling**: ML-based optimal notification timing
6. **Notification history**: View past notifications
7. **Notification actions**: Quick actions from notifications (complete habit, etc.)
8. **Custom notification sounds**: User-selectable notification sounds
9. **Notification priority**: High/medium/low priority levels
10. **Notification templates**: Customizable notification templates
