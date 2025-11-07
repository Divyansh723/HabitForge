# Requirements Document

## Introduction

HabitForge is a gamified habit-tracking application that empowers users to build and break habits through personalized AI coaching, progress visualization, and community accountability. The system transforms habit change into an engaging, rewarding journey using streaks, XP points, levels, and intelligent nudges to sustain long-term motivation.

## Glossary

- **HabitForge_System**: The complete habit-tracking web application including frontend, backend, and AI components
- **User**: An authenticated individual using the application to track habits
- **Guest_User**: An unauthenticated visitor viewing the landing page and public content
- **Landing_Page**: The public homepage showcasing features and encouraging user registration
- **Dashboard**: The main authenticated user interface showing habit overview and daily actions
- **Goals_Page**: Interface for creating, managing, and tracking habit goals and challenges
- **Wellbeing_Page**: Interface focused on mental health insights and habit impact on wellness
- **Analytics_Page**: Detailed statistics and visualizations of habit performance over time
- **Settings_Page**: User profile management, preferences, and account configuration
- **Habit**: A user-defined recurring activity with specified frequency and completion tracking
- **Streak**: Consecutive days of habit completion without missing more than one day
- **XP**: Experience points earned through habit completion and milestone achievements
- **Level**: User progression tier calculated from accumulated XP (every 100 XP = 1 level)
- **AI_Coach**: The intelligent system component that generates personalized motivational messages
- **Completion_Status**: Boolean state indicating whether a habit was completed or missed on a given day
- **User_Timezone**: The timezone selected by the user from a location-based dropdown (e.g., "Asia/Kolkata" for Mumbai, India) used for calculating day boundaries and scheduling reminders
- **Day_Boundary**: The cutoff time (default midnight) that defines when a new day begins for habit tracking
- **Forgiveness_Token**: A grace mechanism allowing users to maintain streaks despite occasional missed days
- **AI_Model**: The external service (AWS Bedrock/OpenAI) that generates personalized coaching messages
- **Notification_Channel**: The delivery method for reminders and messages (push, email, in-app)
- **Challenge**: Time-bound goals (7, 14, or 30 days) that provide bonus rewards upon completion
- **Habit_Template**: Pre-defined habit configurations in the curated library
- **Community_Circle**: Groups of up to 10 users sharing progress and encouragement
- **Animation**: Visual transitions and micro-interactions that enhance user engagement
- **Navigation**: The system for moving between different pages and sections of the application
- **Theme**: Visual appearance mode that can be switched between light and dark variants
- **Component**: Reusable, modular UI element that can be independently developed and maintained
- **Module**: Self-contained code unit with specific functionality that can be easily modified or replaced

## Requirements

### Requirement 1

**User Story:** As a user, I want to create custom habits with specific schedules and reminders, so that I can track activities that matter to my personal goals.

#### Acceptance Criteria

1. THE HabitForge_System SHALL persist habit records with required fields: name (3-50 characters), category, frequency (daily/weekly/custom), reminder_time (local time in User_Timezone), user_id, and created_at timestamp
2. WHEN a User submits a valid habit form, THE HabitForge_System SHALL save the habit to the database and schedule the first reminder using the user's selected User_Timezone
3. WHERE a User selects a Habit_Template from the library, THE HabitForge_System SHALL prefill the form but require explicit user confirmation before saving
4. THE HabitForge_System SHALL validate all required fields and display specific error messages for invalid inputs
5. WHEN the scheduled reminder time occurs, THE HabitForge_System SHALL send notifications via the user's enabled Notification_Channels (push, email, or in-app) with retry logic for failed deliveries

### Requirement 2

**User Story:** As a user, I want to mark my habits as complete or missed each day, so that I can track my consistency and build streaks.

#### Acceptance Criteria

1. THE HabitForge_System SHALL display all active habits with completion buttons for the current day based on the user's User_Timezone
2. WHEN a User marks a habit as complete, THE HabitForge_System SHALL record completion_timestamp (UTC), device_timezone, award 10 XP, and create an audit trail
3. THE HabitForge_System SHALL allow completion marking for the current day and up to 2 previous days in the user's timezone
4. WHEN a User completes a habit on consecutive days within their Day_Boundary, THE HabitForge_System SHALL increment the streak counter by 1
5. IF a User misses a habit for 2 consecutive days without using a Forgiveness_Token, THEN THE HabitForge_System SHALL reset the streak counter to 0 and offer a recovery mini-challenge

