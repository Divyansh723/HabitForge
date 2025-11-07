import React, { useState } from 'react';
import { Calendar, Trophy, Users, Clock, CheckCircle, Play } from 'lucide-react';
import { Button, Card, Badge, Modal, ModalContent, ModalFooter } from '@/components/ui';
import { type Challenge as ChallengeType, type ChallengeParticipation } from '@/types/gamification';
import { cn } from '@/utils/cn';

interface ChallengeProps {
  challenge: ChallengeType;
  participation?: ChallengeParticipation;
  onJoin?: (challengeId: string) => Promise<any>;
  onLeave?: (challengeId: string) => Promise<any>;
  isLoading?: boolean;
  className?: string;
}

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: ChallengeType;
  onJoin: () => void;
  isLoading: boolean;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  challenge,
  onJoin,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join Challenge" size="md">
      <ModalContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {challenge.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {challenge.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Duration
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {challenge.duration} days
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Trophy className="h-6 w-6 text-warning-600 dark:text-warning-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Reward
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {challenge.rewardXP} XP
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Requirements:
            </h4>
            <ul className="space-y-2">
              {challenge.requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0" />
                  <span>
                    {req.type === 'completion_count' && `Complete ${req.value} habits`}
                    {req.type === 'streak_length' && `Maintain a ${req.value}-day streak`}
                    {req.type === 'consistency_rate' && `Achieve ${req.value}% consistency`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                {challenge.participants.length} participants joined
              </span>
            </div>
            <p className="text-xs text-primary-600 dark:text-primary-400">
              Join the community and challenge yourself to build better habits!
            </p>
          </div>
        </div>
      </ModalContent>
      
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={onJoin} 
          loading={isLoading}
          leftIcon={<Play className="h-4 w-4" />}
        >
          Join Challenge
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export const Challenge: React.FC<ChallengeProps> = ({
  challenge,
  participation,
  onJoin,
  onLeave,
  isLoading = false,
  className,
}) => {
  const [showModal, setShowModal] = useState(false);

  const isParticipating = !!participation;
  const isCompleted = participation?.completed || false;
  const progress = participation?.progress || 0;

  const handleJoin = async () => {
    if (onJoin) {
      await onJoin(challenge.id);
      setShowModal(false);
    }
  };

  const handleLeave = async () => {
    if (onLeave && window.confirm('Are you sure you want to leave this challenge?')) {
      await onLeave(challenge.id);
    }
  };

  const getDaysRemaining = () => {
    if (!participation) return challenge.duration;
    const now = new Date();
    const endDate = new Date(participation.endDate);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = getDaysRemaining();

  return (
    <>
      <Card className={cn(
        'relative overflow-hidden transition-all duration-200 hover:shadow-md',
        isCompleted && 'border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/10',
        className
      )}>
        {/* Challenge badge */}
        <div className="absolute top-4 right-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="mb-4 pr-16">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {challenge.name}
              </h3>
              {isCompleted && (
                <Badge variant="primary" className="bg-success-500 border-success-500">
                  Completed
                </Badge>
              )}
              {isParticipating && !isCompleted && (
                <Badge variant="outline" className="text-primary-600 border-primary-600">
                  In Progress
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {challenge.description}
            </p>
          </div>

          {/* Progress (if participating) */}
          {isParticipating && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={cn(
                    'h-2 rounded-full transition-all duration-500',
                    isCompleted 
                      ? 'bg-success-500' 
                      : 'bg-gradient-to-r from-primary-500 to-secondary-500'
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Challenge details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {challenge.duration}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Days
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {challenge.rewardXP}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                XP Reward
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {challenge.participants.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Participants
              </div>
            </div>
          </div>

          {/* Time remaining (if participating) */}
          {isParticipating && !isCompleted && (
            <div className="mb-4 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning-600 dark:text-warning-400" />
                <span className="text-sm font-medium text-warning-700 dark:text-warning-300">
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                </span>
              </div>
            </div>
          )}

          {/* Requirements preview */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Requirements:
            </div>
            <div className="space-y-1">
              {challenge.requirements.slice(0, 2).map((req, index) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-success-500" />
                  <span>
                    {req.type === 'completion_count' && `Complete ${req.value} habits`}
                    {req.type === 'streak_length' && `${req.value}-day streak`}
                    {req.type === 'consistency_rate' && `${req.value}% consistency`}
                  </span>
                </div>
              ))}
              {challenge.requirements.length > 2 && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  +{challenge.requirements.length - 2} more requirements
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!isParticipating ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowModal(true)}
                disabled={isLoading}
                className="flex-1"
              >
                Join Challenge
              </Button>
            ) : isCompleted ? (
              <Button variant="outline" size="sm" disabled className="flex-1">
                Challenge Completed! 🎉
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeave}
                disabled={isLoading}
                className="flex-1"
              >
                Leave Challenge
              </Button>
            )}
          </div>
        </div>
      </Card>

      <ChallengeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        challenge={challenge}
        onJoin={handleJoin}
        isLoading={isLoading}
      />
    </>
  );
};