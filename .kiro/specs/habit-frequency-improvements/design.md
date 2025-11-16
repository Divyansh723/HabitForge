# Habit Frequency Improvements - Design

## Overview

This design implements frequency-based completion restrictions for habits, ensuring daily habits can be completed once per day, weekly habits once per week, and custom habits only on selected days.

## Architecture

### Data Model Changes

#### Habit Model Updates
```javascript
// server/src/models/Habit.js
customFrequency: {
  daysOfWeek: [{
    type: Number,
    min: 0,
    max: 6 // 0 = Sunday, 6 = Saturday
  }]
  // Remove timesPerWeek - not needed for this implementation
}
```

#### Completion Model
No changes needed - existing model already stores `completedAt` with timezone.

### Components and Interfaces

#### Frontend Components to Modify

1. **HabitForm** (`src/components/habit/HabitForm.tsx`)
   - Add day selector UI for custom frequency
   - Validate at least one day is selected
   - Update form state management

2. **DailyHabitChecklist** (`src/components/habit/DailyHabitChecklist.tsx`)
   - Filter custom habits by current day
   - Show weekly completion status
   - Disable completed weekly/custom habits

3. **CompletionButton** (`src/components/habit/CompletionButton.tsx`)
   - Check if habit can be completed today
   - Show appropriate disabled state with message

#### Backend Controllers to Modify

1. **habitController** (`server/src/controllers/habitController.js`)
   - Add completion validation logic
   - Check existing completions before allowing new ones
   - Return appropriate error messages

### Data Flow

#### Habit Creation Flow
```
User fills form → Selects frequency → 
  If custom: Selects days → 
  Validates selection → 
  Saves to database
```

#### Completion Flow
```
User clicks complete → 
  Frontend checks if completable → 
  Sends request to backend → 
  Backend validates:
    - Daily: No completion today?
    - Weekly: No completion this week?
    - Custom: Is today a selected day? No completion today?
  → Creates completion or returns error
```

#### Dashboard Display Flow
```
Load habits → 
  Filter by active status → 
  For custom habits: Filter by current day → 
  Check today's completions → 
  Render with appropriate status
```

## Implementation Details

### 1. Completion Validation Logic

```javascript
// Pseudo-code for validation
function canCompleteHabit(habit, userId, date) {
  const today = startOfDay(date);
  
  if (habit.frequency === 'daily') {
    // Check if completed today
    const todayCompletion = await Completion.findOne({
      habitId: habit._id,
      userId,
      completedAt: { $gte: today, $lt: endOfDay(today) }
    });
    return !todayCompletion;
  }
  
  if (habit.frequency === 'weekly') {
    // Check if completed this week
    const weekStart = startOfWeek(date); // Sunday
    const weekEnd = endOfWeek(date); // Saturday
    const weekCompletion = await Completion.findOne({
      habitId: habit._id,
      userId,
      completedAt: { $gte: weekStart, $lte: weekEnd }
    });
    return !weekCompletion;
  }
  
  if (habit.frequency === 'custom') {
    // Check if today is a selected day
    const dayOfWeek = date.getDay(); // 0-6
    if (!habit.customFrequency.daysOfWeek.includes(dayOfWeek)) {
      return false; // Not a selected day
    }
    
    // Check if completed today
    const todayCompletion = await Completion.findOne({
      habitId: habit._id,
      userId,
      completedAt: { $gte: today, $lt: endOfDay(today) }
    });
    return !todayCompletion;
  }
}
```

### 2. Day Selector UI Component

```typescript
// Component structure
interface DaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onChange }) => {
  const days = [
    { value: 0, label: 'Sun', fullLabel: 'Sunday' },
    { value: 1, label: 'Mon', fullLabel: 'Monday' },
    { value: 2, label: 'Tue', fullLabel: 'Tuesday' },
    { value: 3, label: 'Wed', fullLabel: 'Wednesday' },
    { value: 4, label: 'Thu', fullLabel: 'Thursday' },
    { value: 5, label: 'Fri', fullLabel: 'Friday' },
    { value: 6, label: 'Sat', fullLabel: 'Saturday' }
  ];
  
  // Render checkboxes for each day
  // Toggle selection on click
  // Validate at least one selected
};
```

### 3. Dashboard Filtering Logic

```typescript
// Filter habits for display
function getDisplayableHabits(habits: Habit[], date: Date): Habit[] {
  const dayOfWeek = date.getDay();
  
  return habits.filter(habit => {
    if (!habit.active) return false;
    
    if (habit.frequency === 'custom') {
      // Only show if today is a selected day
      return habit.customFrequency?.daysOfWeek?.includes(dayOfWeek);
    }
    
    // Show daily and weekly habits always
    return true;
  });
}
```

### 4. Streak Calculation Updates

```javascript
// Update streak calculation to respect frequency
function calculateStreak(habit, completions) {
  if (habit.frequency === 'daily') {
    // Existing logic - consecutive days
    return calculateDailyStreak(completions);
  }
  
  if (habit.frequency === 'weekly') {
    // Count consecutive weeks with at least one completion
    return calculateWeeklyStreak(completions);
  }
  
  if (habit.frequency === 'custom') {
    // Only count selected days
    return calculateCustomStreak(completions, habit.customFrequency.daysOfWeek);
  }
}
```

## Error Handling

### Error Messages
- **Daily already completed**: "You've already completed this habit today. Come back tomorrow!"
- **Weekly already completed**: "You've completed this habit this week. It will be available again next Sunday."
- **Custom wrong day**: "This habit is only available on [selected days]."
- **Custom already completed**: "You've already completed this habit today."

### UI States
- **Completed today**: Green checkmark, disabled button
- **Completed this week** (weekly): Blue badge "Completed this week", disabled button
- **Not available today** (custom): Grayed out or hidden from list
- **Available**: Normal state, clickable button

## Testing Strategy

### Unit Tests
- Validation logic for each frequency type
- Day filtering logic
- Streak calculation for each frequency type

### Integration Tests
- Complete daily habit twice in same day (should fail)
- Complete weekly habit twice in same week (should fail)
- Complete custom habit on wrong day (should fail)
- Complete custom habit on correct day (should succeed)

### Manual Testing
- Create habits of each type
- Test completion restrictions
- Verify dashboard filtering
- Check streak calculations
- Test across week boundaries

## Migration Strategy

### Database Migration
No migration needed - `customFrequency.daysOfWeek` already exists in schema.

### Existing Data
- Existing custom habits with `timesPerWeek` will need UI update to select days
- Can provide default: if `timesPerWeek` exists, suggest all days or weekdays

## Performance Considerations

- Completion validation queries are indexed by `habitId` and `userId`
- Add compound index on `completedAt` for date range queries
- Dashboard filtering happens in-memory (fast)
- Cache today's completions to avoid repeated queries

## Security Considerations

- Validate user owns the habit before allowing completion
- Sanitize day selection input (0-6 only)
- Prevent manipulation of completion timestamps
