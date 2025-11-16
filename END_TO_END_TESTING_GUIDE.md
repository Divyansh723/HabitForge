# HabitForge - Complete End-to-End Testing Guide

## Overview
This comprehensive testing guide covers all features, UI components, and user flows in HabitForge. Follow these test scenarios to ensure the application works correctly across all functionality.

---

## Pre-Testing Setup

### Environment Setup
1. **Start Backend Server**
   ```bash
   cd server
   npm start
   ```
   - Verify server runs on `http://localhost:8000`
   - Check MongoDB connection is successful

2. **Start Frontend Application**
   ```bash
   npm run dev
   ```
   - Verify app runs on `http://localhost:5173`
   - Check console for any errors

3. **Test Accounts**
   - Create 2-3 test accounts for community features
   - Use different email addresses
   - Note down credentials for testing

---

## 1. Authentication & Onboarding

### 1.1 Landing Page
- [ ] Visit landing page (not logged in)
- [ ] Verify hero section displays with animations
- [ ] Check floating elements animate smoothly
- [ ] Test "Get Started" button navigates to signup
- [ ] Test "Sign In" button opens login modal
- [ ] Verify all navigation links work (Features, Pricing, About, etc.)
- [ ] Test theme toggle (light/dark mode)
- [ ] Check responsive design on mobile (resize browser)

### 1.2 Registration
- [ ] Click "Get Started" or "Sign Up"
- [ ] Test form validation:
  - Empty fields show errors
  - Invalid email format rejected
  - Password requirements enforced (min 8 chars)
  - Passwords must match
- [ ] Register with valid credentials
- [ ] Verify success message appears
- [ ] Check automatic login after registration
- [ ] Verify redirect to dashboard

### 1.3 Login
- [ ] Click "Sign In"
- [ ] Test form validation (empty fields)
- [ ] Login with incorrect credentials (verify error)
- [ ] Login with correct credentials
- [ ] Verify redirect to dashboard
- [ ] Check "Remember Me" functionality
- [ ] Test logout and re-login

---

## 2. Dashboard & Navigation

### 2.1 Dashboard Overview
- [ ] Verify dashboard loads after login
- [ ] Check all sections render:
  - Daily habit checklist
  - XP bar and level badge
  - Streak displays
  - Daily motivation quote
  - Quick stats
- [ ] Test navigation menu (all links work)
- [ ] Verify notification bell appears
- [ ] Check user profile dropdown works

### 2.2 Navigation Bar
- [ ] Test all main navigation items:
  - Dashboard
  - Analytics
  - Goals/Challenges
  - Wellbeing
  - Insights (AI)
  - Community
  - Settings
- [ ] Verify active page is highlighted
- [ ] Test mobile menu (hamburger icon)
- [ ] Check theme toggle in navbar
- [ ] Test notification bell click

---

## 3. Habit Management

### 3.1 Create Habit
- [ ] Click "Add Habit" or "+" button
- [ ] Fill in habit details:
  - Name (required)
  - Description
  - Category selection
  - Icon picker
  - Color picker
- [ ] Set frequency:
  - Daily
  - Custom days (select specific days)
  - Weekly
- [ ] Configure reminder:
  - Enable/disable toggle
  - Set time
  - Test timezone selection
- [ ] Save habit
- [ ] Verify habit appears in list
- [ ] Check habit card displays correctly

### 3.2 Edit Habit
- [ ] Click edit icon on habit card
- [ ] Modify habit details
- [ ] Change frequency settings
- [ ] Update reminder time
- [ ] Save changes
- [ ] Verify updates reflect immediately
- [ ] Test cancel button (no changes saved)

### 3.3 Complete Habit
- [ ] Click checkbox/complete button on habit
- [ ] Verify completion animation plays
- [ ] Check XP gained notification
- [ ] Verify streak updates
- [ ] Test confetti animation
- [ ] Complete same habit again (should show already completed)
- [ ] Check level-up modal if threshold reached

### 3.4 Habit Frequency Testing
- [ ] Create daily habit - verify shows every day
- [ ] Create custom frequency habit (Mon, Wed, Fri)
  - Check it only shows on selected days
  - Verify hidden on other days
- [ ] Test "Perfect Day" challenge visibility
- [ ] Complete all daily habits - verify Perfect Day completion

### 3.5 Delete Habit
- [ ] Click delete icon on habit card
- [ ] Verify confirmation dialog appears
- [ ] Test cancel (habit not deleted)
- [ ] Confirm deletion
- [ ] Verify habit removed from list
- [ ] Check associated data cleaned up