### Requirement 3

**User Story:** As a user, I want to see my progress through XP, levels, and streaks, so that I feel motivated to continue my habits.

#### Acceptance Criteria

1. THE HabitForge_System SHALL display the user's current XP total, level, and longest streaks on the main dashboard
2. WHEN a User accumulates 100 XP, THE HabitForge_System SHALL automatically increase their level by 1
3. THE HabitForge_System SHALL calculate and display consistency rates as completed days divided by total days multiplied by 100
4. THE HabitForge_System SHALL show visual progress indicators including XP bars and streak rings
5. WHEN a User reaches a new level, THE HabitForge_System SHALL display a celebration animation

### Requirement 4

**User Story:** As a user, I want to receive personalized AI coaching messages, so that I stay motivated and get helpful suggestions for improving my habits.

#### Acceptance Criteria

1. THE AI_Coach SHALL use the last 7 days of completion logs, average daily XP, streak length, and habit categories as input signals for personalization
2. WHEN a User completes their daily check-in, THE AI_Coach SHALL generate a motivational message using the configured AI_Model (AWS Bedrock/OpenAI) with fallback to canned messages if the service fails
3. THE HabitForge_System SHALL log all AI-generated messages with message_id, model_version, prompt_hash, and user_id for auditing and quality control
4. THE HabitForge_System SHALL allow users to opt out of AI personalization and use generic motivational messages instead
5. THE HabitForge_System SHALL deliver AI coaching messages through the user's preferred Notification_Channels and track engagement rates

### Requirement 5

**User Story:** As a user, I want to participate in challenges and earn badges, so that I have short-term goals to keep me engaged.

#### Acceptance Criteria

1. THE HabitForge_System SHALL offer predefined challenges of 7, 14, and 30-day durations
2. WHEN a User completes all required habits within a challenge timeframe, THE HabitForge_System SHALL award bonus XP and unlock achievement badges
3. THE HabitForge_System SHALL track challenge progress and display completion percentages
4. WHEN a challenge is completed, THE HabitForge_System SHALL award 50 bonus XP and store the badge in the user's profile
5. THE HabitForge_System SHALL allow users to view their earned badges and challenge history

### Requirement 6

**User Story:** As a user, I want to join community circles and share progress with others, so that I have accountability and social support for my habits.

#### Acceptance Criteria

1. THE HabitForge_System SHALL allow users to create or join Community_Circles with a maximum of 10 members and include basic moderation features
2. THE HabitForge_System SHALL display a shared leaderboard showing each member's weekly streak averages with privacy controls
3. THE HabitForge_System SHALL implement rate limiting (maximum 10 messages per user per day) and profanity filtering for community messages
4. THE HabitForge_System SHALL provide reporting mechanisms for inappropriate content and allow users to opt out of leaderboard visibility
5. THE HabitForge_System SHALL update group leaderboards automatically every Sunday and allow users to leave Community_Circles at any time

### Requirement 7

**User Story:** As a user, I want to view detailed analytics of my habit performance, so that I can understand my patterns and make improvements.

#### Acceptance Criteria

1. THE HabitForge_System SHALL display habit completion calendars with visual checkmarks for completed days
2. THE HabitForge_System SHALL calculate and show trend graphs of consistency percentages over 7 and 30-day periods
3. THE HabitForge_System SHALL generate weekly summary cards with automated insights about user performance
4. THE HabitForge_System SHALL show average XP earned per day and total active days
5. THE HabitForge_System SHALL allow users to export their habit data in CSV format

### Requirement 8

**User Story:** As a guest visitor, I want an engaging landing page that explains HabitForge's benefits, so that I understand the value and am motivated to sign up.

#### Acceptance Criteria

