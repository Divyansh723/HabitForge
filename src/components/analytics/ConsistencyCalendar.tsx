import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isFuture } from 'date-fns';
import { CheckCircle, Circle, X, Shield } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { ForgivenessDialog } from '@/components/habit/ForgivenessDialog';
import { type Completion } from '@/types/habit';
import { cn } from '@/utils/cn';

interface ConsistencyCalendarProps {
  completions: Completion[];
  month?: Date;
  habitId?: string;
  habitName?: string;
  habitColor?: string;
  habitFrequency?: string; // NEW: To check if forgiveness is allowed
  currentStreak?: number;
  showLegend?: boolean;
  compact?: boolean;
  className?: string;
  forgivenessTokens?: number;
  onForgivenessUsed?: () => void;
}

export const ConsistencyCalendar: React.FC<ConsistencyCalendarProps> = ({
  completions,
  month = new Date(),
  habitId,
  habitName,
  habitColor = '#3B82F6',
  habitFrequency = 'daily', // Default to daily
  currentStreak = 0,
  showLegend = true,
  compact = false,
  className,
  forgivenessTokens = 0,
  onForgivenessUsed,
}) => {
  const [showForgivenessDialog, setShowForgivenessDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dailyUsageCount, setDailyUsageCount] = useState(0);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Debug: Log completions data
  console.log('ConsistencyCalendar - Completions received:', completions);
  console.log('ConsistencyCalendar - Completions count:', completions?.length || 0);

  // Get completion dates and forgiveness status
  const completionMap = new Map<string, { completed: boolean; forgiven: boolean }>();
  
  (completions || [])
    .filter(completion => completion && completion.completedAt)
    .forEach(completion => {
      try {
        const date = new Date(completion.completedAt);
        if (isNaN(date.getTime())) {
          console.warn('Invalid completion date:', completion.completedAt);
          return;
        }
        const formatted = format(date, 'yyyy-MM-dd');
        completionMap.set(formatted, {
          completed: true,
          forgiven: completion.forgivenessUsed === true
        });
      } catch (error) {
        console.warn('Error formatting completion date:', error);
      }
    });

  console.log('ConsistencyCalendar - Completion map:', Array.from(completionMap.entries()));

  const getDayStatus = (day: Date) => {
    const dayString = format(day, 'yyyy-MM-dd');
    const today = new Date();
    const completion = completionMap.get(dayString);
    
    if (isFuture(day)) return 'future';
    if (completion?.completed && completion?.forgiven) return 'forgiven';
    if (completion?.completed) return 'completed';
    if (isSameDay(day, today)) return 'today';
    return 'missed';
  };

  const canUseForgiveness = (day: Date) => {
    if (!habitId) return false;
    if (forgivenessTokens <= 0) return false;
    if (dailyUsageCount >= 3) return false;
    
    // Only allow forgiveness on daily habits
    if (habitFrequency !== 'daily') return false;
    
    const daysDiff = Math.floor((new Date().getTime() - day.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 0 && daysDiff <= 7;
  };

  const handleDayClick = (day: Date, status: string) => {
    if (status === 'missed' && canUseForgiveness(day)) {
      setSelectedDate(day);
      setShowForgivenessDialog(true);
    }
  };

  const handleUseForgiveness = async () => {
    if (!selectedDate || !habitId) return;
    
    try {
      const { habitService } = await import('@/services/habitService');
      await habitService.useForgivenessToken(habitId, selectedDate);
      
      // Update daily usage count
      setDailyUsageCount(prev => prev + 1);
      
      // Close dialog
      setShowForgivenessDialog(false);
      setSelectedDate(null);
      
      // Trigger parent refresh
      onForgivenessUsed?.();
    } catch (error) {
      // Error will be handled by ForgivenessDialog
      throw error;
    }
  };

  const getDayIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-white" />;
      case 'forgiven':
        return <Shield className="h-4 w-4 text-white" />;
      case 'today':
        return <Circle className="h-4 w-4 text-gray-400" />;
      case 'missed':
        return <X className="h-3 w-3 text-gray-400" />;
      default:
        return null;
    }
  };

  const getDayClasses = (day: Date, status: string) => {
    const baseClasses = cn(
      'flex items-center justify-center rounded-lg transition-all duration-200 border',
      compact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
    );

    const canForgive = status === 'missed' && canUseForgiveness(day);

    switch (status) {
      case 'completed':
        return cn(
          baseClasses,
          'border-transparent text-white shadow-sm',
          'hover:scale-105 cursor-pointer'
        );
      case 'forgiven':
        return cn(
          baseClasses,
          'border-transparent text-white shadow-sm opacity-75',
          'hover:scale-105 cursor-pointer'
        );
      case 'today':
        return cn(
          baseClasses,
          'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20',
          'text-primary-700 dark:text-primary-300 font-medium'
        );
      case 'missed':
        return cn(
          baseClasses,
          'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800',
          'text-gray-400 dark:text-gray-500',
          canForgive && 'hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer hover:scale-105'
        );
      case 'future':
        return cn(
          baseClasses,
          'border-gray-100 dark:border-gray-800 bg-gray-25 dark:bg-gray-900',
          'text-gray-300 dark:text-gray-600'
        );
      default:
        return baseClasses;
    }
  };

  // Calculate statistics
  const totalDays = days.filter(day => !isFuture(day)).length;
  const completedDays = days.filter(day => getDayStatus(day) === 'completed').length;
  const consistencyRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  // Get weekday headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {habitName ? `${habitName} - ` : ''}
            {format(month, 'MMMM yyyy')}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {completedDays} of {totalDays} days completed
          </p>
        </div>
        <Badge 
          variant={consistencyRate >= 80 ? 'primary' : consistencyRate >= 60 ? 'secondary' : 'outline'}
          className="font-semibold"
        >
          {consistencyRate}% consistent
        </Badge>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Weekday headers */}
        <div className={cn(
          'grid grid-cols-7 gap-1',
          compact ? 'mb-1' : 'mb-2'
        )}>
          {weekdays.map(day => (
            <div 
              key={day} 
              className={cn(
                'text-center font-medium text-gray-500 dark:text-gray-400',
                compact ? 'text-xs py-1' : 'text-sm py-2'
              )}
            >
              {compact ? day.charAt(0) : day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month start */}
          {Array.from({ length: monthStart.getDay() }, (_, i) => (
            <div key={`empty-${i}`} className={compact ? 'w-8 h-8' : 'w-10 h-10'} />
          ))}
          
          {/* Month days */}
          {days.map(day => {
            const status = getDayStatus(day);
            const dayNumber = format(day, 'd');
            const canForgive = status === 'missed' && canUseForgiveness(day);
            
            return (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className={getDayClasses(day, status)}
                style={(status === 'completed' || status === 'forgiven') ? { 
                  backgroundColor: habitColor,
                  opacity: status === 'forgiven' ? 0.75 : 1
                } : {}}
                title={
                  status === 'forgiven' 
                    ? `${format(day, 'MMM d, yyyy')} - Forgiven (🛡️)`
                    : status === 'missed' && habitId
                    ? forgivenessTokens <= 0
                      ? `${format(day, 'MMM d, yyyy')} - No forgiveness tokens available`
                      : dailyUsageCount >= 3
                      ? `${format(day, 'MMM d, yyyy')} - Daily limit reached (3/day)`
                      : !canUseForgiveness(day)
                      ? `${format(day, 'MMM d, yyyy')} - More than 7 days old`
                      : `${format(day, 'MMM d, yyyy')} - Click to use forgiveness token`
                    : `${format(day, 'MMM d, yyyy')} - ${status}`
                }
                onClick={() => handleDayClick(day, status)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDayClick(day, status);
                  }
                }}
                role={canForgive ? 'button' : undefined}
                tabIndex={canForgive ? 0 : undefined}
                aria-label={
                  status === 'forgiven' 
                    ? `${format(day, 'MMM d, yyyy')} - Forgiven completion`
                    : status === 'missed' && canForgive
                    ? `${format(day, 'MMM d, yyyy')} - Missed day. Press Enter to use forgiveness token`
                    : `${format(day, 'MMM d, yyyy')} - ${status}`
                }
              >
                {status === 'completed' || status === 'forgiven' || status === 'today' || status === 'missed' ? (
                  getDayIcon(status)
                ) : (
                  <span className="font-medium">{dayNumber}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded flex items-center justify-center"
              style={{ backgroundColor: habitColor }}
            >
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
              <X className="h-2 w-2 text-gray-400" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Missed</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Circle className="h-3 w-3 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Today</span>
          </div>
        </div>
      )}

      {/* Forgiveness Dialog */}
      {showForgivenessDialog && selectedDate && habitId && habitName && (
        <ForgivenessDialog
          isOpen={showForgivenessDialog}
          onClose={() => {
            setShowForgivenessDialog(false);
            setSelectedDate(null);
          }}
          onConfirm={handleUseForgiveness}
          habitName={habitName}
          habitColor={habitColor}
          date={selectedDate}
          currentStreak={currentStreak}
          remainingTokens={forgivenessTokens}
          dailyUsageRemaining={3 - dailyUsageCount}
        />
      )}
    </Card>
  );
};