### 3.6 Habit Sections
- [ ] Verify habits grouped by:
  - Today's Habits
  - Upcoming Habits
  - Completed Habits
- [ ] Test section collapse/expand
- [ ] Check scroll behavior in each section
- [ ] Verify empty states display correctly

---

## 4. Gamification System

### 4.1 XP & Leveling
- [ ] Complete habits to earn XP
- [ ] Verify XP bar updates in real-time
- [ ] Check XP amount shown (+10 XP, etc.)
- [ ] Test streak bonus XP (increases with streak)
- [ ] Reach level-up threshold
- [ ] Verify celebration modal appears
- [ ] Check rewards listed in modal
- [ ] Test "Claim Rewards" button
- [ ] Verify level badge updates
- [ ] Check level title changes (Beginner → Novice → etc.)

### 4.2 Level Badge Display
- [ ] Check level badge on dashboard
- [ ] Test different variants:
  - Minimal (compact display)
  - Detailed (with progress bar)
- [ ] Verify progress percentage accurate
- [ ] Check milestone indicators (every 5 levels)
- [ ] Test hover animations
- [ ] Verify color changes by level tier

### 4.3 Streaks
- [ ] Complete habit daily to build streak
- [ ] Verify streak counter increases
- [ ] Check streak display shows:
  - Current streak
  - Longest streak
  - Streak emoji changes
- [ ] Miss a day - verify streak breaks
- [ ] Test streak milestone celebrations (7, 14, 30 days)

### 4.4 Forgiveness Tokens
- [ ] Check forgiveness token card on dashboard
- [ ] Verify 2 tokens available per month
- [ ] Miss a habit completion
- [ ] Use forgiveness token within 24 hours
- [ ] Verify streak maintained
- [ ] Check token count decreases
- [ ] Test token usage modal
- [ ] Verify tokens reset monthly

### 4.5 Achievements & Badges
- [ ] View achievements page
- [ ] Check unlocked badges display
- [ ] Verify locked badges shown as grayed out
- [ ] Test badge rarity indicators
- [ ] Unlock new badge - verify notification
- [ ] Check badge collection grid

---

## 5. Challenges

### 5.1 Browse Challenges
- [ ] Navigate to Goals/Challenges page
- [ ] View available challenges list
- [ ] Check challenge cards show:
  - Title and description
  - Duration
  - XP reward
  - Difficulty level
  - Requirements
- [ ] Test filter/sort options
- [ ] Verify challenge icons display

### 5.2 Join Challenge
- [ ] Click "Join Challenge" button
- [ ] Review challenge details modal
- [ ] Confirm participation
- [ ] Verify challenge added to active list
- [ ] Check progress tracking starts
- [ ] Test challenge requirements display

### 5.3 Challenge Progress
- [ ] Complete habits that count toward challenge
- [ ] Verify progress bar updates
- [ ] Check progress percentage accurate
- [ ] Test progress notifications
- [ ] View detailed progress breakdown
- [ ] Check days remaining counter

### 5.4 Complete Challenge
- [ ] Meet all challenge requirements
- [ ] Verify completion modal appears
- [ ] Check XP reward granted
- [ ] Test celebration animation
- [ ] View completion statistics
- [ ] Test "Join Again" option
- [ ] Verify challenge moves to history

### 5.5 Challenge History
- [ ] View completed challenges
- [ ] Check completion dates
- [ ] Verify final scores displayed
- [ ] Test history filtering
- [ ] Check challenge badges earned

### 5.6 Community Challenges
- [ ] Create community challenge (if admin)
- [ ] Set challenge parameters
- [ ] Invite circle members
- [ ] Track participant progress
- [ ] View leaderboard
- [ ] Test challenge announcements

---

## 6. Analytics & Insights

### 6.1 Analytics Dashboard
- [ ] Navigate to Analytics page
- [ ] Verify all charts load:
  - Consistency calendar
  - Trend graphs
  - Progress rings
  - Weekly summary
- [ ] Test date range selector
- [ ] Check data accuracy
- [ ] Test chart interactions (hover, click)

### 6.2 Consistency Calendar
- [ ] View monthly calendar
- [ ] Check completion days highlighted
- [ ] Verify streak visualization
- [ ] Test month navigation
- [ ] Check today indicator
- [ ] Test hover tooltips