1. THE HabitForge_System SHALL display a Landing_Page with compelling hero section, feature highlights, and clear call-to-action buttons
2. THE HabitForge_System SHALL include smooth scroll animations and micro-interactions on the Landing_Page to enhance engagement
3. THE HabitForge_System SHALL provide registration and login forms accessible from the Landing_Page
4. THE HabitForge_System SHALL showcase user testimonials, app screenshots, and key benefits on the Landing_Page
5. THE HabitForge_System SHALL redirect authenticated users from the Landing_Page to the Dashboard

### Requirement 9

**User Story:** As a user, I want secure authentication and account management, so that I can safely access my personal habit data.

#### Acceptance Criteria

1. THE HabitForge_System SHALL provide secure user registration with email verification
2. THE HabitForge_System SHALL authenticate users through secure login with email and password
3. THE HabitForge_System SHALL encrypt all user data at rest using AES-256 encryption
4. THE HabitForge_System SHALL transmit all data over HTTPS with TLS encryption
5. THE HabitForge_System SHALL redirect authenticated users to the Dashboard upon successful login

### Requirement 10

**User Story:** As a user, I want a well-organized multi-page interface with smooth navigation, so that I can easily access different aspects of my habit tracking.

#### Acceptance Criteria

1. THE HabitForge_System SHALL provide a Dashboard page displaying daily habit checklist, current streaks, and quick stats
2. THE HabitForge_System SHALL include a Goals_Page for creating habits, managing challenges, and viewing achievements
3. THE HabitForge_System SHALL offer a Wellbeing_Page showing habit impact on mental health and wellness insights
4. THE HabitForge_System SHALL provide an Analytics_Page with detailed charts, trends, and performance metrics
5. THE HabitForge_System SHALL include a Settings_Page for profile management, notifications, and account preferences

### Requirement 11

**User Story:** As a user, I want smooth animations and intuitive interactions throughout the app, so that using HabitForge feels engaging and enjoyable.

#### Acceptance Criteria

1. THE HabitForge_System SHALL implement smooth page transitions when navigating between sections
2. WHEN a User completes a habit, THE HabitForge_System SHALL display a satisfying completion animation with visual feedback
3. THE HabitForge_System SHALL use hover effects and micro-interactions on buttons and interactive elements
4. WHEN a User levels up or completes a challenge, THE HabitForge_System SHALL show celebratory animations
5. THE HabitForge_System SHALL ensure all animations are performant and do not impact page load times

### Requirement 12

**User Story:** As a user, I want an intuitive and accessible interface design, so that I can easily navigate and use all features regardless of my technical experience.

#### Acceptance Criteria

1. THE HabitForge_System SHALL provide clear visual hierarchy with consistent typography and color schemes
2. THE HabitForge_System SHALL include intuitive icons and labels for all navigation elements and actions
3. THE HabitForge_System SHALL ensure all interactive elements are easily clickable with appropriate sizing
4. THE HabitForge_System SHALL provide helpful tooltips and onboarding guidance for new users
5. THE HabitForge_System SHALL maintain responsive design that works seamlessly across desktop and mobile devices
6. THE HabitForge_System SHALL include a timezone selector in Settings_Page allowing users to choose their location (e.g., "Asia/Kolkata - Mumbai, India") which automatically sets the correct timezone for all habit scheduling and day boundary calculations

### Requirement 13

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the app comfortably in different lighting conditions and match my personal preferences.

#### Acceptance Criteria

1. THE HabitForge_System SHALL provide a theme toggle option accessible from the Settings_Page and main navigation
2. THE HabitForge_System SHALL persist the user's theme preference across sessions and page reloads
3. THE HabitForge_System SHALL apply consistent light and dark color schemes across all pages and components
4. THE HabitForge_System SHALL ensure all text remains readable and accessible in both theme modes
5. THE HabitForge_System SHALL include smooth transitions when switching between themes

### Requirement 14

**User Story:** As a developer, I want a modular and well-organized codebase with proper folder structure, so that the application is maintainable and can be easily extended with new features.

#### Acceptance Criteria

1. THE HabitForge_System SHALL organize code into logical modules with clear separation of concerns
2. THE HabitForge_System SHALL implement reusable Components that can be independently developed and tested
3. THE HabitForge_System SHALL maintain a consistent folder structure with separate directories for components, pages, services, and utilities
4. THE HabitForge_System SHALL use configuration files and environment variables for easy deployment and customization
5. THE HabitForge_System SHALL implement proper error boundaries and logging for debugging and maintenance

