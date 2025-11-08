import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui';
import { DailyHabitChecklist } from '@/components/habit';
import { XPBar, LevelBadge } from '@/components/gamification';
import { ProgressRing } from '@/components/analytics';
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { useGamification } from '@/hooks/useGamification';
import { useAI } from '@/hooks/useAI';
import { habitService } from '@/services/habitService';
import { Target, BarChart3, Trophy, Heart, RefreshCw, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getTotalStats, fetchHabits } = useHabits();
  const { totalXP, forgivenessTokens } = useGamification();
  const { motivationalContent, fetchMotivationalContent } = useAI();
  const stats = getTotalStats();

  const handleRecalculateStats = async () => {
    try {
      const result = await habitService.recalculateHabitStats();
      console.log('Recalculated stats for', result.habitsUpdated, 'habits');
      // Refresh habits to get updated data
      await fetchHabits();
      alert(`Successfully recalculated statistics for ${result.habitsUpdated} habits!`);
    } catch (error) {
      console.error('Failed to recalculate stats:', error);
      alert('Failed to recalculate statistics. Please try again.');
    }
  };

  // Fetch AI motivation on component mount
  React.useEffect(() => {
    fetchMotivationalContent('dashboard');
  }, [fetchMotivationalContent]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col gap-4">
          <div className="min-w-0 overflow-hidden">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white break-words">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Ready to build some great habits today?
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalculateStats}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Fix Streaks</span>
              <span className="xs:hidden">Fix</span>
            </Button>
            <LevelBadge totalXP={totalXP} variant="compact" showProgress />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Daily Habits - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 min-w-0">
            <DailyHabitChecklist showStreaks />
          </div>

          {/* Sidebar with Quick Info */}
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {/* XP Progress */}
            <XPBar totalXP={totalXP} showDetails animated />

            {/* Today's Progress */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Today's Progress
                </h2>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <ProgressRing
                  progress={stats.completionRate}
                  size="lg"
                  color={stats.completionRate >= 80 ? '#10B981' : stats.completionRate >= 60 ? '#3B82F6' : '#F59E0B'}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {stats.completedToday}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      of {stats.totalHabits}
                    </div>
                  </div>
                </ProgressRing>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Active Streaks</span>
                  <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                    🔥 {stats.currentStreaks || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Forgiveness Tokens</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {forgivenessTokens}/3
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
              </div>
              
              <div className="space-y-3">
                <Link 
                  to="/analytics"
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      View Analytics
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Check your progress trends
                    </div>
                  </div>
                </Link>
                
                <Link 
                  to="/goals"
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      Join Challenge
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Participate in community challenges
                    </div>
                  </div>
                </Link>
                
                <Link 
                  to="/wellbeing"
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                    <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      Wellbeing Check
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      See how habits affect your mood
                    </div>
                  </div>
                </Link>
              </div>
            </Card>

            {/* AI Motivational Content */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                </div>
                {motivationalContent ? (
                  <>
                    <blockquote className="text-gray-700 dark:text-gray-300 italic mb-3">
                      "{motivationalContent.message}"
                    </blockquote>
                    {motivationalContent.quote && (
                      <cite className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                        {motivationalContent.quote}
                      </cite>
                    )}
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      AI-powered daily motivation
                    </div>
                  </>
                ) : (
                  <>
                    <blockquote className="text-gray-700 dark:text-gray-300 italic mb-2">
                      "Success is the sum of small efforts repeated day in and day out."
                    </blockquote>
                    <cite className="text-sm text-gray-600 dark:text-gray-400">
                      — Robert Collier
                    </cite>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;