### 6.3 Habit Performance
- [ ] View individual habit analytics
- [ ] Check completion rate
- [ ] Verify streak history
- [ ] Test performance trends
- [ ] Check best/worst days analysis

### 6.4 Data Export
- [ ] Click "Export Data" button
- [ ] Select export format (CSV/JSON)
- [ ] Choose date range
- [ ] Download export file
- [ ] Verify file contents accurate
- [ ] Test different export options

---

## 7. Wellbeing Features

### 7.1 Mood Tracking
- [ ] Navigate to Wellbeing page
- [ ] Log daily mood entry
- [ ] Select mood level (1-5)
- [ ] Add optional notes
- [ ] Save mood entry
- [ ] View mood history
- [ ] Check mood trends graph

### 7.2 Mood-Habit Correlation
- [ ] View correlation analysis
- [ ] Check which habits improve mood
- [ ] Verify statistical insights
- [ ] Test correlation charts
- [ ] Check best/worst mood days
- [ ] View habit impact scores

### 7.3 Wellbeing Insights
- [ ] View wellbeing dashboard
- [ ] Check overall wellbeing score
- [ ] Verify recommendations display
- [ ] Test insight cards
- [ ] Check trend analysis
- [ ] View historical data

---

## 8. AI Coaching & Insights

### 8.1 AI Permissions
- [ ] Navigate to Settings → Privacy
- [ ] Check AI coaching toggle
- [ ] Disable AI features
- [ ] Verify AI sections hidden
- [ ] Re-enable AI features
- [ ] Check AI sections reappear

### 8.2 Habit Suggestions
- [ ] View AI habit suggestions
- [ ] Check personalized recommendations
- [ ] Test "Add Habit" from suggestion
- [ ] Verify suggestion quality
- [ ] Dismiss suggestions
- [ ] Check new suggestions appear

### 8.3 Pattern Analysis
- [ ] View AI pattern analysis
- [ ] Check identified patterns
- [ ] Verify insights accuracy
- [ ] Test pattern visualizations
- [ ] Check actionable recommendations

### 8.4 Motivational Coach
- [ ] View motivational messages
- [ ] Check personalization
- [ ] Verify message relevance
- [ ] Test message refresh
- [ ] Check encouragement timing

### 8.5 Personalized Recommendations
- [ ] View recommendation dashboard
- [ ] Check habit optimization tips
- [ ] Verify timing suggestions
- [ ] Test recommendation actions
- [ ] Check success predictions

---

## 9. Community Features

### 9.1 Community Settings
- [ ] Navigate to Settings → Privacy
- [ ] Check community features toggle
- [ ] Disable community
- [ ] Verify community sections hidden
- [ ] Re-enable community
- [ ] Check community access restored

### 9.2 Create Circle
- [ ] Navigate to Community page
- [ ] Click "Create Circle"
- [ ] Fill in circle details:
  - Name
  - Description
  - Privacy setting (public/private)
- [ ] Set member limit
- [ ] Create circle
- [ ] Verify circle appears in list

### 9.3 Join Circle
- [ ] Browse available circles
- [ ] View circle details
- [ ] Request to join (private) or join (public)
- [ ] Verify membership status
- [ ] Check circle appears in "My Circles"

### 9.4 Circle Management (Admin)
- [ ] View circle settings
- [ ] Edit circle details
- [ ] Manage members:
  - Approve join requests
  - Remove members
  - Promote to admin
- [ ] Post announcements
- [ ] Create circle challenges
- [ ] Test moderation tools

### 9.5 Circle Leaderboard
- [ ] View circle leaderboard
- [ ] Check member rankings
- [ ] Verify XP totals accurate
- [ ] Test leaderboard updates
- [ ] Check your position highlighted

### 9.6 Circle Challenges
- [ ] View circle challenges
- [ ] Join circle challenge
- [ ] Track progress
- [ ] View participant list
- [ ] Check challenge leaderboard
- [ ] Complete challenge

### 9.7 Announcements
- [ ] View circle announcements
- [ ] Create announcement (if admin)
- [ ] Edit announcement
- [ ] Delete announcement
- [ ] Check announcement notifications
- [ ] Test profanity filter

---

## 10. Notifications

### 10.1 Notification Bell
- [ ] Click notification bell icon
- [ ] View notification dropdown
- [ ] Check unread count badge
- [ ] Verify recent notifications display
- [ ] Test "View All" link

