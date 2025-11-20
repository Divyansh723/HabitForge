# Forgiveness Token User Guide

## What Are Forgiveness Tokens? 🛡️

Forgiveness tokens are a special resource that allows you to retroactively mark a missed habit as completed, helping you maintain your streaks during genuine lapses. Think of them as a "second chance" system that acknowledges life happens!

## How to Get Forgiveness Tokens

### Earning Tokens

You can earn forgiveness tokens by being consistent with your habits:

**📈 Complete All Your Habits**
- When you complete **ALL** your habits in a single day, you earn **1 forgiveness token**
- Tokens are awarded at midnight (in your timezone)
- Maximum of **3 tokens** can be stacked at any time

**Example**:
```
Day 1: Complete 5/5 habits → Earn 1 token (Total: 1/3)
Day 2: Complete 4/5 habits → No token earned (Total: 1/3)
Day 3: Complete 5/5 habits → Earn 1 token (Total: 2/3)
Day 4: Complete 5/5 habits → Earn 1 token (Total: 3/3)
Day 5: Complete 5/5 habits → Already at max (Total: 3/3)
```

## How to Use Forgiveness Tokens

### 1. **Manual Usage** (User-Initiated)

#### Where to Find It

**Dashboard View**:
- Your forgiveness token count is displayed in the stats section
- Shows as "Forgiveness Tokens: 2/3"
- Located in the gamification card

**Habit Calendar/History View**:
- Click on a missed day in your habit calendar
- If you have tokens available, you'll see a "Use Forgiveness Token" button
- The button shows how many tokens you have remaining

#### How to Use Manually

**Step 1: Navigate to Your Habit**
- Go to Dashboard or Habits page
- Find the habit with a broken streak or missed day

**Step 2: Select the Missed Date**
- Click on the calendar icon or history view
- Select a date from the **last 7 days** that you missed

**Step 3: Use Forgiveness Token**
- Click "Use Forgiveness Token" button
- Confirm the action in the dialog
- The system will:
  - ✅ Mark the habit as completed for that date
  - ✅ Restore your streak
  - ✅ Award 5 XP (less than normal 10 XP)
  - ✅ Deduct 1 token from your balance

**Step 4: Confirmation**
- You'll see a success message
- Your streak will be updated
- Token count will decrease by 1

#### Manual Usage Restrictions

❌ **Cannot use for**:
- Future dates
- Today (must wait until day ends)
- Dates older than 7 days
- Dates already completed
- When you have 0 tokens
- More than 3 times per day

✅ **Can use for**:
- Any missed day in the last 7 days
- Any habit you own
- Up to 3 times per day

### 2. **Automatic Usage** (System-Initiated)

#### How Automatic Forgiveness Works

**🤖 Automatic Protection**
- Runs every night at **11:50 PM** (in your timezone)
- Automatically uses tokens to protect your longest streaks
- Only activates if you have available tokens
- Can be enabled/disabled in settings

#### What Gets Protected

The system prioritizes habits based on:
1. **Longest streaks first** (protects your most valuable progress)
2. **Active streaks only** (currentStreak > 0)
3. **Incomplete habits** (not completed today)

**Example**:
```
You have 2 forgiveness tokens
Today you missed 3 habits:

Habit A: 30-day streak ← Protected first (uses 1 token)
Habit B: 15-day streak ← Protected second (uses 1 token)
Habit C: 5-day streak  ← Not protected (no tokens left)

Result: 0 tokens remaining, 2 streaks saved!
```

#### Automatic Forgiveness Notification

When automatic forgiveness activates, you'll receive a notification:

**🛡️ Streaks Protected!**
```
We automatically used 2 forgiveness tokens to protect your streaks:
- Morning Exercise (30-day streak)
- Read for 20 minutes (15-day streak)

Remaining tokens: 0/3
```

#### Enable/Disable Automatic Forgiveness

**Settings → Notifications → Auto-Forgiveness**
- Toggle ON: System will automatically protect streaks
- Toggle OFF: You must manually use tokens
- Default: **ON** (enabled)

**When to Disable**:
- You want full control over token usage
- You prefer to manually choose which habits to protect
- You're saving tokens for specific habits

**When to Keep Enabled**:
- You want peace of mind
- You forget to use tokens manually
- You value your longest streaks most

## UI Components

### 1. **Dashboard Stats Card**

```
┌─────────────────────────┐
│ 🏆 Gamification         │
├─────────────────────────┤
│ Level: 5                │
│ XP: 450/1000            │
│ Tokens: 2/3 🛡️          │
└─────────────────────────┘
```

### 2. **Habit Calendar View**

```
┌─────────────────────────────────┐
│ Morning Exercise                │
├─────────────────────────────────┤
│ Nov 2025                        │
│ S  M  T  W  T  F  S            │
│          ✓  ✓  ✗  ✓  ✓         │
│                ↑                │
│         [Use Token] 🛡️          │
└─────────────────────────────────┘
```

### 3. **Forgiveness Dialog**

```
┌─────────────────────────────────┐
│ Use Forgiveness Token?          │
├─────────────────────────────────┤
│ Habit: Morning Exercise         │
│ Date: Nov 15, 2025              │
│ Streak: 7 days → 8 days         │
│                                 │
│ This will:                      │
│ ✓ Mark habit as completed       │
│ ✓ Restore your streak           │
│ ✓ Award 5 XP                    │
│ ✓ Use 1 token (2 → 1)          │
│                                 │
│ [Cancel]  [Use Token] 🛡️        │
└─────────────────────────────────┘
```

