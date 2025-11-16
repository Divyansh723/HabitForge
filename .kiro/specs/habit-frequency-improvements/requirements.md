# Habit Frequency Improvements - Requirements

## Introduction

This spec defines improvements to how Daily, Weekly, and Custom habit frequencies work in HabitForge to provide better control over habit completion patterns and prevent multiple completions within the same period.

## Glossary

- **Habit Frequency**: The schedule pattern for when a habit should be completed
- **Completion Window**: The time period during which a habit can be completed once
- **Custom Days**: Specific days of the week selected by the user for custom habits
- **Week Boundary**: Sunday to Saturday period for weekly habit tracking

## Requirements

### Requirement 1: Daily Habit Completion

**User Story:** As a user, I want daily habits to be completable once per day, so that I can track my daily progress accurately.

#### Acceptance Criteria

1. WHEN a user completes a daily habit, THE System SHALL record the completion with the current date
2. WHEN a user views a daily habit that has been completed today, THE System SHALL display it as completed and prevent additional completions
3. WHEN the date changes to a new day, THE System SHALL allow the daily habit to be completed again
4. WHEN calculating streaks for daily habits, THE System SHALL require completion on consecutive days

### Requirement 2: Weekly Habit Completion Restriction

**User Story:** As a user, I want weekly habits to be completable only once per week, so that I don't accidentally complete them multiple times in the same week.

#### Acceptance Criteria

1. WHEN a user completes a weekly habit, THE System SHALL record the completion with the current week identifier
2. WHEN a user views a weekly habit that has been completed this week, THE System SHALL display it as completed and prevent additional completions until the next week
3. WHEN the week boundary is crossed (new Sunday), THE System SHALL allow the weekly habit to be completed again
4. WHEN calculating streaks for weekly habits, THE System SHALL require at least one completion per week
5. WHEN displaying weekly habits on the dashboard, THE System SHALL show "Completed this week" status if already completed

### Requirement 3: Custom Habit Day Selection

**User Story:** As a user, I want to select specific days of the week for custom habits, so that habits only appear on the days I plan to do them.

#### Acceptance Criteria

1. WHEN creating a custom habit, THE System SHALL provide checkboxes for each day of the week (Sunday through Saturday)
2. WHEN a user selects custom days, THE System SHALL require at least one day to be selected
3. WHEN a user views the dashboard on a selected day, THE System SHALL display the custom habit
4. WHEN a user views the dashboard on a non-selected day, THE System SHALL NOT display the custom habit
5. WHEN a user completes a custom habit on a selected day, THE System SHALL prevent additional completions on that same day
6. WHEN the next occurrence of a selected day arrives, THE System SHALL allow the custom habit to be completed again
7. WHEN calculating streaks for custom habits, THE System SHALL only consider the selected days

### Requirement 4: Habit Form UI for Custom Days

**User Story:** As a user, I want an intuitive interface to select days for custom habits, so that I can easily configure my habit schedule.

#### Acceptance Criteria

1. WHEN frequency is set to "custom", THE System SHALL display a day selector interface
2. WHEN displaying the day selector, THE System SHALL show all seven days with checkboxes
3. WHEN a user toggles a day checkbox, THE System SHALL update the selection immediately
4. WHEN saving a custom habit, THE System SHALL validate that at least one day is selected
5. WHEN editing an existing custom habit, THE System SHALL pre-select the previously chosen days

### Requirement 5: Completion Validation

**User Story:** As a system, I want to validate habit completions based on frequency rules, so that users cannot bypass the intended completion restrictions.

#### Acceptance Criteria

1. WHEN a completion request is received for a daily habit, THE System SHALL check if the habit was already completed today
2. WHEN a completion request is received for a weekly habit, THE System SHALL check if the habit was already completed this week
3. WHEN a completion request is received for a custom habit, THE System SHALL check if today is a selected day AND if the habit was already completed today
4. WHEN a completion attempt violates frequency rules, THE System SHALL return an error message explaining the restriction
5. WHEN a completion is valid, THE System SHALL create the completion record and update habit statistics

### Requirement 6: Dashboard Display Logic

**User Story:** As a user, I want to see only the habits that are relevant for today, so that my dashboard is not cluttered with habits I can't complete.

#### Acceptance Criteria

1. WHEN loading the dashboard, THE System SHALL display all active daily habits
2. WHEN loading the dashboard, THE System SHALL display all active weekly habits with their weekly completion status
3. WHEN loading the dashboard, THE System SHALL display only custom habits where today is a selected day
4. WHEN a habit is completed, THE System SHALL update the UI to show completion status
5. WHEN a weekly habit is completed, THE System SHALL show "Completed this week" and disable the completion button

### Requirement 7: Analytics and Streak Calculation

**User Story:** As a user, I want my habit analytics to accurately reflect my completion patterns based on frequency type, so that I can track my progress correctly.

#### Acceptance Criteria

1. WHEN calculating consistency rate for daily habits, THE System SHALL use total days as the denominator
2. WHEN calculating consistency rate for weekly habits, THE System SHALL use total weeks as the denominator
3. WHEN calculating consistency rate for custom habits, THE System SHALL use only selected days as the denominator
4. WHEN calculating streaks for custom habits, THE System SHALL only count selected days in the streak calculation
5. WHEN displaying habit statistics, THE System SHALL show frequency-appropriate metrics

## Non-Functional Requirements

### Performance
- Completion validation SHALL complete within 200ms
- Dashboard loading with frequency filtering SHALL complete within 500ms

### Usability
- Day selection interface SHALL be intuitive and mobile-friendly
- Error messages for invalid completions SHALL be clear and actionable

### Data Integrity
- Completion records SHALL maintain timezone information
- Week boundaries SHALL be calculated consistently across all users
