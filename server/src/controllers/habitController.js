import { Habit, Completion } from '../models/index.js';
import XPTransaction from '../models/XPTransaction.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Get all habits for the authenticated user
export const getHabits = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, active, archived } = req.query;

    // Build query
    const query = { userId };
    
    if (category) query.category = category;
    if (active !== undefined) query.active = active === 'true';
    if (archived !== undefined) query.archived = archived === 'true';

    const habits = await Habit.find(query)
      .sort({ createdAt: -1 })
      .populate('completions', null, null, { 
        sort: { completedAt: -1 },
        limit: 30 // Last 30 completions
      });

    res.json({
      success: true,
      data: {
        habits: habits.map(habit => habit.toJSON())
      }
    });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching habits'
    });
  }
};

// Get a specific habit
export const getHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user._id;

    const habit = await Habit.findOne({ _id: habitId, userId })
      .populate('completions', null, null, { 
        sort: { completedAt: -1 },
        limit: 100 
      });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    res.json({
      success: true,
      data: {
        habit: habit.toJSON()
      }
    });
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching habit'
    });
  }
};

// Create a new habit
export const createHabit = async (req, res) => {
  try {
    const userId = req.user._id;
    const habitData = {
      ...req.body,
      userId
    };

    const habit = new Habit(habitData);
    await habit.save();

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: {
        habit: habit.toJSON()
      }
    });
  } catch (error) {
    console.error('Create habit error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating habit'
    });
  }
};

// Update a habit
export const updateHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates.userId;
    delete updates.createdAt;
    delete updates.totalCompletions;
    delete updates.currentStreak;
    delete updates.longestStreak;

    const habit = await Habit.findOneAndUpdate(
      { _id: habitId, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    res.json({
      success: true,
      message: 'Habit updated successfully',
      data: {
        habit: habit.toJSON()
      }
    });
  } catch (error) {
    console.error('Update habit error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating habit'
    });
  }
};

// Delete a habit
export const deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user._id;

    const habit = await Habit.findOneAndDelete({ _id: habitId, userId });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Also delete all completions for this habit
    await Completion.deleteMany({ habitId });

    res.json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting habit'
    });
  }
};

// Archive a habit
export const archiveHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user._id;

    const habit = await Habit.findOne({ _id: habitId, userId });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    await habit.archive();

    res.json({
      success: true,
      message: 'Habit archived successfully',
      data: {
        habit: habit.toJSON()
      }
    });
  } catch (error) {
    console.error('Archive habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while archiving habit'
    });
  }
};

// Calculate level from XP
const calculateLevel = (totalXP) => {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

// Mark habit as complete
export const markComplete = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { habitId } = req.params;
      const userId = req.user._id;
      const { date, timezone, notes, mood, difficulty, duration } = req.body;

      // Verify habit exists and belongs to user
      const habit = await Habit.findOne({ _id: habitId, userId }).session(session);
      if (!habit) {
        throw new Error('Habit not found');
      }

      const completionDate = date ? new Date(date) : new Date();
      const userTimezone = timezone || req.user.timezone || 'UTC';

      // Check if already completed on this date
      const startOfDay = new Date(completionDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(completionDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingCompletion = await Completion.findOne({
        habitId,
        userId,
        completedAt: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }).session(session);

      if (existingCompletion) {
        throw new Error('Habit already completed for this date');
      }

      // Update habit statistics first
      habit.totalCompletions += 1;
      await habit.calculateStreak();
      
      // Calculate consistency rate (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentCompletions = await Completion.countDocuments({
        habitId,
        userId,
        completedAt: { $gte: thirtyDaysAgo }
      }).session(session);
      
      habit.consistencyRate = Math.round((recentCompletions / 30) * 100);
      await habit.save({ session });

      // Calculate XP with bonuses using the updated streak
      let baseXP = 10;
      let streakBonus = 0;
      let multiplier = 1;

      // Streak bonuses based on current streak
      if (habit.currentStreak >= 7) streakBonus += 5;
      if (habit.currentStreak >= 30) streakBonus += 10;
      if (habit.currentStreak >= 100) streakBonus += 20;

      // First completion bonus
      if (habit.totalCompletions === 0) {
        multiplier = 1.5;
      }

      // Difficulty multiplier
      if (difficulty) {
        multiplier *= (difficulty / 3); // Scale difficulty 1-5 to 0.33-1.67
      }

      const totalXP = Math.round((baseXP + streakBonus) * multiplier);

      // Create completion
      const completion = new Completion({
        habitId,
        userId,
        completedAt: completionDate,
        deviceTimezone: userTimezone,
        xpEarned: totalXP,
        notes,
        mood,
        difficulty,
        duration
      });
      await completion.save({ session });

      // Create XP transaction
      const xpTransaction = new XPTransaction({
        userId,
        habitId,
        amount: totalXP,
        source: 'habit_completion',
        description: `Completed ${habit.name}`,
        metadata: {
          streakLength: habit.currentStreak,
          multiplier,
          baseXP,
          streakBonus
        }
      });
      await xpTransaction.save({ session });

      // Update user's XP and level
      const user = await User.findById(userId).session(session);
      const oldLevel = calculateLevel(user.totalXP);
      user.totalXP += totalXP;
      const newLevel = calculateLevel(user.totalXP);
      user.level = newLevel;

      // Award level up bonus if leveled up
      let levelUpBonus = 0;
      if (newLevel > oldLevel) {
        levelUpBonus = newLevel * 10;
        user.totalXP += levelUpBonus;
        
        const levelUpTransaction = new XPTransaction({
          userId,
          amount: levelUpBonus,
          source: 'level_bonus',
          description: `Level ${newLevel} bonus`,
          metadata: { newLevel, oldLevel }
        });
        await levelUpTransaction.save({ session });
      }

      await user.save({ session });

      res.status(201).json({
        success: true,
        message: 'Habit marked as complete',
        data: {
          completion: completion.toJSON(),
          xpEarned: totalXP,
          levelUpBonus,
          newLevel,
          leveledUp: newLevel > oldLevel,
          newTotalXP: user.totalXP
        }
      });
    });
  } catch (error) {
    console.error('Mark complete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while marking habit complete'
    });
  } finally {
    await session.endSession();
  }
};

