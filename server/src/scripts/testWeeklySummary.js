import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Habit, Completion } from '../models/index.js';

dotenv.config();

const testWeeklySummary = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find a test user (you can replace with your actual user ID)
    const testUser = await mongoose.connection.db.collection('users').findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found');
      process.exit(1);
    }

    const userId = testUser._id;
    console.log(`\n📊 Testing weekly summary for user: ${testUser.email}`);

    // Get last 7 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Get user's current active habits count
    const totalHabits = await Habit.countDocuments({ userId, active: true });
    console.log(`\n📋 Total active habits: ${totalHabits}`);

    // Get completions for the week
    const completions = await Completion.find({
      userId,
      completedAt: { $gte: startDate }
    }).populate('habitId', 'name category');

    console.log(`\n✅ Total completions in last 7 days: ${completions.length}`);

    // Calculate daily habit counts (should be empty per our fix)
    const dailyHabitCounts = {}; // Empty - frontend will use totalHabits
    console.log(`\n📅 Daily habit counts: ${JSON.stringify(dailyHabitCounts)} (empty = use totalHabits for all days)`);

    // Group completions by day
    const completionsByDay = {};
    completions.forEach(completion => {
      const dateKey = completion.completedAt.toISOString().split('T')[0];
      if (!completionsByDay[dateKey]) {
        completionsByDay[dateKey] = [];
      }
      completionsByDay[dateKey].push(completion);
    });

    console.log(`\n📊 Daily breakdown:`);
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - (6 - i));
      const dateKey = checkDate.toISOString().split('T')[0];
      const dayCompletions = completionsByDay[dateKey] || [];
      const uniqueHabits = new Set(dayCompletions.map(c => c.habitId.toString())).size;
      const percentage = totalHabits > 0 ? Math.round((uniqueHabits / totalHabits) * 100) : 0;
      const isPerfect = percentage === 100;
      
      console.log(`  ${checkDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}: ${uniqueHabits}/${totalHabits} = ${percentage}% ${isPerfect ? '⭐ PERFECT' : ''}`);
    }

    // Calculate perfect days
    let perfectDays = 0;
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - (6 - i));
      const dateKey = checkDate.toISOString().split('T')[0];
      const dayCompletions = completionsByDay[dateKey] || [];
      const uniqueHabits = new Set(dayCompletions.map(c => c.habitId.toString())).size;
      const percentage = totalHabits > 0 ? Math.round((uniqueHabits / totalHabits) * 100) : 0;
      
      if (percentage === 100 && totalHabits > 0) {
        perfectDays++;
      }
    }

    console.log(`\n⭐ Perfect days this week: ${perfectDays}`);
    console.log(`\n✅ Test complete!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testWeeklySummary();
