# Requirements Document

## Introduction

The Key Insights section on the Analytics Overview page is currently empty for users who have started building habits but haven't reached high thresholds. This feature should provide meaningful insights to users at all stages of their habit-building journey, not just advanced users with exceptional stats.

## Glossary

- **Analytics System**: The component responsible for displaying habit statistics and insights
- **Key Insights Section**: The UI component on the Analytics Overview page that displays personalized insights based on user habit data
- **Insight Threshold**: The minimum statistical requirement needed to trigger a specific insight message
- **User**: A person using the HabitForge application to track their habits

## Requirements

### Requirement 1

**User Story:** As a new user who has just started tracking habits, I want to see encouraging insights in the Key Insights section, so that I feel motivated to continue building my habits.

#### Acceptance Criteria

1. WHEN the User has at least one habit completion, THE Analytics System SHALL display at least one insight in the Key Insights section
2. WHEN the User has zero habit completions, THE Analytics System SHALL display an encouraging message to start building habits
3. WHEN the User views the Analytics Overview page, THE Analytics System SHALL calculate insights based on current habit statistics
4. THE Analytics System SHALL display insights with appropriate icons, titles, and descriptions

### Requirement 2

**User Story:** As a user with moderate habit progress, I want to see insights that reflect my current achievement level, so that I receive appropriate recognition for my efforts.

#### Acceptance Criteria

1. WHEN the User has a consistency rate between 50% and 70%, THE Analytics System SHALL display an encouraging insight about their progress
2. WHEN the User has a consistency rate between 70% and 90%, THE Analytics System SHALL display a positive insight about their good performance
3. WHEN the User has a consistency rate of 90% or higher, THE Analytics System SHALL display an exceptional achievement insight
4. WHEN the User has completed at least 10 habits, THE Analytics System SHALL display a milestone insight
5. WHEN the User has a streak of at least 3 days, THE Analytics System SHALL display a streak recognition insight

### Requirement 3

**User Story:** As a user managing multiple habits, I want to see insights about my habit portfolio, so that I understand my overall habit-building approach.

#### Acceptance Criteria

1. WHEN the User has 3 or more active habits, THE Analytics System SHALL display an insight about managing multiple habits
2. WHEN the User has at least one active habit, THE Analytics System SHALL include that habit in the analytics calculations
3. THE Analytics System SHALL filter active habits from inactive habits when calculating insights
4. THE Analytics System SHALL display the total number of active habits in relevant insights

### Requirement 4

**User Story:** As a user at any stage of my habit journey, I want the Key Insights section to always show relevant information, so that the analytics page feels complete and useful.

#### Acceptance Criteria

1. THE Analytics System SHALL never display an empty Key Insights section when habit data exists
2. THE Analytics System SHALL prioritize showing at least 2-3 insights when sufficient data is available
3. THE Analytics System SHALL display insights in order of significance (achievements before general information)
4. WHEN no insights meet the threshold criteria, THE Analytics System SHALL display a default encouraging message with actionable guidance
