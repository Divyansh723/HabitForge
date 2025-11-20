import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Habit, Completion } from '../models/index.js';

dotenv.config();

const testWeeklyPattern = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a test user (use the first user we find)
    const testHabit = await Habit.findOne({ active: true });
    
    if (!testHabit) {
      console.log('No active habits found. Please create some habits first.');
      process.exit(0);
    }

    const userId = testHabit.userId;
    console.log('\n=== Testing Weekly Pattern Calculation ===');
    console.log('User ID:', userId);

    // Get current week boundaries
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysFromMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    console.log('\nCurrent Week:');
    console.log('Start:', weekStart.toISOString().split('T')[0], '(Monday)');
    console.log('End:', weekEnd.toISOString().split('T')[0], '(Sunday)');

    // Get all active habits for this user
    const habits = await Habit.find({ userId, active: true });
    console.log('\nActive Habits:', habits.length);

    // Get completions for current week
    const completions = await Completion.find({
      userId,
      completedAt: { $gte: weekStart, $lte: weekEnd }
    });

    console.log('Completions this week:', completions.length);

    // Calculate weekly pattern for each habit
    console.log('\n=== Weekly Patterns ===');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (const habit of habits) {
      const habitCompletions = completions.filter(c => 
        c.habitId.toString() === habit._id.toString()
      );

      const weeklyPattern = [0, 0, 0, 0, 0, 0, 0];
      
      habitCompletions.forEach(completion => {
        const completionDate = new Date(completion.completedAt);
        const completionDay = completionDate.getDay();
        const weekIndex = completionDay === 0 ? 6 : completionDay - 1;
        weeklyPattern[weekIndex] = 1;
      });

      console.log(`\n${habit.name} (${habit.category}):`);
      console.log('  Pattern:', weeklyPattern.map((val, idx) => `${days[idx]}:${val}`).join(' '));
      console.log('  Visual: ', weeklyPattern.map((val, idx) => val ? '✓' : '✗').join(' '));
      console.log('  Completions:', habitCompletions.length);
      console.log('  Dates:', habitCompletions.map(c => 
        new Date(c.completedAt).toISOString().split('T')[0]
      ).join(', '));
    }

    console.log('\n=== Test Complete ===\n');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testWeeklyPattern();
