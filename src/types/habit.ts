export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: 'daily' | 'weekly' | 'custom';
  reminderTime?: string;
  reminderEnabled: boolean;
  color: string;
  icon: string;
  active: boolean;
  archived?: boolean;
  createdAt: Date;
  updatedAt: Date;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  consistencyRate: number;
}

export interface Completion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date;
  deviceTimezone: string;
  xpEarned: number;
  notes?: string;
  editedFlag: boolean;
  auditLogId?: string;
  createdAt: Date;
}

export type HabitCategory = 
  | 'health'
  | 'fitness'
  | 'productivity'
  | 'learning'
  | 'mindfulness'
  | 'social'
  | 'creativity'
  | 'finance'
  | 'other';

export interface HabitStats {
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  consistencyRate: number;
  averageXPPerDay: number;
  totalActiveDays: number;
}