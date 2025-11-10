# API Reference

Complete API documentation for HabitForge backend.

---

## Base URL

```
Development: http://localhost:8000/api
Production: https://api.habitforge.com/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "timezone": "America/New_York"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "timezone": "America/New_York",
      "createdAt": "2025-11-10T12:00:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

### Get Current User

```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "level": 5,
    "xp": 1250,
    "forgivenessTokens": 3
  }
}
```

---

## Habit Endpoints

### Get All Habits

```http
GET /api/habits
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `category` (optional): Filter by category
- `archived` (optional): Include archived habits (true/false)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Morning Exercise",
      "description": "30 minutes of exercise",
      "category": "fitness",
      "frequency": "daily",
      "currentStreak": 15,
      "longestStreak": 30,
      "completionRate": 85.5,
      "reminderTime": "07:00",
      "createdAt": "2025-10-01T00:00:00Z"
    }
  ]
}
```

### Create Habit

```http
POST /api/habits
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Read for 30 minutes",
  "description": "Read books or articles",
  "category": "learning",
  "frequency": "daily",
  "reminderTime": "20:00",
  "icon": "book",
  "color": "#6366f1"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Read for 30 minutes",
    "currentStreak": 0,
    "longestStreak": 0
  }
}
```

### Update Habit

```http
PUT /api/habits/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Read for 45 minutes",
  "reminderTime": "21:00"
}
```

**Response:** `200 OK`

### Delete Habit

```http
DELETE /api/habits/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

### Complete Habit

```http
POST /api/habits/:id/complete
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "date": "2025-11-10",
  "notes": "Felt great today!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "completion": {
      "id": "uuid",
      "habitId": "uuid",
      "completedAt": "2025-11-10T14:30:00Z"
    },
    "xpEarned": 15,
    "newStreak": 16,
    "levelUp": false,
    "achievementsUnlocked": []
  }
}
```

### Uncomplete Habit

```http
DELETE /api/habits/:id/complete/:date
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Gamification Endpoints

### Get User Stats

```http
GET /api/gamification/stats
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "level": 5,
    "currentXP": 1250,
    "xpToNextLevel": 1500,
    "totalXP": 6250,
    "forgivenessTokens": 3,
    "achievementsUnlocked": 12,
    "totalAchievements": 50,
    "currentStreaks": 5,
    "longestStreak": 45
  }
}
```

### Get Achievements

```http
GET /api/gamification/achievements
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `unlocked` (optional): Filter by unlocked status (true/false)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "First Step",
      "description": "Complete your first habit",
      "icon": "trophy",
      "category": "starter",
      "xpReward": 50,
      "unlocked": true,
      "unlockedAt": "2025-10-01T10:00:00Z"
    }
  ]
}
```

### Get Challenges

```http
GET /api/gamification/challenges
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional): active, completed, failed

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "7-Day Warrior",
      "description": "Complete all habits for 7 days",
      "type": "streak",
      "target": 7,
      "progress": 5,
      "status": "active",
      "reward": 100,
      "expiresAt": "2025-11-17T00:00:00Z"
    }
  ]
}
```

---

## Community Endpoints

### Get Circles

```http
GET /api/community/circles
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `joined` (optional): Show only joined circles (true/false)
- `search` (optional): Search by name

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Morning Routine Masters",
      "description": "For early risers building morning habits",
      "privacy": "public",
      "memberCount": 45,
      "maxMembers": 100,
      "isAdmin": false,
      "isMember": true,
      "createdAt": "2025-09-01T00:00:00Z"
    }
  ]
}
```

### Create Circle

```http
POST /api/community/circles
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Fitness Enthusiasts",
  "description": "Building healthy fitness habits together",
  "privacy": "public",
  "maxMembers": 50,
  "tags": ["fitness", "health", "exercise"]
}
```

**Response:** `201 Created`

### Join Circle

```http
POST /api/community/circles/:id/join
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Successfully joined circle"
}
```

### Leave Circle

```http
POST /api/community/circles/:id/leave
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Get Circle Details

```http
GET /api/community/circles/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Morning Routine Masters",
    "description": "For early risers",
    "members": [
      {
        "id": "uuid",
        "name": "John Doe",
        "role": "admin",
        "joinedAt": "2025-09-01T00:00:00Z"
      }
    ],
    "announcements": [],
    "challenges": [],
    "leaderboard": []
  }
}
```

### Create Announcement

```http
POST /api/community/circles/:id/announcements
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Weekly Challenge Starting!",
  "content": "Join our new 7-day challenge starting Monday",
  "priority": "important"
}
```

**Response:** `201 Created`

### Get Circle Leaderboard

```http
GET /api/community/circles/:id/leaderboard
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): week, month, all-time

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "userId": "uuid",
      "name": "John Doe",
      "level": 8,
      "xp": 2500,
      "completionRate": 95.5
    }
  ]
}
```

