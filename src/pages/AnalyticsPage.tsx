import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Award, Clock, Download } from 'lucide-react';
import { Card, Badge, Button, Select } from '@/components/ui';
import { 
  ProgressRing, 
  ConsistencyCalendar, 
  TrendGraph, 
  WeeklySummary,
  HabitPerformanceChart,
  DataExport
} from '@/components/analytics';
import { XPBar, LevelBadge } from '@/components/gamification';
import { useHabits } from '@/hooks/useHabits';
import { useGamification } from '@/hooks/useGamification';
import { useAnalytics } from '@/hooks/useAnalytics';
import { type Completion } from '@/types/habit';
import { cn } from '@/utils/cn';
import ErrorBoundary from '@/components/ErrorBoundary';

type ViewType = 'overview' | 'performance' | 'trends' | 'export';

const AnalyticsPage: React.FC = () => {
  const habitsHook = useHabits();
  const habits = habitsHook?.habits || [];
  const getTotalStats = habitsHook?.getTotalStats || (() => ({ 
    averageConsistency: 0, 
    longestStreak: 0, 
    totalCompletions: 0 
  }));
  const getHabitCompletions = habitsHook?.getHabitCompletions || (() => Promise.resolve([]));
  const gamification = useGamification();
  const totalXP = gamification?.totalXP || 0;
  const forgivenessTokensFromStore = gamification?.forgivenessTokens || 0;
  const getLevelInfo = gamification?.getLevelInfo || (() => ({ currentLevel: 1, xpForCurrentLevel: 0, xpForNextLevel: 100, progressPercentage: 0 }));
  const analyticsHook = useAnalytics();
  const trendData = analyticsHook?.trendData || [];
  const weeklySummary = analyticsHook?.weeklySummary || null;
  const fetchTrendData = analyticsHook?.fetchTrendData || (() => Promise.resolve());
  const fetchWeeklySummary = analyticsHook?.fetchWeeklySummary || (() => Promise.resolve());
  const fetchConsistencyData = analyticsHook?.fetchConsistencyData || (() => Promise.resolve());
  const fetchHabitPerformance = analyticsHook?.fetchHabitPerformance || (() => Promise.resolve());
  
  // Check URL params for tab
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab') as ViewType | null;
  
  const [activeView, setActiveView] = useState<ViewType>(tabParam || 'overview');
  const [timeRange, setTimeRange] = useState('30');
  const [selectedHabit, setSelectedHabit] = useState('all');
  const [allCompletions, setAllCompletions] = useState<Completion[]>([]);
  
  // Use forgiveness tokens from gamification store
  const forgivenessTokens = forgivenessTokensFromStore;

  // Get stats - filter by selected habit if not 'all'
  const stats = selectedHabit === 'all' 
    ? getTotalStats() 
    : (() => {
        const habit = habits.find(h => h.id === selectedHabit);
        return habit ? {
          averageConsistency: habit.consistencyRate,
          longestStreak: habit.longestStreak,
          totalCompletions: habit.totalCompletions
        } : { averageConsistency: 0, longestStreak: 0, totalCompletions: 0 };
      })();
  
  const levelInfo = getLevelInfo();
  
  // Filter weekly summary by selected habit
  const filteredWeeklySummary = selectedHabit === 'all' || !weeklySummary
    ? weeklySummary
    : {
        ...weeklySummary,
        completions: weeklySummary.completions.filter(c => c.habitId === selectedHabit),
        totalHabits: 1 // Only counting the selected habit
      };
  
  // Calculate filtered trend data for selected habit
  const filteredTrendData = React.useMemo(() => {
    if (selectedHabit === 'all' || !trendData || trendData.length === 0) {
      return trendData;
    }
    
    // Calculate completion rate for selected habit over the time range
    const days = parseInt(timeRange);
    const filteredCompletions = allCompletions.filter(c => c.habitId === selectedHabit);
    
    // Group completions by date
    const completionsByDate = new Map<string, number>();
    filteredCompletions.forEach(completion => {
      const date = new Date(completion.completedAt).toISOString().split('T')[0];
      completionsByDate.set(date, (completionsByDate.get(date) || 0) + 1);
    });
    
    // Generate data points for each day
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const completed = completionsByDate.get(dateStr) || 0;
      
      result.push({
        date: dateStr,
        value: completed > 0 ? 100 : 0, // 100% if completed, 0% if not
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return result;
  }, [selectedHabit, trendData, allCompletions, timeRange]);

  // Handle forgiveness token usage
  const handleForgivenessUsed = async () => {
    try {
      // Refresh habits data
      if (habitsHook?.fetchHabits) {
        await habitsHook.fetchHabits();
      }
      
      // Refresh gamification data (XP, tokens, level)
      // This will automatically update forgivenessTokens from the server
      if (gamification?.fetchGamificationData) {
        await gamification.fetchGamificationData();
      }
      
      // Refresh completions
      const fetchAllCompletions = async () => {
        if (habits.length === 0) return;
        
        const completionsPromises = habits.map(habit => 
          getHabitCompletions(habit.id, 60).catch(() => ({ data: { completions: [] } }))
        );
        
        const completionsResponses = await Promise.all(completionsPromises);
        const allCompletionsData = completionsResponses.flatMap(response => {
          if (response && typeof response === 'object' && 'data' in response) {
            return response.data?.completions || [];
          }
          return Array.isArray(response) ? response : [];
        });
        
        setAllCompletions(allCompletionsData);
      };
      
      await fetchAllCompletions();
    } catch (error) {
      console.error('Error refreshing data after forgiveness:', error);
    }
  };

  // Fetch data when component mounts or timeRange changes
  useEffect(() => {
    try {
      fetchTrendData(parseInt(timeRange));
      fetchWeeklySummary();
      fetchConsistencyData(new Date());
      fetchHabitPerformance(timeRange as '7d' | '30d' | '90d');
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  }, [timeRange, fetchTrendData, fetchWeeklySummary, fetchConsistencyData, fetchHabitPerformance]);

  // Fetch completions for all habits
  useEffect(() => {
    const fetchAllCompletions = async () => {
      try {
        if (habits.length === 0) {
          console.log('AnalyticsPage - No habits to fetch completions for');
          return;
        }
        
        console.log('AnalyticsPage - Fetching completions for', habits.length, 'habits');
        
        // Fetch completions for all habits (last 60 days to cover the calendar view)
        const completionsPromises = habits.map(habit => 
          getHabitCompletions(habit.id, 60).catch((err) => {
            console.error(`Failed to fetch completions for habit ${habit.id}:`, err);
            return { data: { completions: [] } };
          })
        );
        
        const completionsResponses = await Promise.all(completionsPromises);
        // Extract completions from response objects
        const allCompletionsData = completionsResponses.flatMap(response => {
          // Handle both response object format and direct array format
          if (response && typeof response === 'object' && 'data' in response) {
            return response.data?.completions || [];
          }
          return Array.isArray(response) ? response : [];
        });
        
        console.log('AnalyticsPage - Total completions fetched:', allCompletionsData.length);
        console.log('AnalyticsPage - Completions data:', allCompletionsData);
        
        setAllCompletions(allCompletionsData);
      } catch (error) {
        console.error('Error fetching completions:', error);
      }
    };

    fetchAllCompletions();
  }, [habits, getHabitCompletions]);

  // Calculate insights
  const calculateInsights = () => {
    const insights = [];
    
    // Consistency insights (multi-tier)
    if (stats.averageConsistency >= 90) {
      insights.push({
        type: 'success',
        title: 'Exceptional Consistency',
        description: `You're maintaining ${Math.round(stats.averageConsistency)}% consistency across all habits!`,
        icon: '🏆'
      });
    } else if (stats.averageConsistency >= 70) {
      insights.push({
        type: 'success',
        title: 'Great Progress',
        description: `You're at ${Math.round(stats.averageConsistency)}% consistency. Keep up the excellent work!`,
        icon: '👏'
      });
    } else if (stats.averageConsistency >= 50) {
      insights.push({
        type: 'encourage',
        title: 'Building Momentum',
        description: `You're at ${Math.round(stats.averageConsistency)}% consistency. You're on the right track!`,
        icon: '💪'
      });
    } else if (stats.averageConsistency > 0) {
      insights.push({
        type: 'encourage',
        title: 'Getting Started',
        description: `Every journey begins with a single step. Keep going!`,
        icon: '🌱'
      });
    }
    
    // Streak insights (multi-tier)
    if (stats.longestStreak >= 30) {
      insights.push({
        type: 'achievement',
        title: 'Streak Master',
        description: `Your longest streak is ${stats.longestStreak} days. That's incredible dedication!`,
        icon: '🔥'
      });
    } else if (stats.longestStreak >= 14) {
      insights.push({
        type: 'achievement',
        title: 'Two Week Warrior',
        description: `${stats.longestStreak} day streak! You're building serious momentum!`,
        icon: '⚡'
      });
    } else if (stats.longestStreak >= 7) {
      insights.push({
        type: 'achievement',
        title: 'Week Strong',
        description: `${stats.longestStreak} days in a row! That's a solid week of consistency!`,
        icon: '💫'
      });
    } else if (stats.longestStreak >= 3) {
      insights.push({
        type: 'achievement',
        title: 'Streak Started',
        description: `${stats.longestStreak} days and counting! Keep the momentum going!`,
        icon: '✨'
      });
    }
    
    // Completion milestones (multi-tier)
    if (stats.totalCompletions >= 100) {
      insights.push({
        type: 'milestone',
        title: 'Century Club',
        description: `You've completed ${stats.totalCompletions} habits total. Amazing progress!`,
        icon: '💯'
      });
    } else if (stats.totalCompletions >= 50) {
      insights.push({
        type: 'milestone',
        title: 'Half Century',
        description: `${stats.totalCompletions} completions! You're halfway to 100!`,
        icon: '🎯'
      });
    } else if (stats.totalCompletions >= 25) {
      insights.push({
        type: 'milestone',
        title: 'Quarter Century',
        description: `${stats.totalCompletions} habits completed. You're making real progress!`,
        icon: '🌟'
      });
    } else if (stats.totalCompletions >= 10) {
      insights.push({
        type: 'milestone',
        title: 'First Milestone',
        description: `${stats.totalCompletions} completions! You're building a strong foundation!`,
        icon: '🎉'
      });
    } else if (stats.totalCompletions >= 1) {
      insights.push({
        type: 'milestone',
        title: 'Journey Begun',
        description: `You've started your habit journey. Every completion counts!`,
        icon: '🚀'
      });
    }
    
    // Active habits insights (multi-tier)
    const activeHabits = habits.filter(h => h.active);
    if (activeHabits.length >= 5) {
      insights.push({
        type: 'info',
        title: 'Habit Juggler',
        description: `Managing ${activeHabits.length} active habits shows great ambition!`,
        icon: '🎯'
      });
    } else if (activeHabits.length >= 3) {
      insights.push({
        type: 'info',
        title: 'Multi-Tasker',
        description: `Tracking ${activeHabits.length} habits at once. You're building a well-rounded routine!`,
        icon: '🎪'
      });
    } else if (activeHabits.length >= 1) {
      insights.push({
        type: 'info',
        title: 'Focused Approach',
        description: `Starting with ${activeHabits.length === 1 ? 'one habit' : `${activeHabits.length} habits`} is a smart strategy!`,
        icon: '🎨'
      });
    }
    
    return insights;
  };

  const insights = calculateInsights();

  const timeRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' },
  ];

  const habitOptions = [
    { value: 'all', label: 'All Habits' },
    ...habits.map(habit => ({ value: habit.id, label: habit.name }))
  ];

  const viewTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'export', label: 'Export Data', icon: Download }
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />
              Analytics & Insights
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Deep dive into your habit-building journey with comprehensive statistics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LevelBadge totalXP={totalXP} variant="compact" showProgress />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max">
            {viewTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as ViewType)}
                  className={cn(
                    'flex items-center gap-2 py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap',
                    isActive
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filters - Show for overview and trends */}
        {(activeView === 'overview' || activeView === 'trends') && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-48">
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                options={timeRangeOptions}
              />
            </div>
            <div className="sm:w-64">
              <Select
                value={selectedHabit}
                onChange={(e) => setSelectedHabit(e.target.value)}
                options={habitOptions}
              />
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              <Card className="text-center p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completion Rate
                  </span>
                </div>
                <div className="mb-3">
                  <ProgressRing
                    progress={stats.averageConsistency}
                    size="md"
                    color={stats.averageConsistency >= 80 ? '#10B981' : stats.averageConsistency >= 60 ? '#3B82F6' : '#F59E0B'}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Average across all habits
                </div>
              </Card>

              <Card className="text-center p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-400" />
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total XP
                  </span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {totalXP.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Level {levelInfo.currentLevel}
                </div>
              </Card>

              <Card className="text-center p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-400" />
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Longest Streak
                  </span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 flex items-center justify-center gap-1 sm:gap-2">
                  <span>{stats.longestStreak}</span>
                  <span className="text-lg sm:text-xl md:text-2xl">🔥</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {stats.longestStreak === 1 ? 'day' : 'days'}
                </div>
              </Card>

              <Card className="text-center p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-600 dark:text-secondary-400" />
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Completions
                  </span>
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {stats.totalCompletions}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  All time
                </div>
              </Card>
            </div>

            {/* Main Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Left Column - Charts */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
                {/* Trend Graph */}
                <TrendGraph
                  data={filteredTrendData}
                  title={selectedHabit === 'all' ? "Consistency Trend" : `${habits.find(h => h.id === selectedHabit)?.name || 'Habit'} - Consistency Trend`}
                  subtitle={selectedHabit === 'all' 
                    ? `Your completion rate over the last ${timeRange} days`
                    : `Completion history over the last ${timeRange} days`
                  }
                  color={selectedHabit === 'all' ? '#3B82F6' : habits.find(h => h.id === selectedHabit)?.color || '#3B82F6'}
                  height={300}
                  showTrend
                  showGrid
                />

                {/* Weekly Summary */}
                <ErrorBoundary>
                  {filteredWeeklySummary ? (
                    <>
                      {console.log('[AnalyticsPage] Passing to WeeklySummary:', {
                        completions: filteredWeeklySummary.completions?.length,
                        totalHabits: filteredWeeklySummary.totalHabits,
                        dailyHabitCounts: filteredWeeklySummary.dailyHabitCounts,
                        dailyHabitCountsKeys: Object.keys(filteredWeeklySummary.dailyHabitCounts || {})
                      })}
                      <WeeklySummary
                        completions={filteredWeeklySummary.completions || []}
                        totalHabits={filteredWeeklySummary.totalHabits || 0}
                        dailyHabitCounts={filteredWeeklySummary.dailyHabitCounts}
                        habits={habits.map(h => ({ id: h.id, frequency: h.frequency }))}
                        showInsights
                      />
                    </>
                  ) : (
                    <Card className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </Card>
                  )}
                </ErrorBoundary>

                {/* Consistency Calendar */}
                <ConsistencyCalendar
                  completions={
                    selectedHabit === 'all'
                      ? allCompletions
                      : allCompletions.filter(c => c.habitId === selectedHabit)
                  }
                  month={new Date()}
                  habitId={selectedHabit === 'all' ? undefined : selectedHabit}
                  habitName={selectedHabit === 'all' ? undefined : habits.find(h => h.id === selectedHabit)?.name}
                  habitColor={
                    selectedHabit === 'all' 
                      ? '#3B82F6' 
                      : habits.find(h => h.id === selectedHabit)?.color || '#3B82F6'
                  }
                  habitFrequency={
                    selectedHabit === 'all' 
                      ? undefined 
                      : habits.find(h => h.id === selectedHabit)?.frequency || 'daily'
                  }
                  currentStreak={
                    selectedHabit === 'all' 
                      ? 0 
                      : habits.find(h => h.id === selectedHabit)?.currentStreak || 0
                  }
                  forgivenessTokens={forgivenessTokens}
                  onForgivenessUsed={handleForgivenessUsed}
                  showLegend
                />
              </div>

              {/* Right Column - Insights & Progress */}
              <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
                {/* XP Progress */}
                <XPBar totalXP={totalXP} showDetails animated />

                {/* Insights */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Insights
                  </h3>
                  
                  {insights.length > 0 ? (
                    <div className="space-y-3">
                      {insights.map((insight, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{insight.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {insight.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {insight.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Keep building habits to unlock insights!
                      </p>
                    </div>
                  )}
                </Card>

                {/* Habit Breakdown */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Habit Breakdown
                  </h3>
                  
                  {habits.length > 0 ? (
                    <div className="space-y-3">
                      {habits.slice(0, 5).map((habit) => (
                        <div key={habit.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: habit.color }}
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {habit.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" size="sm">
                              {Math.round(habit.consistencyRate)}%
                            </Badge>
                            <div className="flex items-center gap-1 text-orange-500">
                              <span className="text-sm">🔥</span>
                              <span className="text-xs font-medium">
                                {habit.currentStreak}d
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {habits.length > 5 && (
                        <div className="text-center pt-2">
                          <Button variant="ghost" size="sm">
                            View All {habits.length} Habits
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-4xl mb-2">🎯</div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Create habits to see detailed analytics
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeView === 'performance' && (
          <ErrorBoundary>
            <HabitPerformanceChart />
          </ErrorBoundary>
        )}

        {/* Trends Tab */}
        {activeView === 'trends' && (
          <div className="space-y-6">
            <TrendGraph
              data={filteredTrendData}
              title={selectedHabit === 'all' ? "Detailed Trend Analysis" : `${habits.find(h => h.id === selectedHabit)?.name || 'Habit'} - Detailed Trend Analysis`}
              subtitle={selectedHabit === 'all'
                ? `Comprehensive view of your habit completion trends over ${timeRange} days`
                : `Detailed completion history over ${timeRange} days`
              }
              color={selectedHabit === 'all' ? '#3B82F6' : habits.find(h => h.id === selectedHabit)?.color || '#3B82F6'}
              height={400}
              showTrend
              showGrid
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ErrorBoundary>
                {filteredWeeklySummary ? (
                  <WeeklySummary
                    completions={filteredWeeklySummary.completions || []}
                    totalHabits={filteredWeeklySummary.totalHabits || 0}
                    dailyHabitCounts={filteredWeeklySummary.dailyHabitCounts}
                    habits={habits.map(h => ({ id: h.id, frequency: h.frequency }))}
                    showInsights
                  />
                ) : (
                  <Card className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </Card>
                )}
              </ErrorBoundary>
              
              <ConsistencyCalendar
                completions={
                  selectedHabit === 'all'
                    ? allCompletions
                    : allCompletions.filter(c => c.habitId === selectedHabit)
                }
                month={new Date()}
                habitId={selectedHabit === 'all' ? undefined : selectedHabit}
                habitName={selectedHabit === 'all' ? undefined : habits.find(h => h.id === selectedHabit)?.name}
                habitColor={
                  selectedHabit === 'all' 
                    ? '#3B82F6' 
                    : habits.find(h => h.id === selectedHabit)?.color || '#3B82F6'
                }
                habitFrequency={
                  selectedHabit === 'all' 
                    ? undefined 
                    : habits.find(h => h.id === selectedHabit)?.frequency || 'daily'
                }
                currentStreak={
                  selectedHabit === 'all' 
                    ? 0 
                    : habits.find(h => h.id === selectedHabit)?.currentStreak || 0
                }
                forgivenessTokens={forgivenessTokens}
                onForgivenessUsed={handleForgivenessUsed}
                showLegend
              />
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeView === 'export' && (
          <DataExport />
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;