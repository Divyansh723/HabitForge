# Forgiveness Token Security Guide

## Overview

The forgiveness token system allows users to retroactively mark missed habits as completed, helping maintain streaks during genuine lapses. This document outlines the security measures implemented to prevent abuse.

## Security Measures Implemented

### 1. **Date Validation** ✅

**Prevents**: Future-dating and excessive backdating

**Implementation**:
- ❌ **Cannot use forgiveness for future dates**
- ❌ **Cannot use forgiveness for today** (must wait until day ends)
- ❌ **Cannot use forgiveness for dates older than 7 days**
- ✅ **All date comparisons use UTC** to prevent timezone manipulation

**Error Messages**:
- "Cannot use forgiveness token for future dates"
- "Cannot use forgiveness token for today. Please wait until the day ends or complete the habit normally."
- "Forgiveness tokens can only be used for the last 7 days"

### 2. **Timezone Security** ✅

**Prevents**: Timezone manipulation to gain unfair advantages

**Implementation**:
- ✅ **Uses user's stored timezone** (ignores timezone from request)
- ✅ **Timezone cannot be changed via forgiveness API**
- ✅ **All calculations use user's profile timezone**
- ✅ **Audit trail includes timezone information**

**How it works**:
```javascript
// BEFORE (Vulnerable):
const userTimezone = timezone || user.timezone || 'UTC';

// AFTER (Secure):
const userTimezone = user.timezone || 'UTC'; // Only from user profile
```

### 3. **Rate Limiting** ✅

**Prevents**: Rapid abuse of forgiveness system

**Implementation**:
- ✅ **Maximum 3 forgiveness tokens per day**
- ✅ **Limit resets at midnight in user's timezone**
- ✅ **Clear feedback about remaining daily usage**

**Response includes**:
```json
{
  "remainingTokens": 2,
  "dailyUsageRemaining": 2
}
```

### 4. **Duplicate Prevention** ✅

**Prevents**: Wasting tokens on already-completed habits

**Implementation**:
- ✅ **Checks for existing completions on the date**
- ✅ **Checks for existing forgiveness on the date**
- ✅ **Rejects request without consuming token**

**Error Message**:
- "Habit already completed or forgiven for this date"

### 5. **Audit Trail** ✅

**Enables**: Detection of abuse patterns

**Implementation**:
- ✅ **Logs all forgiveness usage with timestamp**
- ✅ **Stores metadata in completion record**:
  - `forgivenessUsedAt`: When the token was used
  - `forgivenessTimezone`: User's timezone at time of use
  - `daysLate`: How many days late the completion was
- ✅ **Console logging for monitoring**

**Metadata Example**:
```javascript
{
  forgivenessUsedAt: "2025-11-19T15:30:00.000Z",
  forgivenessTimezone: "Asia/Kolkata",
  daysLate: 3
}
```

### 6. **XP Reduction** ✅

**Prevents**: Forgiveness being more valuable than genuine completion

**Implementation**:
- ✅ **Forgiveness awards 5 XP** (vs 10 XP for genuine completion)
- ✅ **Clearly marked with `forgivenessUsed: true`**
- ✅ **Marked with `editedFlag: true`**

### 7. **Automatic Forgiveness Safeguards** ✅

**Prevents**: Automatic system abuse

**Implementation**:
- ✅ **Only protects habits with active streaks** (currentStreak > 0)
- ✅ **Prioritizes longest streaks first**
- ✅ **Respects token limits** (max 3)
- ✅ **Runs once per day** at 11:50 PM
- ✅ **Can be disabled by user** in preferences
- ✅ **Sends notification** when tokens are used

### 8. **Token Earning Validation** ✅

**Prevents**: Unfair token accumulation

**Implementation**:
- ✅ **Maximum 3 tokens** can be stacked
- ✅ **1 token per day** for completing all habits
- ✅ **Checks all habits completed on same calendar day**
- ✅ **Uses user's timezone** for date calculations

## Potential Abuse Scenarios & Mitigations

### Scenario 1: Timezone Hopping

**Attack**: User changes timezone to get extra days for forgiveness

**Mitigation**: 
- ✅ System uses stored timezone from user profile
- ✅ Timezone from API request is ignored
- ✅ 7-day window calculated in UTC
- ✅ Future implementation: Log timezone changes and flag suspicious patterns

### Scenario 2: Future Dating

**Attack**: User tries to use forgiveness for future dates

**Mitigation**:
- ✅ Strict validation prevents future dates
- ✅ Cannot use forgiveness for current day
- ✅ Clear error messages

### Scenario 3: Excessive Backdating

**Attack**: User tries to use forgiveness for very old dates

**Mitigation**:
- ✅ 7-day lookback window enforced
- ✅ Older dates rejected with clear message

### Scenario 4: Rapid Token Usage

**Attack**: User rapidly uses all tokens to manipulate streaks

**Mitigation**:
- ✅ Daily limit of 3 forgiveness uses
- ✅ Rate limiting prevents rapid abuse
- ✅ Audit trail tracks usage patterns

### Scenario 5: Token Farming

**Attack**: User creates easy habits to farm tokens

**Mitigation**:
- ✅ Must complete ALL habits to earn token
- ✅ Maximum 3 tokens can be stacked
- ✅ 1 token per day maximum
- ✅ Tokens only useful for maintaining streaks

