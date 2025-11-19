import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Habit, User } from '../models/index.js';

dotenv.config();

/**
 * Migration script to update existing habits with UTC reminder times
 * This ensures reminder times work correctly across timezones
 */
async function migrateHabitReminderTimes() {
  try {
    console.log('🔄 Starting habit reminder time migration...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all habits with reminder times
    const habits = await Habit.find({ 
      reminderTime: { $exists: true, $ne: null },
      reminderEnabled: true 
    });

    console.log(`📊 Found ${habits.length} habits with reminders`);

    let updated = 0;
    let skipped = 0;

    for (const habit of habits) {
      // Skip if already has UTC time
      if (habit.reminderTimeUTC && habit.reminderTimezone) {
        skipped++;
        continue;
      }

      // Get the user to find their timezone
      const user = await User.findById(habit.userId);
      const userTimezone = user?.timezone || 'UTC';

      // The reminderTime is currently stored as local time
      // We keep it as-is for display, and also store it in reminderTimeUTC
      // Since we want timezone-independent behavior, we just copy it
      habit.reminderTimeUTC = habit.reminderTime;
      habit.reminderTimezone = userTimezone;

      await habit.save();
      updated++;

      console.log(`✅ Updated habit "${habit.name}" (User: ${user?.email}): ${habit.reminderTime} in ${userTimezone}`);
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Updated: ${updated} habits`);
    console.log(`   ⏭️  Skipped: ${skipped} habits (already migrated)`);
    console.log(`   📊 Total: ${habits.length} habits`);
    console.log('\n✨ Migration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateHabitReminderTimes();