### 10.2 Notification Types
- [ ] Habit reminder notifications
- [ ] Level-up notifications
- [ ] Challenge completion notifications
- [ ] Community notifications
- [ ] Streak milestone notifications
- [ ] Forgiveness token notifications

### 10.3 Notification Management
- [ ] Navigate to Notifications page
- [ ] View all notifications
- [ ] Mark individual as read
- [ ] Mark all as read
- [ ] Delete notification
- [ ] Delete all read
- [ ] Test notification filters:
  - All
  - Unread
  - By type

### 10.4 Notification Settings
- [ ] Navigate to Settings → Notifications
- [ ] Toggle notification types:
  - Habit reminders
  - Achievements
  - Community updates
  - Challenges
- [ ] Set quiet hours
- [ ] Test email notifications (if enabled)
- [ ] Save preferences
- [ ] Verify settings persist

---

## 11. Settings & Preferences

### 11.1 Profile Settings
- [ ] Navigate to Settings → Profile
- [ ] Update profile information:
  - Name
  - Email
  - Timezone
- [ ] Upload profile picture
- [ ] Save changes
- [ ] Verify updates reflect across app

### 11.2 Notification Preferences
- [ ] Configure notification settings
- [ ] Test each notification type toggle
- [ ] Set reminder times
- [ ] Configure quiet hours
- [ ] Test notification delivery

### 11.3 Privacy Settings
- [ ] Toggle AI coaching
- [ ] Toggle community features
- [ ] Configure data sharing
- [ ] Test privacy controls
- [ ] Verify feature visibility changes

### 11.4 Accent Color
- [ ] Navigate to Settings → Appearance
- [ ] View accent color picker
- [ ] Select different colors
- [ ] Verify UI updates in real-time
- [ ] Test preset colors
- [ ] Test custom color input
- [ ] Save color preference
- [ ] Check persistence across sessions

### 11.5 Theme Settings
- [ ] Toggle dark/light mode
- [ ] Verify theme applies globally
- [ ] Check all pages respect theme
- [ ] Test theme persistence
- [ ] Check contrast and readability

### 11.6 Account Management
- [ ] Change password
- [ ] Update email
- [ ] Export account data
- [ ] Test account deletion (use test account)
- [ ] Verify data cleanup

---

## 12. Responsive Design & Mobile

### 12.1 Mobile Layout
- [ ] Resize browser to mobile width (< 768px)
- [ ] Check hamburger menu appears
- [ ] Test mobile navigation
- [ ] Verify all pages responsive
- [ ] Check touch interactions work
- [ ] Test swipe gestures (if any)

### 12.2 Tablet Layout
- [ ] Resize to tablet width (768px - 1024px)
- [ ] Check layout adapts
- [ ] Verify navigation appropriate
- [ ] Test all features work
- [ ] Check touch targets adequate

### 12.3 Mobile-Specific Features
- [ ] Test habit completion on mobile
- [ ] Check modal displays correctly
- [ ] Verify forms usable
- [ ] Test scrolling behavior
- [ ] Check fixed elements (navbar, etc.)

---

## 13. Performance & UX

### 13.1 Loading States
- [ ] Check loading spinners appear
- [ ] Verify skeleton screens (if any)
- [ ] Test loading indicators
- [ ] Check error states
- [ ] Verify empty states

### 13.2 Animations
- [ ] Habit completion animations
- [ ] Level-up celebrations
- [ ] Confetti effects
- [ ] Page transitions
- [ ] Hover effects
- [ ] Loading animations

### 13.3 Error Handling
- [ ] Test with network offline
- [ ] Verify error messages clear
- [ ] Check retry mechanisms
- [ ] Test form validation errors
- [ ] Verify API error handling

### 13.4 Performance
- [ ] Check page load times
- [ ] Test with many habits (20+)
- [ ] Verify smooth scrolling
- [ ] Check animation performance
- [ ] Test with slow network (throttle)

---

## 14. Edge Cases & Stress Testing

### 14.1 Data Limits
- [ ] Create maximum habits (test limit)
- [ ] Join multiple challenges
- [ ] Create long habit names
- [ ] Test special characters in inputs
- [ ] Test emoji in text fields

### 14.2 Timing Edge Cases
- [ ] Complete habit at midnight
- [ ] Test timezone changes
- [ ] Check date boundary handling
- [ ] Test streak calculation at day change
- [ ] Verify reminder timing accuracy

### 14.3 Concurrent Actions
- [ ] Complete multiple habits quickly
- [ ] Join multiple challenges simultaneously
- [ ] Test rapid navigation
- [ ] Check data consistency

