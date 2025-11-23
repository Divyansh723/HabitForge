<div align="center">
  <img src="logo.png" alt="HabitForge Logo" width="200"/>
  
  # HabitForge
  
  > Transform your habits with gamified tracking, AI coaching, and community support
</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

HabitForge is a modern, full-stack habit tracking application that makes building better habits engaging and rewarding. By combining gamification mechanics, AI-powered insights, and community features, HabitForge helps users stay motivated and accountable on their personal growth journey.

## 🌟 Key Features

### 🎮 Gamification System

- **XP & Leveling**: Earn experience points for completing habits and level up from Beginner to Grandmaster
- **Streak Tracking**: Build momentum with daily streaks and earn bonus XP
- **Achievement Badges**: Unlock special badges at milestone levels (5, 10, 25, 50, 75, 100)
- **Forgiveness Tokens**: Redeem tokens to maintain streaks when life gets in the way
- **Visual Celebrations**: Confetti animations and level-up notifications

### 📊 Advanced Analytics

- **Weekly Summary**: Track perfect days, active days, and completion rates
- **Consistency Calendar**: Visual heatmap of your habit completion history
- **Trend Analysis**: Identify patterns and track progress over time
- **Performance Charts**: Compare habits and see which ones you're crushing
- **Data Export**: Download your data for external analysis

### 🤖 AI-Powered Coaching

- **Personalized Insights**: Get motivational messages tailored to your progress
- **Smart Recommendations**: AI suggests optimal times and strategies
- **Progress Analysis**: Understand what's working and what needs adjustment

### 👥 Community Features

- **Circles**: Join or create accountability groups
- **Challenges**: Participate in time-bound habit challenges
- **Leaderboards**: See how you rank among friends and community
- **Social Sharing**: Celebrate milestones with your circle

### 🎨 User Experience

- **Dark Mode**: Beautiful themes that adapt to your preference
- **Responsive Design**: Seamless experience on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Timezone Support**: Accurate tracking across different timezones
- **Offline Capable**: Track habits even without internet connection

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **MongoDB** (for backend)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Divyansh723/HabitForge.git
   cd HabitForge
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Frontend (.env):

   ```bash
   cp .env.example .env
   ```

   Backend (server/.env):

   ```bash
   cp server/.env.example server/.env
   ```

   Update the `.env` files with your configuration:

   - MongoDB connection string
   - JWT secret
   - API keys (if using AI features)

5. **Start the development servers**

   Terminal 1 (Backend):

   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

```
HabitForge/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── ui/                  # Base UI components (Button, Card, etc.)
│   │   ├── layout/              # Layout components (Header, Sidebar)
│   │   ├── habit/               # Habit-specific components
│   │   ├── gamification/        # XP, levels, badges
│   │   ├── analytics/           # Charts and statistics
│   │   └── community/           # Circles and challenges
│   ├── pages/                   # Page components
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service layer
│   ├── stores/                  # Zustand state management
│   ├── utils/                   # Utility functions
│   ├── types/                   # TypeScript definitions
│   └── contexts/                # React contexts
├── server/                      # Backend source code
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── models/              # MongoDB models
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Express middleware
│   │   ├── services/            # Business logic
│   │   └── utils/               # Helper functions
│   └── tests/                   # Backend tests
├── public/                      # Static assets
└── docs/                        # Documentation
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Date Handling**: date-fns with timezone support

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Validation**: Express Validator
- **API Documentation**: OpenAPI/Swagger (planned)

### DevOps & Tools

- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Documentation**: Storybook
- **Version Control**: Git
- **Deployment**: Render (frontend & backend)

## 🎯 Core Concepts

### Habit Frequency Types

- **Daily**: Track habits that should be done every day
- **Weekly**: Set specific days of the week
- **Custom**: Define your own schedule

### XP & Leveling System

- Base XP: 10 points per habit completion
- Streak Bonus: Up to 50 bonus XP based on streak length
- Progressive Leveling: Each level requires 20% more XP than the previous
- Level Titles: Beginner → Novice → Intermediate → Advanced → Expert → Master → Grandmaster

### Forgiveness System

- Earn tokens at milestone levels (every 10 levels)
- Use tokens to maintain streaks for missed days
- Limited to 3 uses per day
- Only works for daily habits within the last 7 days

### Perfect Days

- A perfect day = completing all daily habits
- Weekly and custom habits don't count toward perfect days
- Tracked in weekly summary analytics

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register        # Create new account
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
GET    /api/auth/me              # Get current user
```

### Habit Endpoints

```
GET    /api/habits               # Get all habits
POST   /api/habits               # Create habit
GET    /api/habits/:id           # Get habit by ID
PUT    /api/habits/:id           # Update habit
DELETE /api/habits/:id           # Delete habit
POST   /api/habits/:id/complete  # Mark habit complete
```

### Analytics Endpoints

```
GET    /api/analytics/overview        # Get overview stats
GET    /api/analytics/weekly-summary  # Get weekly summary
GET    /api/analytics/trends          # Get trend data
GET    /api/analytics/consistency     # Get consistency data
```

### Gamification Endpoints

```
GET    /api/gamification/profile      # Get XP and level info
POST   /api/gamification/forgiveness  # Use forgiveness token
GET    /api/gamification/achievements # Get achievements
```

## 🧪 Testing

Run the test suite:

```bash
# Frontend tests
npm test

# Watch mode
npm run test:watch

# Backend tests
cd server
npm test
```

## 🚢 Deployment

### Frontend (Render Static Site)

1. Connect your GitHub repository to Render
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Backend (Render Web Service)

1. Connect your GitHub repository to Render
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add environment variables (MongoDB URI, JWT secret, etc.)

## 📋 Project Submission

**Complete project documentation, demo, and Amazon Kiro integration details**: [SUBMISSION.md](SUBMISSION.md)

This comprehensive document includes:

- Technical documentation and architecture
- Solution impact and user metrics
- Live demo and code repository
- Video pitch overview
- Proof of Amazon Q Developer / Kiro integration

### 🤖 Built with Amazon Kiro

HabitForge was built entirely using **Amazon Kiro's AI-powered development workflow**. Every feature followed Kiro's systematic 3-step process:

**Requirements → Design → Tasks → Implementation**

![Kiro Workflow](.kiro/specs/images/kiro_use.png)

**Key Benefits:**

- ⚡ 70% faster development
- 🎯 85% first-time-right implementation
- ✅ 100% TypeScript coverage
- 🧪 80%+ test coverage
- 📝 Comprehensive documentation

See [SUBMISSION.md](SUBMISSION.md) for detailed proof of Kiro integration with screenshots and examples.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development workflow
- Coding standards
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern productivity apps and gamification principles
- **Open Source Libraries**: Built on the shoulders of giants
- **Community**: Thanks to all contributors and users

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Divyansh723/HabitForge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Divyansh723/HabitForge/discussions)

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Social features expansion
- [ ] Advanced AI coaching
- [ ] Integration with fitness trackers
- [ ] Habit templates marketplace
- [ ] Team/organization features

---

**Built with ❤️ by the HabitForge Team**