### 4. **Notification (Automatic)**

```
┌─────────────────────────────────┐
│ 🛡️ Streaks Protected!           │
├─────────────────────────────────┤
│ We automatically used 2         │
│ forgiveness tokens to protect   │
│ your streaks:                   │
│                                 │
│ • Morning Exercise (30 days)    │
│ • Read for 20 min (15 days)     │
│                                 │
│ Remaining tokens: 0/3           │
│                                 │
│ [View Details]                  │
└─────────────────────────────────┘
```

## Visual Indicators

### Token Count Display

**Full Tokens (3/3)**:
```
🛡️ 🛡️ 🛡️  3/3
```

**Partial Tokens (2/3)**:
```
🛡️ 🛡️ ⚪  2/3
```

**No Tokens (0/3)**:
```
⚪ ⚪ ⚪  0/3
```

### Completion Markers

**Normal Completion**:
```
✓ (Green checkmark, 10 XP)
```

**Forgiveness Completion**:
```
🛡️ (Shield icon, 5 XP, slightly faded)
```

## Best Practices

### When to Use Forgiveness Tokens

✅ **Good Reasons**:
- You were genuinely sick
- Emergency or unexpected event
- Traveling and forgot
- Technical issues prevented completion
- Protecting a long streak (20+ days)

❌ **Not Recommended**:
- Laziness or procrastination
- Didn't feel like doing it
- Forgot because you weren't paying attention
- Using tokens instead of building discipline

### Token Management Strategy

**Conservative Approach** (Recommended):
- Keep 2-3 tokens in reserve
- Only use for streaks 14+ days
- Let automatic forgiveness handle it
- Earn tokens consistently

**Aggressive Approach**:
- Use tokens liberally
- Protect all streaks
- Disable automatic forgiveness
- Manually choose which habits to protect

**Balanced Approach**:
- Keep 1-2 tokens in reserve
- Use for streaks 7+ days
- Enable automatic forgiveness
- Manually use for important habits

## Frequently Asked Questions

### Q: Can I use forgiveness tokens for future dates?
**A**: No, you can only use tokens for past dates (up to 7 days ago).

### Q: Can I use forgiveness tokens for today?
**A**: No, you must wait until the day ends. Complete the habit normally if you still can!

### Q: How far back can I use forgiveness tokens?
**A**: Up to 7 days in the past. Older dates cannot be forgiven.

### Q: How many times can I use forgiveness tokens per day?
**A**: Maximum 3 times per day to prevent abuse.

### Q: Do forgiveness completions give the same XP?
**A**: No, forgiveness gives 5 XP vs 10 XP for normal completion.

### Q: Can I see which completions used forgiveness?
**A**: Yes, forgiveness completions are marked with a shield icon (🛡️) and appear slightly faded.

### Q: What happens if I change my timezone?
**A**: The system uses your stored timezone to prevent manipulation. Changing timezone won't let you use tokens for additional days.

### Q: Can I disable automatic forgiveness?
**A**: Yes, go to Settings → Notifications → Auto-Forgiveness and toggle it off.

### Q: Which habits does automatic forgiveness protect?
**A**: It protects habits with the longest active streaks first, up to your available token count.

### Q: When does automatic forgiveness run?
**A**: Every night at 11:50 PM in your timezone.

### Q: Can I get a refund if I use a token by mistake?
**A**: No, token usage is final. Always double-check before confirming.

### Q: What if I have no tokens and miss a habit?
**A**: Your streak will break. Focus on earning more tokens by completing all habits daily.

## Tips for Maximizing Tokens

1. **Complete All Habits Daily**
   - This is the only way to earn tokens
   - Consistency is key

2. **Keep Tokens in Reserve**
   - Don't use them immediately
   - Save for emergencies

3. **Enable Automatic Forgiveness**
   - Let the system protect your longest streaks
   - Reduces stress and decision-making

4. **Use Within 7 Days**
   - Don't wait too long to use tokens
   - Older dates cannot be forgiven

5. **Prioritize Long Streaks**
   - Use tokens for habits with 14+ day streaks
   - Short streaks are easier to rebuild

6. **Monitor Your Token Count**
   - Check dashboard regularly
   - Plan your habit completion strategy

7. **Don't Rely on Tokens**
   - Tokens are a safety net, not a crutch
   - Build genuine habits and discipline

## Troubleshooting

### "No forgiveness tokens available"
- You've used all 3 tokens
- Complete all habits today to earn more
- Wait until midnight for token reward

### "Cannot use forgiveness token for this date"
- Date is too old (>7 days)
- Date is in the future
- Date is today (wait until day ends)
- Habit already completed on that date

### "Daily forgiveness limit reached"
- You've used 3 tokens today
- Wait until tomorrow to use more
- This prevents abuse

### "Habit already completed or forgiven for this date"
- You already completed this habit on that date
- Or you already used forgiveness for that date
- Cannot use token twice for same date

## Summary

Forgiveness tokens are a powerful tool to maintain your progress while acknowledging that life happens. Use them wisely, earn them consistently, and let automatic forgiveness protect your most valuable streaks. Remember: tokens are a safety net, not a replacement for genuine habit completion!

**Key Takeaways**:
- 🎯 Earn tokens by completing ALL habits daily
- 🛡️ Use tokens to protect streaks (manual or automatic)
- ⏰ 7-day window for forgiveness
- 🚫 3 per day limit
- 💪 Build discipline, use tokens as backup
