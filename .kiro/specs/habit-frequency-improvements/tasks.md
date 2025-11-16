# Implementation Plan

- [x] 1. Backend - Completion Validation Logic
  - Add helper functions to check if habit can be completed based on frequency
  - Implement date/week boundary calculations
  - _Requirements: 1.2, 2.2, 3.5, 5.1, 5.2, 5.3_

- [x] 1.1 Create completion validation utility functions
  - Write `canCompleteToday()` function for daily habits
  - Write `canCompleteThisWeek()` function for weekly habits  
  - Write `isSelectedDay()` and `canCompleteCustom()` for custom habits
  - Add timezone-aware date comparison utilities
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 1.2 Update habit completion endpoint with validation
  - Modify `completeHabit` controller to call validation functions
  - Return appropriate error messages when validation fails
  - Ensure existing completion flow still works for valid attempts
  - _Requirements: 5.4, 5.5_

- [x] 2. Frontend - Day Selector Component
  - Create reusable day selector UI component for custom habits
  - Add validation for at least one day selected
  - _Requirements: 3.1, 3.2, 4.1, 4.2, 4.3_

- [x] 2.1 Create DaySelector component
  - Build checkbox grid for 7 days of the week
  - Implement toggle functionality for day selection
  - Add visual feedback for selected/unselected states
  - Make it mobile-responsive
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 2.2 Integrate DaySelector into HabitForm
  - Show DaySelector when frequency is set to "custom"
  - Wire up state management for selected days
  - Add form validation to require at least one day
  - Pre-populate selected days when editing existing habit
  - _Requirements: 3.1, 3.2, 4.4, 4.5_

- [x] 3. Frontend - Dashboard Filtering
  - Filter custom habits to show only on selected days
  - Update UI to show completion status for weekly habits
  - _Requirements: 2.5, 3.3, 3.4, 6.1, 6.2, 6.3_

- [x] 3.1 Update habit filtering logic in useHabits hook
  - Add function to filter habits by current day of week
  - Filter custom habits to only show on selected days
  - Keep daily and weekly habits always visible
  - _Requirements: 3.3, 3.4, 6.1, 6.2, 6.3_

- [x] 3.2 Update DailyHabitChecklist component
  - Apply filtered habits list
  - Show "Completed this week" badge for weekly habits
  - Update completion button states based on frequency rules
  - _Requirements: 2.5, 6.4, 6.5_

- [x] 4. Frontend - Completion Button Logic
  - Disable completion button for already-completed habits
  - Show appropriate messages for each frequency type
  - _Requirements: 1.2, 2.2, 3.5, 6.4, 6.5_

- [x] 4.1 Update CompletionButton component
  - Check if habit can be completed before allowing click
  - Show disabled state with tooltip/message for completed habits
  - Display frequency-specific messages (daily/weekly/custom)
  - Handle error responses from backend gracefully
  - _Requirements: 1.2, 2.2, 3.5, 6.4, 6.5_

- [x] 5. Backend - Streak Calculation Updates
  - Update streak calculation to respect frequency rules
  - Implement weekly streak logic
  - Implement custom day streak logic
  - _Requirements: 1.4, 2.4, 3.7, 7.1, 7.2, 7.3, 7.4_

- [x] 5.1 Create frequency-aware streak calculation functions
  - Implement `calculateDailyStreak()` (existing logic)
  - Implement `calculateWeeklyStreak()` for consecutive weeks
  - Implement `calculateCustomStreak()` for selected days only
  - Update main streak calculation to route by frequency type
  - _Requirements: 1.4, 2.4, 3.7, 7.4_

- [x] 5.2 Update consistency rate calculations
  - Calculate consistency for daily habits (completions / total days)
  - Calculate consistency for weekly habits (completions / total weeks)
  - Calculate consistency for custom habits (completions / selected days)
  - _Requirements: 7.1, 7.2, 7.3, 7.5_

- [x] 6. Update Habit Model Validation
  - Ensure customFrequency.daysOfWeek is properly validated
  - Remove or deprecate timesPerWeek field
  - _Requirements: 3.1, 3.2_

- [x] 6.1 Update Habit schema validation
  - Add validation for daysOfWeek array (values 0-6 only)
  - Require at least one day when frequency is custom
  - Update API validation middleware
  - _Requirements: 3.1, 3.2, 4.4_

- [x] 7. Error Handling and User Feedback
  - Implement clear error messages for each restriction type
  - Update UI to show why a habit cannot be completed
  - _Requirements: 5.4_

- [x] 7.1 Create error message constants
  - Define user-friendly messages for each validation failure
  - Add messages for daily, weekly, and custom restrictions
  - Include helpful hints about when habit will be available again
  - _Requirements: 5.4_

- [x] 7.2 Update frontend error handling
  - Display backend error messages in UI
  - Show toast notifications for completion failures
  - Update button tooltips with restriction information
  - _Requirements: 5.4, 6.4, 6.5_

- [ ] 8. Testing and Validation
  - Test all three frequency types
  - Verify completion restrictions work correctly
  - Test dashboard filtering
  - Verify streak calculations
  - _Requirements: All_

- [ ] 8.1 Test daily habit restrictions
  - Complete daily habit successfully
  - Attempt to complete again same day (should fail)
  - Verify can complete next day
  - Check streak calculation
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 8.2 Test weekly habit restrictions
  - Complete weekly habit successfully
  - Attempt to complete again same week (should fail)
  - Verify can complete next week
  - Check weekly streak calculation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 8.3 Test custom habit functionality
  - Create custom habit with selected days
  - Verify habit only shows on selected days
  - Complete on selected day successfully
  - Attempt to complete again same day (should fail)
  - Verify doesn't show on non-selected days
  - Check custom streak calculation
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [ ] 8.4 Test habit form day selector
  - Create new custom habit with day selection
  - Edit existing custom habit and change days
  - Verify validation prevents saving with no days selected
  - Test on mobile and desktop
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
