// Debug script to understand date comparison issue

console.log('🔍 Debugging Date Comparison Logic\n');

// Simulate the scenario
const habitCreatedAt = new Date('2025-11-20T10:30:00.000Z'); // Created on Nov 20 at 10:30 AM
const dayBeforeCreation = new Date('2025-11-19');
dayBeforeCreation.setHours(0, 0, 0, 0);

const dayOfCreation = new Date('2025-11-20');
dayOfCreation.setHours(0, 0, 0, 0);

const dayAfterCreation = new Date('2025-11-21');
dayAfterCreation.setHours(0, 0, 0, 0);

console.log('Habit created at:', habitCreatedAt.toISOString());
console.log('Habit created at (local):', habitCreatedAt.toString());
console.log('');

// Test the logic for each day
const testDays = [
  { name: 'Day Before (Nov 19)', date: dayBeforeCreation, shouldInclude: false },
  { name: 'Day Of (Nov 20)', date: dayOfCreation, shouldInclude: true },
  { name: 'Day After (Nov 21)', date: dayAfterCreation, shouldInclude: true }
];

testDays.forEach(({ name, date, shouldInclude }) => {
  const habitCreatedDate = new Date(habitCreatedAt);
  habitCreatedDate.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  const isIncluded = !(habitCreatedDate > checkDate);
  const status = isIncluded === shouldInclude ? '✅' : '❌';
  
  console.log(`${status} ${name}:`);
  console.log(`   Check Date: ${checkDate.toISOString()}`);
  console.log(`   Habit Created (normalized): ${habitCreatedDate.toISOString()}`);
  console.log(`   habitCreatedDate > checkDate: ${habitCreatedDate > checkDate}`);
  console.log(`   Should Include: ${shouldInclude}, Actually Included: ${isIncluded}`);
  console.log('');
});

console.log('\n📝 Summary:');
console.log('The logic should EXCLUDE habits created AFTER the check date');
console.log('The logic should INCLUDE habits created ON or BEFORE the check date');
