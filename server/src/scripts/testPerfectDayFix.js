import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Simple test to verify the dailyHabitCounts logic
const testDailyHabitCounts = () => {
  console.log('🧪 Testing Daily Habit Counts Logic\n');
  
  // Simulate habits with different creation dates
  const allHabits = [
    { 
      _id: '1', 
      name: 'Habit A', 
      createdAt: new Date('2025-11-17'), 
      active: true 
    },
    { 
      _id: '2', 
      name: 'Habit B', 
      createdAt: new Date('2025-11-17'), 
      active: true 
    },
    { 
      _id: '3', 
      name: 'Habit C', 
      createdAt: new Date('2025-11-20'), // Created mid-week
      active: true 
    },
    { 
      _id: '4', 
      name: 'Habit D', 
      createdAt: new Date('2025-11-18'), 
      active: false, // Deactivated
      updatedAt: new Date('2025-11-19') // Deactivated on Nov 19
    }
  ];
  
  // Test date range: Nov 17 - Nov 23 (7 days)
  const startDate = new Date('2025-11-17');
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date('2025-11-23');
  endDate.setHours(23, 59, 59, 999);
  
  const dailyHabitCounts = {};
  const currentDate = new Date(startDate);
  
  console.log('📅 Calculating daily habit counts...\n');
  
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    
    // Count habits that existed on this specific date
    const habitsOnThisDay = allHabits.filter(habit => {
      const habitCreatedDate = new Date(habit.createdAt);
      habitCreatedDate.setHours(0, 0, 0, 0);
      
      // Habit must have been created on or before this date
      if (habitCreatedDate > currentDate) return false;
      
      // If habit is inactive, check if it was deactivated after this date
      if (!habit.active) {
        const habitUpdatedDate = new Date(habit.updatedAt);
        habitUpdatedDate.setHours(0, 0, 0, 0);
        
        // If habit was deactivated before or on this date, don't count it
        if (habitUpdatedDate <= currentDate) return false;
      }
      
      return true;
    });
    
    dailyHabitCounts[dateKey] = habitsOnThisDay.length;
    
    const habitNames = habitsOnThisDay.map(h => h.name).join(', ');
    console.log(`${dateKey}: ${habitsOnThisDay.length} habits (${habitNames})`);
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log('\n✅ Expected Results:');
  console.log('  Nov 17: 3 habits (A, B, D) - D is still active');
  console.log('  Nov 18: 3 habits (A, B, D) - D is still active');
  console.log('  Nov 19: 2 habits (A, B) - D was deactivated on this day');
  console.log('  Nov 20: 3 habits (A, B, C) - C was created on this day');
  console.log('  Nov 21-23: 3 habits (A, B, C)');
  console.log('\n  🔍 Key Test: Nov 19 should have 2 habits (day BEFORE C was created)');
  console.log('  🔍 Key Test: Nov 20 should have 3 habits (day C was created)');
  
  console.log('\n📊 Actual Results:');
  Object.keys(dailyHabitCounts).forEach(date => {
    const isKeyDate = date === '2025-11-19' || date === '2025-11-20';
    const marker = isKeyDate ? ' 👈' : '';
    console.log(`  ${date}: ${dailyHabitCounts[date]} habits${marker}`);
  });
  
  // Verify results
  const expected = {
    '2025-11-17': 3,
    '2025-11-18': 3,
    '2025-11-19': 2, // Day BEFORE C was created (should NOT include C)
    '2025-11-20': 3, // Day C was created (should include C)
    '2025-11-21': 3,
    '2025-11-22': 3,
    '2025-11-23': 3
  };
  
  let allCorrect = true;
  Object.keys(expected).forEach(date => {
    if (dailyHabitCounts[date] !== expected[date]) {
      console.log(`\n❌ FAIL: ${date} expected ${expected[date]}, got ${dailyHabitCounts[date]}`);
      allCorrect = false;
    }
  });
  
  if (allCorrect) {
    console.log('\n✅ All tests passed! The logic is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please review the logic.');
  }
};

// Run the test
testDailyHabitCounts();
