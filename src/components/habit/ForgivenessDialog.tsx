import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Modal, ModalContent, ModalFooter, Button } from '@/components/ui';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

interface ForgivenessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  habitName: string;
  habitColor?: string;
  date: Date;
  currentStreak: number;
  remainingTokens: number;
  dailyUsageRemaining: number;
}

export const ForgivenessDialog: React.FC<ForgivenessDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  habitName,
  habitColor = '#3B82F6',
  date,
  currentStreak,
  remainingTokens,
  dailyUsageRemaining,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onConfirm();
      setSuccess(true);
      
      // Close dialog after showing success
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to use forgiveness token');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="sm">
        <ModalContent>
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Streak Protected!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your forgiveness token has been used successfully
            </p>
          </div>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" showCloseButton={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${habitColor}20` }}
          >
            <Shield className="h-5 w-5" style={{ color: habitColor }} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Use Forgiveness Token?
          </h2>
        </div>
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <ModalContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Habit Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Habit</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{habitName}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {format(date, 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {currentStreak} → {currentStreak + 1} days
              </span>
            </div>
          </div>

          {/* What Will Happen */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              This will:
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Mark habit as completed for this date
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Restore and maintain your streak
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Award 5 XP (less than normal 10 XP)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Use 1 forgiveness token ({remainingTokens} → {remainingTokens - 1})
                </span>
              </div>
            </div>
          </div>

          {/* Token Info */}
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Remaining Tokens
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Shield
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < remainingTokens - 1
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                  />
                ))}
                <span className="ml-1 text-sm font-bold text-purple-900 dark:text-purple-100">
                  {remainingTokens - 1}/3
                </span>
              </div>
            </div>
          </div>

          {/* Daily Usage Warning */}
          {dailyUsageRemaining <= 1 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                {dailyUsageRemaining === 1
                  ? 'This is your last forgiveness token for today'
                  : 'You have reached your daily limit after this use'}
              </p>
            </div>
          )}
        </div>
      </ModalContent>

      <ModalFooter>
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={isLoading}
          loading={isLoading}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          {isLoading ? 'Using Token...' : 'Use Token'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
