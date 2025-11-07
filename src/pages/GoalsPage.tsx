import React, { useState } from 'react';
import { Plus, Target, Trophy, Search, Star } from 'lucide-react';
import { Card, Button, Badge, Input, Select } from '@/components/ui';
import { HabitForm, HabitCard } from '@/components/habit';
import { ChallengeList, AchievementGrid } from '@/components/gamification';
import { useHabits } from '@/hooks/useHabits';
import { useGamification } from '@/hooks/useGamification';

import { cn } from '@/utils/cn';
import type { Habit } from '@/types/habit';

type TabType = 'habits' | 'challenges' | 'achievements';
type HabitFilter = 'all' | 'active' | 'paused' | 'completed';

const GoalsPage: React.FC = () => {
  const { habits, createHabit, updateHabit, deleteHabit } = useHabits();
  const { 
    achievements, 
    achievementsLoading,
    challenges, 
    challengeParticipations, 
    challengesLoading,
    joinChallenge,
    leaveChallenge
  } = useGamification();

  const [activeTab, setActiveTab] = useState<TabType>('habits');
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitFilter, setHabitFilter] = useState<HabitFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter habits based on current filter and search
  const filteredHabits = habits.filter(habit => {
    const matchesFilter = habitFilter === 'all' ||
      (habitFilter === 'active' && habit.active) ||
      (habitFilter === 'paused' && !habit.active) ||
      (habitFilter === 'completed' && habit.archived);

    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      habit.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCreateHabit = async (habitData: any) => {
    try {
      console.log('GoalsPage: Creating habit with data:', habitData);
      const result = await createHabit(habitData);
      console.log('GoalsPage: Habit created successfully:', result);
      setShowHabitForm(false);
    } catch (error) {
      console.error('GoalsPage: Failed to create habit:', error);
    }
  };

  const handleEditHabit = async (habitData: any) => {
    if (editingHabit) {
      try {
        await updateHabit(editingHabit.id, habitData);
        setEditingHabit(null);
        setShowHabitForm(false);
      } catch (error) {
        console.error('Failed to update habit:', error);
      }
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      console.log('GoalsPage: Deleting habit with ID:', habitId);
      await deleteHabit(habitId);
      console.log('GoalsPage: Habit deleted successfully');
    } catch (error) {
      console.error('GoalsPage: Failed to delete habit:', error);
    }
  };

  const tabs = [
    { id: 'habits', label: 'My Habits', icon: Target, count: habits.length },
    { id: 'challenges', label: 'Challenges', icon: Trophy, count: challenges.length },
    { id: 'achievements', label: 'Achievements', icon: Star, count: achievements.filter((a: any) => a.unlocked).length }
  ];

  const habitFilterOptions = [
    { value: 'all', label: 'All Habits' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Target className="h-8 w-8" />
              Goals & Challenges
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your habits, join challenges, and track achievements
            </p>
          </div>

          {activeTab === 'habits' && (
            <Button
              onClick={() => {
                setEditingHabit(null);
                setShowHabitForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Habit
            </Button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    isActive
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge variant="secondary" size="sm">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'habits' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search habits..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Select
                  value={habitFilter}
                  onChange={(e) => setHabitFilter(e.target.value as HabitFilter)}
                  options={habitFilterOptions}
                />
              </div>
            </div>

            {/* Habits Grid */}
            {filteredHabits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onEdit={(habit: Habit) => {
                      setEditingHabit(habit);
                      setShowHabitForm(true);
                    }}
                    onDelete={() => handleDeleteHabit(habit.id)}
                    showActions
                    variant="detailed"
                    showStreakAnimation
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchQuery || habitFilter !== 'all' ? 'No habits found' : 'No habits yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {searchQuery || habitFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Create your first habit to start building better routines.'
                    }
                  </p>
                  {(!searchQuery && habitFilter === 'all') && (
                    <Button
                      onClick={() => {
                        setEditingHabit(null);
                        setShowHabitForm(true);
                      }}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <Plus className="h-4 w-4" />
                      Create Your First Habit
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            {habits.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {habits.filter((h: Habit) => h.active).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Active Habits
                  </div>
                </Card>
                <Card className="text-center">
                  <div className="text-2xl font-bold text-success-600 dark:text-success-400 mb-1">
                    {Math.round(habits.reduce((acc: number, h: Habit) => acc + h.consistencyRate, 0) / habits.length)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Average Consistency
                  </div>
                </Card>
                <Card className="text-center">
                  <div className="text-2xl font-bold text-warning-600 dark:text-warning-400 mb-1">
                    {Math.max(...habits.map((h: Habit) => h.currentStreak), 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Longest Streak
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Available Challenges
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Join time-bound challenges to earn bonus XP and achievements
                </p>
              </div>
            </div>

            <ChallengeList 
              challenges={challenges}
              participations={challengeParticipations}
              onJoinChallenge={joinChallenge}
              onLeaveChallenge={leaveChallenge}
              isLoading={challengesLoading}
            />
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Your Achievements
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Unlock badges and milestones as you build consistent habits
                </p>
              </div>
            </div>

            {achievementsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading achievements...</p>
                </div>
              </div>
            ) : (
              <AchievementGrid 
                achievements={achievements}
                unlockedAchievements={achievements.filter((a: any) => a.unlockedAt).map((a: any) => a.id)}
              />
            )}
          </div>
        )}

        {/* Habit Form Modal */}
        {showHabitForm && (
          <HabitForm
            isOpen={showHabitForm}
            habit={editingHabit}
            onSubmit={editingHabit ? handleEditHabit : handleCreateHabit}
            onClose={() => {
              setShowHabitForm(false);
              setEditingHabit(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GoalsPage;