### Requirement 15

**User Story:** As a user, I want forgiveness mechanisms and recovery options when I miss habits, so that I stay motivated and don't abandon my habit-building journey after setbacks.

#### Acceptance Criteria

1. THE HabitForge_System SHALL provide each user with 2 Forgiveness_Tokens per month that can prevent streak resets when used within 24 hours of a missed habit
2. WHEN a User's streak would reset due to consecutive missed days, THE HabitForge_System SHALL offer a 3-day recovery mini-challenge to restore motivation
3. THE HabitForge_System SHALL display Forgiveness_Token availability on the Dashboard and allow users to apply them retroactively to recent missed days
4. THE HabitForge_System SHALL use constructive messaging for missed habits, focusing on encouragement rather than punishment
5. THE HabitForge_System SHALL track recovery patterns and adjust AI coaching messages to support users who frequently struggle with consistency

### Requirement 16

**User Story:** As a user, I want data privacy controls and account management options, so that I have control over my personal information.

#### Acceptance Criteria

1. THE HabitForge_System SHALL implement a staged deletion process: immediate soft-delete flag, 30-day retention period, then complete purge including backups and audit logs
2. THE HabitForge_System SHALL require explicit opt-in consent before using user behavior data for AI model training or sharing metrics publicly
3. THE HabitForge_System SHALL allow users to export their complete habit data in CSV format with UTC timestamps and timezone information
4. THE HabitForge_System SHALL provide granular privacy settings to control data sharing with Community_Circles and AI personalization
5. THE HabitForge_System SHALL include account deactivation options with clear status indicators and recovery options within the retention period

### Requirement 17

**User Story:** As a user, I want my habit data, goals, and XP progress to be securely stored and isolated from other users, so that my personal tracking information remains private and accurate.

#### Acceptance Criteria

1. THE HabitForge_System SHALL store all user data in MongoDB with user-specific document isolation using userId as the primary partition key
2. THE HabitForge_System SHALL ensure all habit CRUD operations (create, read, update, delete) are scoped to the authenticated user's userId to prevent cross-user data access
3. THE HabitForge_System SHALL persist XP transactions in the database with full audit trail including source, amount, timestamp, and associated habit or achievement
4. THE HabitForge_System SHALL maintain user-specific gamification data including total XP, current level, forgiveness tokens, and achievement progress in the User document
5. THE HabitForge_System SHALL synchronize all frontend XP calculations with backend database operations to ensure data consistency across sessions and devices

### Requirement 18

**User Story:** As a user, I want my habit completions and XP gains to be immediately reflected in the database, so that my progress is never lost and remains consistent across all my devices.

#### Acceptance Criteria

1. WHEN a User marks a habit as complete, THE HabitForge_System SHALL create a Completion document in MongoDB and update the User's totalXP atomically in a single transaction
2. THE HabitForge_System SHALL create XPTransaction documents for all XP-earning activities including habit completions, streak bonuses, level-up rewards, and achievement unlocks
3. THE HabitForge_System SHALL recalculate and update habit statistics (currentStreak, longestStreak, totalCompletions, consistencyRate) in the database after each completion
4. THE HabitForge_System SHALL update the User's currentLevel automatically when totalXP crosses level thresholds and award level-up bonus XP
5. THE HabitForge_System SHALL ensure all gamification state changes are persisted to MongoDB before sending success responses to the frontend

### Requirement 19

**User Story:** As a user, I want my goals and habit data to be properly organized and queryable in the database, so that analytics and insights can be generated efficiently.

#### Acceptance Criteria

1. THE HabitForge_System SHALL create database indexes on frequently queried fields including userId, habitId, completedAt, and createdAt for optimal performance
2. THE HabitForge_System SHALL store habit completion data with proper date handling to support timezone-aware queries and analytics
3. THE HabitForge_System SHALL maintain referential integrity between User, Habit, Completion, and XPTransaction collections using ObjectId references
4. THE HabitForge_System SHALL support efficient queries for user analytics including completion rates, streak calculations, and XP history over specified date ranges
5. THE HabitForge_System SHALL implement proper data validation at the database level to ensure data integrity and prevent invalid state transitions