### 14.4 Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Check mobile browsers

---

## 15. Security Testing

### 15.1 Authentication
- [ ] Test session expiration
- [ ] Verify logout clears session
- [ ] Test protected routes (redirect if not logged in)
- [ ] Check token refresh
- [ ] Test concurrent sessions

### 15.2 Authorization
- [ ] Test accessing other users' data
- [ ] Verify admin-only features protected
- [ ] Check circle privacy enforcement
- [ ] Test API endpoint protection

### 15.3 Input Validation
- [ ] Test XSS prevention
- [ ] Check SQL injection protection
- [ ] Verify input sanitization
- [ ] Test file upload security (if any)

---

## 16. Integration Testing

### 16.1 Full User Journey
1. [ ] Register new account
2. [ ] Create 3 habits
3. [ ] Complete habits for 3 days
4. [ ] Level up
5. [ ] Join a challenge
6. [ ] Complete challenge
7. [ ] Join community circle
8. [ ] Track mood for a week
9. [ ] View analytics
10. [ ] Export data
11. [ ] Update settings
12. [ ] Logout and login

### 16.2 Multi-User Scenarios
- [ ] Create circle with User A
- [ ] Join circle with User B
- [ ] Post announcement as User A
- [ ] View as User B
- [ ] Create community challenge
- [ ] Both users participate
- [ ] Check leaderboard updates

---

## 17. Accessibility Testing

### 17.1 Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Test Enter/Space for buttons
- [ ] Check Escape closes modals
- [ ] Verify focus indicators visible
- [ ] Test keyboard shortcuts (if any)

### 17.2 Screen Reader
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Check ARIA labels present
- [ ] Verify semantic HTML
- [ ] Test form labels
- [ ] Check image alt text

### 17.3 Visual Accessibility
- [ ] Check color contrast ratios
- [ ] Test with high contrast mode
- [ ] Verify text scaling works
- [ ] Check focus indicators
- [ ] Test with reduced motion

---

## 18. Bug Reporting Template

When you find a bug, document it with:

```
**Bug Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Environment:**
- Browser: 
- OS: 
- Screen size: 
- User account: 

**Screenshots/Videos:**
[Attach if applicable]

**Console Errors:**
[Copy any errors from browser console]
```

---

## 19. Test Completion Checklist

### Core Features
- [ ] Authentication works completely
- [ ] Habit CRUD operations functional
- [ ] Gamification system accurate
- [ ] Challenges work end-to-end
- [ ] Analytics display correctly
- [ ] Notifications deliver properly

### Advanced Features
- [ ] AI features functional (if enabled)
- [ ] Community features work
- [ ] Wellbeing tracking accurate
- [ ] Data export successful
- [ ] Settings persist correctly

### Quality Checks
- [ ] No console errors
- [ ] Responsive on all devices
- [ ] Animations smooth
- [ ] Loading states appropriate
- [ ] Error handling graceful
- [ ] Performance acceptable

### Security & Privacy
- [ ] Authentication secure
- [ ] Authorization enforced
- [ ] Privacy settings respected
- [ ] Data protected

---

## 20. Post-Testing Actions

### If All Tests Pass
1. Document test results
2. Create test report
3. Mark build as ready for deployment
4. Notify stakeholders

### If Issues Found
1. Document all bugs
2. Prioritize by severity
3. Create bug tickets
4. Assign to developers
5. Retest after fixes

---

## Quick Test Scenarios (30-Minute Smoke Test)

For quick validation, run these critical paths:

1. **Auth Flow** (5 min)
   - Register → Login → Logout → Login

2. **Habit Management** (10 min)
   - Create habit → Complete → Edit → Delete

3. **Gamification** (5 min)
   - Complete habits → Check XP → Verify level

4. **Challenges** (5 min)
   - Join challenge → Track progress

5. **Settings** (5 min)
   - Update profile → Change theme → Test notifications

---

## Notes

- Test with fresh data periodically
- Clear browser cache between major test runs
- Use different browsers for comprehensive testing
- Test with real-world usage patterns
- Document any unexpected behavior
- Take screenshots of UI issues
- Note performance bottlenecks

---

## Support

If you encounter issues during testing:
- Check browser console for errors
- Review network tab for API failures
- Check server logs
- Verify environment variables
- Ensure database is running
- Confirm all dependencies installed

---

**Last Updated:** [Current Date]
**Tested By:** [Your Name]
**Version:** [App Version]