// Use forgiveness token
export const useForgiveness = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user._id;
    const { date, timezone } = req.body;

    // Check if user has forgiveness tokens
    const user = req.user;
    if (user.forgivenessTokens <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No forgiveness tokens available'
      });
    }

    // Verify habit exists and belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const forgivenessDate = new Date(date);
    const userTimezone = timezone || user.timezone || 'UTC';

    // Check if already completed or forgiven on this date
    const startOfDay = new Date(forgivenessDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(forgivenessDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingCompletion = await Completion.findOne({
      habitId,
      userId,
      completedAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (existingCompletion) {
      return res.status(400).json({
        success: false,
        message: 'Habit already completed or forgiven for this date'
      });
    }

    // Create forgiveness completion
    const completion = new Completion({
      habitId,
      userId,
      completedAt: forgivenessDate,
      deviceTimezone: userTimezone,
      xpEarned: 5, // Less XP for forgiveness
      forgivenessUsed: true,
      editedFlag: true
    });

    await completion.save();

    // Update habit statistics after forgiveness
    habit.totalCompletions += 1;
    await habit.calculateStreak();
    
    // Calculate consistency rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCompletions = await Completion.countDocuments({
      habitId,
      userId,
      completedAt: { $gte: thirtyDaysAgo }
    });
    
    habit.consistencyRate = Math.round((recentCompletions / 30) * 100);
    await habit.save();

    // Decrease user's forgiveness tokens
    user.forgivenessTokens -= 1;
    await user.save();

    res.json({
      success: true,
      message: 'Forgiveness token used successfully',
      data: {
        completion: completion.toJSON(),
        remainingTokens: user.forgivenessTokens
      }
    });
  } catch (error) {
    console.error('Use forgiveness error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while using forgiveness token'
    });
  }
};

// Get habit statistics
export const getHabitStats = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user._id;
    const { period = 'month' } = req.query;

    // Verify habit exists and belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Calculate date range based on period
    let days;
    switch (period) {
      case 'week':
        days = 7;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      default:
        days = 30;
    }

    const stats = await Completion.getStats(userId, habitId, days);

    res.json({
      success: true,
      data: {
        stats: {
          totalCompletions: habit.totalCompletions,
          currentStreak: habit.currentStreak,
          longestStreak: habit.longestStreak,
          consistencyRate: habit.consistencyRate,
          averageXPPerDay: stats.averageXPPerDay || 0,
          totalActiveDays: Math.round(habit.totalCompletions * 1.2),
          periodStats: stats
        }
      }
    });
  } catch (error) {
    console.error('Get habit stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching habit statistics'
    });
  }
};

// Get habit completions
export const getHabitCompletions = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user._id;
    const { days = 30, page = 1, limit = 50 } = req.query;

    // Verify habit exists and belongs to user
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const completions = await Completion.find({
      habitId,
      userId,
      completedAt: { $gte: startDate }
    })
    .sort({ completedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Completion.countDocuments({
      habitId,
      userId,
      completedAt: { $gte: startDate }
    });

    res.json({
      success: true,
      data: {
        completions: completions.map(completion => completion.toJSON()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get habit completions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching habit completions'
    });
  }
};

// Get today's completions
export const getTodayCompletions = async (req, res) => {
  try {
    const userId = req.user._id;
    const timezone = req.user.timezone || 'UTC';

    const completions = await Completion.findTodayCompletions(userId, timezone);
    
    // Return just the habit IDs for compatibility with frontend
    const habitIds = completions.map(completion => completion.habitId.toString());

    res.json({
      success: true,
      data: habitIds
    });
  } catch (error) {
    console.error('Get today completions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching today\'s completions'
    });
  }
};

// Recalculate all habit statistics (utility endpoint)
export const recalculateHabitStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const habits = await Habit.find({ userId });
    
    for (const habit of habits) {
      await habit.recalculateStats();
    }

    res.json({
      success: true,
      message: `Recalculated statistics for ${habits.length} habits`,
      data: {
        habitsUpdated: habits.length
      }
    });
  } catch (error) {
    console.error('Recalculate habit stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while recalculating habit statistics'
    });
  }
};