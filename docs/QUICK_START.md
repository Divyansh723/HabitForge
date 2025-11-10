# Quick Start Guide

Get up and running with HabitForge in 5 minutes!

---

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed
- Git installed

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/habitforge.git
cd habitforge
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Setup Database

```bash
# Create database
createdb habitforge_dev

# Run migrations
cd server
npm run migrate
cd ..
```

### 4. Configure Environment

```bash
# Copy environment files
cp .env.example .env
cp server/.env.example server/.env
```

Edit `server/.env` with your database credentials:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/habitforge_dev
JWT_SECRET=your-secret-key-here
PORT=8000
```

### 5. Start Development Servers

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend (in new terminal)
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## First Steps

### 1. Create an Account

1. Open http://localhost:5173
2. Click "Get Started"
3. Fill in your details
4. Verify your email (if configured)

### 2. Create Your First Habit

1. Click "Add Habit" on the dashboard
2. Enter habit name (e.g., "Drink 8 glasses of water")
3. Choose frequency: Daily
4. Set a reminder time (optional)
5. Click "Create Habit"

### 3. Complete Your First Habit

1. Find your habit on the dashboard
2. Click the completion button
3. Watch your streak start!
4. Earn your first XP points

### 4. Explore Features

- **Analytics**: View your progress charts
- **Community**: Join or create circles
- **Challenges**: Participate in challenges
- **Insights**: Get AI-powered recommendations
- **Settings**: Customize your experience

---

## Common Commands

```bash
# Start development
npm run dev                    # Frontend
cd server && npm run dev       # Backend

# Run tests
npm test                       # Frontend tests
cd server && npm test          # Backend tests

# Build for production
npm run build                  # Frontend
cd server && npm run build     # Backend

# Database operations
cd server
npm run migrate                # Run migrations
npm run seed                   # Seed data
npm run db:reset               # Reset database
```

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173 (frontend)
npx kill-port 5173

# Kill process on port 8000 (backend)
npx kill-port 8000
```

### Database Connection Error

1. Verify PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Check database exists:
   ```bash
   psql -l | grep habitforge
   ```

3. Verify credentials in `server/.env`

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for server
cd server
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

- Read the [User Guide](./USER_GUIDE.md) for detailed feature explanations
- Check [Features Overview](./FEATURES.md) to see what's possible
- Review [Developer Guide](./DEVELOPER_GUIDE.md) if you want to contribute

---

## Need Help?

- Check [FAQ](./FAQ.md) for common questions
- Review [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Open an issue on GitHub
