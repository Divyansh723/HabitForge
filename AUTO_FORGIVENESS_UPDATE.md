# Automatic Forgiveness Token - Updated Logic

## Changes Made

### Previous Behavior
The automatic forgiveness system would:
- Use multiple tokens per day (up to user's available tokens)
- Protect multiple habits with active streaks
- Prioritize habits by longest streak
- Continue using tokens until all missed habits were covered or tokens ran out

### New Behavior
The automatic forgiveness system now:
- ✅ Uses **only 1 token maximum per day**
- ✅ Protects **only 1 habit** (the one with the longest streak)
- ✅ If multiple habits have the same longest streak, **selects one randomly**
- ✅ Saves remaining tokens for future days

## Implementation Details

### File Modified
`server/src/jobs/autoForgivenessToken.js`

### Key Changes

#### 1. Find Longest Streak
```javascript
// Sort by streak length (protect longest streaks first)
habitsNeedingForgiveness.sort((a, b) => b.currentStreak - a.currentStreak);

// Find the longest streak
const longestStreak = habitsNeedingForgiveness[0].currentStreak;

// Get all habits with the longest streak
const habitsWithLongestStreak = habitsNeedingForgiveness.filter(
  habit => habit.currentStreak === longestStreak
);
```

#### 2. Random Selection for Ties
```javascript
// If multiple habits have the same longest streak, select one randomly
const selectedHabit = habitsWithLongestStreak.length > 1
  ? habitsWithLongestStreak[Math.floor(Math.random() * habitsWithLongestStreak.length)]
  : habitsWithLongestStreak[0];

logger.info(`Selected habit "${selectedHabit.name}" with ${selectedHabit.currentStreak}-day streak (${habitsWithLongestStreak.length} habits had longest streak)`);
```

#### 3. Use Only 1 Token
```javascript
// Use only 1 token maximum per day for the selected habit
const habit = selectedHabit;
if (tokensAvailable > 0) {
  // Create forgiveness completion for this one habit
  // Deduct 1 token
  // Award 5 XP
}
```

#### 4. Updated Notification
```javascript
const notification = new Notification({
  userId: user._id,
  type: 'system',
  title: '🛡️ Streak Protected!',
  message: `We automatically used 1 forgiveness token to protect your longest streak: ${habit.name} (${habit.streak}-day streak)`,
  metadata: {
    tokensUsed: 1,
    habitProtected: habit,
    remainingTokens: tokensAvailable
  },
  priority: 'medium'
});
```

## Examples

### Example 1: Single Longest Streak
**User's Habits:**
- Morning Exercise: 15-day streak (missed today)
- Read for 20 minutes: 10-day streak (missed today)
- Meditation: 5-day streak (missed today)

**Result:**
- ✅ Protects: Morning Exercise (15-day streak)
- ❌ Does not protect: Read for 20 minutes, Meditation
- Tokens used: 1
- Remaining tokens: 2 (if user had 3)

### Example 2: Multiple Habits with Same Longest Streak
**User's Habits:**
- Morning Exercise: 15-day streak (missed today)
- Read for 20 minutes: 15-day streak (missed today)
- Meditation: 10-day streak (missed today)

**Result:**
- ✅ Protects: **Randomly selects** either Morning Exercise OR Read for 20 minutes
- ❌ Does not protect: The other habit with 15-day streak, Meditation
- Tokens used: 1
- Remaining tokens: 2 (if user had 3)

### Example 3: All Habits Completed
**User's Habits:**
- Morning Exercise: 15-day streak (completed today)
- Read for 20 minutes: 10-day streak (completed today)
- Meditation: 5-day streak (completed today)

**Result:**
- ✅ No forgiveness needed
- Tokens used: 0
- Remaining tokens: 3 (unchanged)

### Example 4: No Tokens Available
**User's Habits:**
- Morning Exercise: 15-day streak (missed today)
- User has 0 forgiveness tokens

**Result:**
- ❌ Cannot protect any habits
- Streak will break
- Tokens used: 0

## Benefits

### 1. Token Conservation
- Users keep more tokens for manual use
- Tokens last longer across multiple days
- More strategic token usage

### 2. Predictable Behavior
- Users know exactly which habit will be protected
- Clear priority: longest streak
- Consistent daily token usage (max 1)

### 3. Fair Random Selection
- When multiple habits have equal priority
- No bias toward any particular habit
- Each habit has equal chance of protection

### 4. User Control
- Users can still manually use tokens for other habits
- Automatic system doesn't consume all tokens
- Balance between automation and manual control

## Scheduling

The automatic forgiveness job runs:
- **Time**: 11:50 PM daily (in user's timezone)
- **Frequency**: Once per day
- **Conditions**:
  - User has forgiveness tokens available
  - User has auto-forgiveness enabled (default: true)
  - User has habits with active streaks (> 0)
  - User missed at least one habit today

## Notification

Users receive a notification when automatic forgiveness is used:

**Title**: 🛡️ Streak Protected!

**Message**: "We automatically used 1 forgiveness token to protect your longest streak: [Habit Name] ([X]-day streak)"

**Metadata**:
- Tokens used: 1
- Habit protected: { name, streak }
- Remaining tokens: X

## Testing

### Manual Test
1. Create multiple habits with different streaks
2. Miss all habits for a day
3. Wait until 11:50 PM (or trigger job manually)
4. Verify only 1 token is used
5. Verify longest streak habit is protected
6. Check notification received

### Test with Equal Streaks
1. Create 3 habits with same streak (e.g., 10 days each)
2. Miss all habits for a day
3. Trigger automatic forgiveness
4. Verify only 1 habit is protected (randomly selected)
5. Verify other 2 habits remain missed

### Test Script
```bash
cd HabitForge/server
node src/scripts/testAutoForgiveness.js
```

## Logging

The system logs:
```
User <userId> has <N> habits needing forgiveness
Selected habit "<habitName>" with <X>-day streak (<N> habits had longest streak)
Protected habit "<habitName>" (<X>-day streak) for user <userId>
Sent notification to user <userId> about protected habit: <habitName>
```

## Summary

The automatic forgiveness system now uses a **conservative, strategic approach**:
- ✅ Maximum 1 token per day
- ✅ Protects most valuable streak (longest)
- ✅ Fair random selection for ties
- ✅ Preserves tokens for manual use
- ✅ Clear, predictable behavior

This ensures users maintain control over their tokens while still benefiting from automatic streak protection for their most important habits.
