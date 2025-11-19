# Timezone Behavior in HabitForge

## Overview

HabitForge uses different timezone handling strategies for different types of data to provide the best user experience.

## Timezone Strategies

### 1. **Habit Reminder Times - Timezone Independent (Local Time)**

**Behavior**: Habit reminder times are stored and displayed as **local time** and are **timezone-independent**.

**Example**:
- You create a "Morning Exercise" habit with a reminder at **6:00 AM**
- You travel from **New York (EST)** to **Mumbai (IST)**
- The reminder still shows **6:00 AM** and triggers at **6:00 AM Mumbai time**

**Why**: This ensures your daily routines stay consistent with your local schedule, regardless of where you are in the world.

**Implementation**:
- Stored in database as: 
  - `reminderTime`: `"06:00"` (for display)
  - `reminderTimeUTC`: `"06:00"` (same value, stored for consistency)
  - `reminderTimezone`: User's timezone when created
- Displayed to user as: `"06:00"` (no conversion)
- Notification sent when: User's current local time matches `"06:00"`

### 2. **Timestamps - Timezone Aware (UTC Storage)**

**Behavior**: All other timestamps (messages, notifications, announcements, etc.) are stored in **UTC** and displayed in the **user's current timezone**.

**Example**:
- A community message is posted at **2:00 PM EST** (stored as 19:00 UTC)
- User in **Tokyo (JST)** sees: **4:00 AM JST** (next day)
- User in **London (GMT)** sees: **7:00 PM GMT**

**Why**: This ensures accurate historical records and proper time sequencing across different timezones.

**Implementation**:
- Stored in database as: UTC timestamp
- Displayed to user as: Converted to user's selected timezone
- Examples:
  - Chat messages: Show when the message was sent in your local time
  - Notifications: Show when the notification was created in your local time
  - Challenge dates: Show start/end dates in your local time
  - Member join dates: Show when members joined in your local time

## Database Storage

### Habit Model
```javascript
{
  reminderTime: "06:00",        // Local time for display (HH:mm format)
  reminderTimeUTC: "06:00",     // Stored in UTC format but represents local time
  reminderTimezone: "America/New_York",  // Timezone when habit was created
  reminderEnabled: true,
  // ... other fields
}
```

**Note**: While we store `reminderTimeUTC`, it actually contains the local time value. This is intentional - we want the reminder to trigger at the same local time (e.g., 6:00 AM) regardless of the user's current timezone. The `reminderTimezone` field tracks which timezone the habit was originally created in for reference.

### Notification/Message Models
```javascript
{
  createdAt: "2024-01-15T19:00:00.000Z",  // UTC timestamp
  // ... other fields
}
```

## User Experience

### When User Changes Timezone

**Habit Reminders**:
- ✅ Stay at the same local time (6:00 AM remains 6:00 AM)
- ✅ Trigger at the new local time
- ✅ No conversion needed

**Historical Data**:
- ✅ Automatically converts to new timezone
- ✅ Shows accurate relative times
- ✅ Maintains chronological order

### Example Scenario

**User Profile**: Timezone set to `America/New_York`

**Habits**:
- Morning Exercise: 6:00 AM → Shows "6:00 AM", triggers at 6:00 AM EST
- Evening Reading: 9:00 PM → Shows "9:00 PM", triggers at 9:00 PM EST

**User travels to India and changes timezone to `Asia/Kolkata`**

**Habits** (unchanged):
- Morning Exercise: 6:00 AM → Shows "6:00 AM", triggers at 6:00 AM IST
- Evening Reading: 9:00 PM → Shows "9:00 PM", triggers at 9:00 PM IST

**Community Messages**:
- Message posted yesterday at 2:00 PM EST
  - Before: Showed "2:00 PM"
  - After: Shows "11:30 PM" (converted to IST)

## Technical Implementation

### Frontend Components

**Habit Reminder Display** (`HabitCard.tsx`):
```typescript
// No conversion - display as-is
{habit.reminderTime}  // "06:00"
```

**Timestamp Display** (`NotificationsPage.tsx`, `CircleDetails.tsx`):
```typescript
// Convert to user's timezone
formatInUserTimezone(timestamp, userTimezone, 'relative')
```

### Backend Notification Scheduler

```javascript
// Get current time in user's timezone
const currentTime = formatInTimeZone(nowUTC, userTimezone, 'HH:mm');

// Compare with habit's local reminder time
if (habit.reminderTime === currentTime) {
  // Send notification
}
```

## Benefits

1. **Habit Consistency**: Your daily routines adapt to your local schedule
2. **Historical Accuracy**: Past events show when they actually occurred relative to you
3. **Global Collaboration**: Community features work seamlessly across timezones
4. **Travel Friendly**: No need to update habit times when traveling
5. **Intuitive**: Matches user expectations for different types of data

## Summary

| Data Type | Storage | Display | Behavior |
|-----------|---------|---------|----------|
| Habit Reminder Times | Local (HH:mm) | As-is | Timezone-independent |
| Chat Messages | UTC | User's timezone | Timezone-aware |
| Notifications | UTC | User's timezone | Timezone-aware |
| Announcements | UTC | User's timezone | Timezone-aware |
| Challenge Dates | UTC | User's timezone | Timezone-aware |
| Member Join Dates | UTC | User's timezone | Timezone-aware |