## Testing

### Run Security Test

```bash
cd server
node src/scripts/testForgivenessTokenSecurity.js
```

### Test Coverage

The security test checks:
- ✅ Forgiveness usage patterns
- ✅ Rate limiting compliance
- ✅ Suspicious consecutive usage
- ✅ Automatic forgiveness eligibility
- ✅ Data integrity (XP, flags)
- ✅ Future-dated completions (should be 0)
- ✅ Old-dated completions (beyond 7-day window)
- ✅ Overall statistics and recommendations

### Expected Results

**Healthy System**:
- No future-dated forgiveness completions
- No forgiveness beyond 7-day window
- All forgiveness completions have 5 XP
- All forgiveness completions marked with `editedFlag: true`
- Daily usage within limits (≤3 per day)
- Reasonable forgiveness-to-completion ratio (<20%)

**Warning Signs**:
- Multiple forgiveness on same date
- Forgiveness on consecutive days (3+)
- High forgiveness usage (>2x number of users per day)
- Future-dated completions
- Completions beyond 7-day window

## API Endpoints

### Use Forgiveness Token

```http
POST /api/habits/:habitId/forgiveness
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-11-15T00:00:00.000Z"
}
```

**Security Validations**:
1. User has available tokens
2. Habit belongs to user
3. Date is not in future
4. Date is not today
5. Date is within 7-day window
6. Daily limit not exceeded (3/day)
7. No existing completion on date

**Response**:
```json
{
  "success": true,
  "message": "Forgiveness token used successfully",
  "data": {
    "completion": { ... },
    "remainingTokens": 2,
    "dailyUsageRemaining": 2
  }
}
```

## Database Schema

### Completion Model (Forgiveness Fields)

```javascript
{
  forgivenessUsed: Boolean,      // true if forgiveness was used
  editedFlag: Boolean,           // true for forgiveness completions
  xpEarned: Number,              // 5 for forgiveness, 10 for genuine
  metadata: {
    forgivenessUsedAt: Date,     // When token was used
    forgivenessTimezone: String, // User's timezone at time
    daysLate: Number             // Days between completion and actual date
  }
}
```

### User Model (Forgiveness Fields)

```javascript
{
  forgivenessTokens: Number,     // Current token count (0-3)
  notificationPreferences: {
    autoForgiveness: Boolean     // Enable/disable automatic forgiveness
  }
}
```

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Forgiveness Usage Rate**
   - Target: <20% of total completions
   - Alert if: >30% of completions are forgiveness

2. **Daily Forgiveness Count**
   - Target: <2x number of active users
   - Alert if: >3x number of active users

3. **Token Distribution**
   - Healthy: 40-60% of users have max tokens
   - Alert if: <20% have max tokens (over-usage)

4. **Suspicious Patterns**
   - Alert if: User uses forgiveness 3+ consecutive days
   - Alert if: User hits daily limit multiple days in a row
   - Alert if: Future-dated completions detected
   - Alert if: Completions beyond 7-day window detected

### Audit Queries

```javascript
// Find users with suspicious forgiveness patterns
db.completions.aggregate([
  { $match: { forgivenessUsed: true } },
  { $group: { 
      _id: "$userId", 
      count: { $sum: 1 },
      avgDaysLate: { $avg: "$metadata.daysLate" }
  }},
  { $match: { count: { $gt: 10 } } },
  { $sort: { count: -1 } }
]);

// Find future-dated forgiveness (should be empty)
db.completions.find({
  forgivenessUsed: true,
  completedAt: { $gt: new Date() }
});

// Find forgiveness beyond 7-day window
db.completions.find({
  forgivenessUsed: true,
  "metadata.daysLate": { $gt: 7 }
});
```

## Future Enhancements

Potential additional security measures:

1. **Timezone Change Logging**
   - Track all timezone changes with timestamps
   - Flag accounts with >3 changes in 24 hours
   - Implement cooldown period for timezone changes

2. **Machine Learning Detection**
   - Detect unusual forgiveness patterns
   - Identify coordinated abuse across multiple accounts
   - Predict potential abuse before it happens

3. **Reputation System**
   - Track user's forgiveness-to-completion ratio
   - Reduce token earning rate for high-ratio users
   - Reward consistent genuine completions

4. **Admin Dashboard**
   - Real-time forgiveness usage monitoring
   - Suspicious pattern alerts
   - User behavior analytics
   - Manual review queue for flagged accounts

5. **Progressive Restrictions**
   - Reduce daily limit for repeat offenders
   - Shorter lookback window for suspicious accounts
   - Temporary forgiveness suspension for abuse

## Best Practices

1. **Always validate dates** before processing forgiveness
2. **Use UTC for all date comparisons** to prevent manipulation
3. **Log all forgiveness usage** for audit trail
4. **Monitor usage patterns** regularly
5. **Respond quickly** to suspicious activity
6. **Educate users** about proper forgiveness usage
7. **Keep security measures updated** as new abuse patterns emerge

## Conclusion

The forgiveness token system is designed with multiple layers of security to prevent abuse while maintaining a positive user experience. Regular monitoring and testing ensure the system remains secure and fair for all users.
