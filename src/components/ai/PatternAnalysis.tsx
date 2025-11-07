import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Clock, TrendingUp, AlertCircle, Target, Sparkles } from 'lucide-react';
import { Card, Badge, Button, Select } from '@/components/ui';
import { cn } from '@/utils/cn';
import { useHabits } from '@/hooks/useHabits';
import { useAI } from '@/hooks/useAI';
import type { PatternAnalysis as PatternAnalysisType } from '@/services/aiService';

export const PatternAnalysis: React.FC = () => {
  const { habits } = useHabits();
  const { analyzeHabitPatterns } = useAI();
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [analysis, setAnalysis] = useState<PatternAnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeHabits = (habits || []).filter(h => h.active && h.totalCompletions >= 3);

  useEffect(() => {
    if (activeHabits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(activeHabits[0].id);
    }
  }, [activeHabits, selectedHabitId]);

  const handleAnalyzeHabit = async () => {
    if (!selectedHabitId) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeHabitPatterns(selectedHabitId);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze patterns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedHabitId) {
      handleAnalyzeHabit();
    }
  }, [selectedHabitId]);

  const selectedHabit = (habits || []).find(h => h.id === selectedHabitId);

  const habitOptions = activeHabits.map(habit => ({
    value: habit.id,
    label: habit.name
  }));

  const getConsistencyColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConsistencyBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-blue-100 dark:bg-blue-900';
    if (score >= 40) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  // Show demo data if no active habits with enough completions
  const showDemoData = activeHabits.length === 0;
  
  if (showDemoData) {
    // Create demo habit and analysis for display
    const demoHabit = {
      id: 'demo-1',
      name: 'Morning Exercise',
      description: 'Start your day with 30 minutes of exercise',
      icon: '🏃',
      color: '#3B82F6',
      active: true,
      currentStreak: 7,
      totalCompletions: 45,
      category: 'fitness',
      frequency: 'daily'
    };

    const demoAnalysis: PatternAnalysisType = {
      patterns: {
        bestDays: ['Monday', 'Tuesday', 'Wednesday'],
        bestTimes: ['morning', 'early evening'],
        consistencyScore: 85,
        streakPatterns: 'Strong weekday performance with weekend challenges. You maintain excellent consistency during work days.'
      },
      predictions: {
        optimalSchedule: 'Best performed in the morning between 7-9 AM on weekdays',
        riskFactors: ['Weekend schedule changes', 'Travel days', 'High stress periods'],
        successFactors: ['Morning routine anchor', 'Consistent sleep schedule', 'Preparation the night before']
      },
      recommendations: [
        'Set weekend-specific reminders to maintain consistency',
        'Prepare materials the night before to reduce friction',
        'Consider a simplified version for challenging days',
        'Track your energy levels to optimize timing'
      ]
    };

    return (
      <div className="space-y-8">
        {/* Demo Data Banner */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Demo Pattern Analysis:</strong> Complete habits at least 3 times to see your personalized AI pattern analysis. 
              The example below shows what insights you'll receive once you have enough data.
            </div>
          </div>
        </Card>

        {/* Demo Analysis Display */}
        <div className="space-y-8 opacity-90">
          {/* Habit Overview */}
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                style={{ backgroundColor: demoHabit.color }}
              >
                {demoHabit.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {demoHabit.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {demoHabit.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={cn(
                  'text-3xl font-bold mb-2',
                  getConsistencyColor(demoAnalysis.patterns.consistencyScore)
                )}>
                  {demoAnalysis.patterns.consistencyScore}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Consistency Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {demoHabit.currentStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Current Streak
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {demoHabit.totalCompletions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Completions
                </div>
              </div>
            </div>
          </Card>

          {/* Pattern Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Days */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Best Performance Days
              </h3>
              <div className="space-y-3">
                {demoAnalysis.patterns.bestDays.map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{day}</span>
                    <Badge 
                      variant="outline" 
                      className={index === 0 ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    >
                      {index === 0 ? 'Best' : 'Good'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Best Times */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Optimal Times
              </h3>
              <div className="space-y-3">
                {demoAnalysis.patterns.bestTimes.map((time, index) => (
                  <div key={time} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 capitalize">{time}</span>
                    <Badge 
                      variant="outline"
                      className={index === 0 ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                    >
                      {index === 0 ? 'Optimal' : 'Good'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Streak Patterns */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Streak Behavior Analysis
            </h3>
            <div className={cn(
              'p-4 rounded-lg mb-4',
              getConsistencyBg(demoAnalysis.patterns.consistencyScore)
            )}>
              <p className="text-gray-700 dark:text-gray-300">
                {demoAnalysis.patterns.streakPatterns}
              </p>
            </div>
          </Card>

          {/* Predictions & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Success & Risk Factors */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Success & Risk Factors
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                    Success Factors
                  </h4>
                  <ul className="space-y-1">
                    {demoAnalysis.predictions.successFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">
                    Risk Factors
                  </h4>
                  <ul className="space-y-1">
                    {demoAnalysis.predictions.riskFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-red-500 mt-1">⚠</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                AI Recommendations
              </h3>
              
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Optimal Schedule
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {demoAnalysis.predictions.optimalSchedule}
                  </p>
                </div>

                {demoAnalysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Habit Selection */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Pattern Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Discover when and how you perform best with your habits
              </p>
            </div>
          </div>
          <Button
            onClick={handleAnalyzeHabit}
            disabled={isLoading || !selectedHabitId}
            className="flex items-center gap-2"
          >
            <Sparkles className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            {isLoading ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Habit:
          </label>
          <div className="flex-1 max-w-xs">
            <Select
              value={selectedHabitId}
              onChange={(e) => setSelectedHabitId(e.target.value)}
              options={[
                { value: '', label: 'Choose a habit...' },
                ...habitOptions
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <div>
              <h3 className="font-medium">Analysis Error</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && analysis.patterns && selectedHabit && !isLoading && (
        <div className="space-y-8">
          {/* Habit Overview */}
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                style={{ backgroundColor: selectedHabit.color }}
              >
                {selectedHabit.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedHabit.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedHabit.description || 'Pattern analysis for this habit'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={cn(
                  'text-3xl font-bold mb-2',
                  getConsistencyColor(analysis.patterns.consistencyScore)
                )}>
                  {analysis.patterns.consistencyScore}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Consistency Score
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedHabit.currentStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Current Streak
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedHabit.totalCompletions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Completions
                </div>
              </div>
            </div>
          </Card>

          {/* Pattern Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best Days */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Best Performance Days
              </h3>
              <div className="space-y-3">
                {analysis.patterns.bestDays.map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{day}</span>
                    <Badge 
                      variant="outline" 
                      className={index === 0 ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    >
                      {index === 0 ? 'Best' : 'Good'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Best Times */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Optimal Times
              </h3>
              <div className="space-y-3">
                {analysis.patterns.bestTimes.map((time, index) => (
                  <div key={time} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 capitalize">{time}</span>
                    <Badge 
                      variant="outline"
                      className={index === 0 ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                    >
                      {index === 0 ? 'Optimal' : 'Good'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Streak Patterns */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Streak Behavior Analysis
            </h3>
            <div className={cn(
              'p-4 rounded-lg mb-4',
              getConsistencyBg(analysis.patterns.consistencyScore)
            )}>
              <p className="text-gray-700 dark:text-gray-300">
                {analysis.patterns.streakPatterns}
              </p>
            </div>
          </Card>

          {/* Predictions & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Success & Risk Factors */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-500" />
                Success & Risk Factors
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                    Success Factors
                  </h4>
                  <ul className="space-y-1">
                    {analysis.predictions.successFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">
                    Risk Factors
                  </h4>
                  <ul className="space-y-1">
                    {analysis.predictions.riskFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-red-500 mt-1">⚠</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                AI Recommendations
              </h3>
              
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Optimal Schedule
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {analysis.predictions.optimalSchedule}
                  </p>
                </div>

                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-xs font-semibold text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};