---

## Analytics Endpoints

### Get Dashboard Stats

```http
GET /api/analytics/dashboard
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "todayCompletions": 5,
    "totalHabits": 8,
    "completionRate": 62.5,
    "currentStreaks": 3,
    "xpEarnedToday": 75,
    "level": 5,
    "forgivenessTokens": 2
  }
}
```

### Get Habit Analytics

```http
GET /api/analytics/habits/:id
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period` (optional): week, month, year, all

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "habitId": "uuid",
    "completionRate": 85.5,
    "currentStreak": 15,
    "longestStreak": 30,
    "totalCompletions": 120,
    "averageCompletionTime": "07:15",
    "bestDay": "Monday",
    "completionsByDay": {
      "Monday": 18,
      "Tuesday": 17
    },
    "trend": "improving"
  }
}
```

### Get Consistency Calendar

```http
GET /api/analytics/calendar
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `year` (required): 2025
- `month` (optional): 1-12

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "2025-11-01": {
      "completions": 5,
      "total": 8,
      "rate": 62.5
    },
    "2025-11-02": {
      "completions": 7,
      "total": 8,
      "rate": 87.5
    }
  }
}
```

---

## Wellbeing Endpoints

### Log Mood

```http
POST /api/wellbeing/mood
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "date": "2025-11-10",
  "mood": 4,
  "energy": 3,
  "stress": 2,
  "notes": "Great day overall!"
}
```

**Response:** `201 Created`

### Get Mood History

```http
GET /api/wellbeing/mood
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-11-10",
      "mood": 4,
      "energy": 3,
      "stress": 2,
      "notes": "Great day overall!"
    }
  ]
}
```

### Get Habit Impact Analysis

```http
GET /api/wellbeing/habit-impact
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "habitId": "uuid",
      "habitName": "Morning Exercise",
      "moodImpact": 0.8,
      "energyImpact": 1.2,
      "stressImpact": -0.5,
      "correlation": "strong"
    }
  ]
}
```

---

## Notification Endpoints

### Get Notifications

```http
GET /api/notifications
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `unread` (optional): true/false
- `type` (optional): reminder, milestone, achievement, community
- `limit` (optional): Number of notifications (default: 50)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "milestone",
      "title": "Streak Milestone!",
      "message": "You've reached a 30-day streak!",
      "read": false,
      "createdAt": "2025-11-10T08:00:00Z",
      "data": {
        "habitId": "uuid",
        "streak": 30
      }
    }
  ],
  "unreadCount": 5
}
```

### Mark as Read

```http
PUT /api/notifications/:id/read
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Mark All as Read

```http
PUT /api/notifications/read-all
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Update Notification Preferences

```http
PUT /api/notifications/preferences
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "emailNotifications": true,
  "habitReminders": true,
  "milestoneAlerts": true,
  "communityUpdates": false,
  "quietHoursStart": "22:00",
  "quietHoursEnd": "07:00"
}
```

**Response:** `200 OK`

---

## AI Endpoints

### Get Habit Suggestions

```http
GET /api/ai/suggestions
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "habit": "Evening Reading",
        "reason": "Based on your morning reading success",
        "confidence": 0.85,
        "category": "learning"
      }
    ]
  }
}
```

### Get Pattern Analysis

```http
GET /api/ai/patterns
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "patterns": [
      {
        "type": "time_preference",
        "description": "You complete habits best in the morning",
        "confidence": 0.92
      }
    ]
  }
}
```

### Get Motivational Message

```http
GET /api/ai/motivation
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `context` (optional): missed_habit, milestone, low_motivation

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "message": "You've got this! Remember why you started.",
    "type": "encouragement"
  }
}
```

---

## Forgiveness Token Endpoints

### Get Token Balance

```http
GET /api/forgiveness-tokens
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "balance": 3,
    "earnedTotal": 10,
    "usedTotal": 7,
    "nextTokenIn": 2
  }
}
```

### Apply Token

```http
POST /api/forgiveness-tokens/apply
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "habitId": "uuid",
  "date": "2025-11-09"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Forgiveness token applied",
  "data": {
    "newBalance": 2,
    "streakMaintained": true
  }
}
```

### Get Token History

```http
GET /api/forgiveness-tokens/history
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "earned",
      "amount": 1,
      "reason": "7-day consistency",
      "createdAt": "2025-11-03T00:00:00Z"
    },
    {
      "id": "uuid",
      "type": "used",
      "amount": -1,
      "habitId": "uuid",
      "date": "2025-11-09",
      "createdAt": "2025-11-10T08:00:00Z"
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1699632000
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Webhooks (Coming Soon)

Subscribe to events:
- `habit.completed`
- `achievement.unlocked`
- `level.up`
- `challenge.completed`

---

For implementation examples, see the [Developer Guide](./DEVELOPER_GUIDE.md).
