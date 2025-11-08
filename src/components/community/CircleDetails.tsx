import React, { useState } from 'react';
import { ArrowLeft, Send, Trophy, Flag, Eye, EyeOff, Users } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useCircleDetails } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import communityService from '@/services/communityService';
import { cn } from '@/utils/cn';

interface CircleDetailsProps {
  circleId: string;
  onBack?: () => void;
  className?: string;
}

export const CircleDetails: React.FC<CircleDetailsProps> = ({
  circleId,
  onBack,
  className
}) => {
  const { user } = useAuth();
  const {
    circle,
    leaderboard,
    loading,
    error,
    postMessage,
    toggleLeaderboardOptOut,
    reportMessage,
    refreshCircle,
    refreshLeaderboard
  } = useCircleDetails(circleId);

  const [messageContent, setMessageContent] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'leaderboard'>('messages');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [joiningCircle, setJoiningCircle] = useState(false);
  const [justJoined, setJustJoined] = useState(false);

  // Clear justJoined flag once circle data confirms membership
  React.useEffect(() => {
    if (circle?.userIsMember && justJoined) {
      console.log('Circle data confirmed membership, clearing justJoined flag');
      setJustJoined(false);
    }
  }, [circle?.userIsMember, justJoined]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    setSendingMessage(true);
    try {
      await postMessage(messageContent);
      setMessageContent('');
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setSendingMessage(false);
    }
  };

  const handleToggleLeaderboard = async () => {
    try {
      await toggleLeaderboardOptOut();
      // Refresh circle data to update the opt-out status
      await refreshCircle();
      // Refresh leaderboard to show/hide the user immediately
      await refreshLeaderboard();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleReportMessage = async (messageId: string) => {
    if (window.confirm('Report this message as inappropriate?')) {
      try {
        await reportMessage(messageId);
      } catch (err) {
        // Error is handled by the hook
      }
    }
  };

  if (loading && !circle) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading circle...</p>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Circle not found</p>
        {onBack && (
          <Button onClick={onBack} variant="secondary" className="mt-4">
            Go Back
          </Button>
        )}
      </div>
    );
  }

  // Find the current user's member record
  const userMember = circle.members.find(m => {
    // Handle both populated (object with _id) and unpopulated (string) userId
    const memberId = typeof m.userId === 'object' && m.userId !== null 
      ? (m.userId as any)._id || (m.userId as any).id
      : m.userId;
    return memberId === user?.id;
  });
  const isOptedOut = userMember?.optOutOfLeaderboard || false;
  
  console.log('Leaderboard opt-out status:', { 
    userId: user?.id, 
    userMember, 
    isOptedOut 
  });
  // Check membership status - after joining, this should be true
  // Also check justJoined flag to handle the case where the API hasn't updated yet
  const isMember = circle.userIsMember || justJoined || false;
  const isFull = circle.availableSpots === 0;
  
  // Debug log
  console.log('Circle membership status:', { 
    userIsMember: circle.userIsMember, 
    justJoined,
    isMember, 
    memberCount: circle.memberCount,
    joiningCircle 
  });

  // Handle join circle
  const handleJoinCircle = async () => {
    if (joiningCircle || isFull) return;
    
    setJoiningCircle(true);
    try {
      // For private circles, we might need an invite code
      // For now, we'll just try to join without one
      await communityService.joinCircle(circleId);
      
      console.log('Join API call successful, refreshing circle data...');
      
      // Refresh the circle data to update membership status
      await refreshCircle();
      
      console.log('Circle refreshed, new membership status:', circle?.userIsMember);
      
      // Mark that user just joined (backup flag)
      setJustJoined(true);
    } catch (err) {
      console.error('Failed to join circle:', err);
      setJustJoined(false);
      // Error will be shown in the UI via the error state
    } finally {
      setJoiningCircle(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Card */}
      <Card className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700" />
        
        <div className="relative p-6">
          <div className="flex items-start gap-4">
            {onBack && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">
                  {circle.name}
                </h2>
                {circle.isPrivate && (
                  <span className="px-2 py-1 text-xs font-semibold bg-white/20 text-white rounded-md">
                    Private
                  </span>
                )}
              </div>
              {circle.description && (
                <p className="text-white/90 text-lg">
                  {circle.description}
                </p>
              )}
            </div>
            
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">
                  {circle.memberCount} / {circle.maxMembers}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Join Prompt for Non-Members */}
      {!isMember && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-pink-900/20" />
          
          <div className="relative p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 shadow-lg mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Join {circle.name}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {circle.description || 'Connect with others, share progress, and stay motivated together!'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Share Updates</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Post messages and encourage others</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl mb-2">🏆</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Compete</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Track progress on leaderboards</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl mb-2">⭐</div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Earn Points</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Complete challenges for rewards</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              {onBack && (
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={onBack}
                >
                  Go Back
                </Button>
              )}
              <Button 
                size="lg"
                onClick={handleJoinCircle}
                disabled={isFull || joiningCircle}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                {joiningCircle ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Joining...
                  </>
                ) : isFull ? (
                  <>Circle Full ({circle.maxMembers} members)</>
                ) : (
                  <>Join Circle ({circle.availableSpots} spots left)</>
                )}
              </Button>
            </div>
            
            {circle.isPrivate && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                🔒 This is a private circle. You may need an invite code to join.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Tabs - Only show for members */}
      {isMember && (
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('messages')}
          className={cn(
            'flex-1 px-6 py-3 font-semibold text-sm rounded-md transition-all',
            activeTab === 'messages'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          💬 Messages
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={cn(
            'flex-1 px-6 py-3 font-semibold text-sm rounded-md transition-all',
            activeTab === 'leaderboard'
              ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          🏆 Leaderboard
        </button>
        </div>
      )}

      {/* Messages Tab - Only for members */}
      {isMember && activeTab === 'messages' && (
        <div className="space-y-4">
          {/* Message List */}
          <Card className="p-6 max-h-[500px] overflow-y-auto">
            {circle.messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  No messages yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Be the first to say hello!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {circle.messages.map((message) => {
                  // Get user name and ID from populated userId field or fallback
                  const userName = typeof message.userId === 'object' && message.userId?.name
                    ? message.userId.name
                    : message.name || 'Anonymous';
                  const messageUserId = typeof message.userId === 'object' && message.userId !== null
                    ? (message.userId as any)._id || (message.userId as any).id
                    : message.userId;
                  const userInitial = userName[0].toUpperCase();
                  const isOwnMessage = messageUserId === user?.id;
                  
                  // Generate consistent color for each user based on their ID
                  const getUserColor = (userId: string) => {
                    const colors = [
                      { gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', bg: '#3b82f6', light: 'rgba(59, 130, 246, 0.1)' }, // blue
                      { gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', bg: '#10b981', light: 'rgba(16, 185, 129, 0.1)' }, // green
                      { gradient: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', bg: '#a855f7', light: 'rgba(168, 85, 247, 0.1)' }, // purple
                      { gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', bg: '#ec4899', light: 'rgba(236, 72, 153, 0.1)' }, // pink
                      { gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', bg: '#f97316', light: 'rgba(249, 115, 22, 0.1)' }, // orange
                      { gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', bg: '#14b8a6', light: 'rgba(20, 184, 166, 0.1)' }, // teal
                      { gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', bg: '#6366f1', light: 'rgba(99, 102, 241, 0.1)' }, // indigo
                      { gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', bg: '#f43f5e', light: 'rgba(244, 63, 94, 0.1)' }, // rose
                    ];
                    // Simple hash function to get consistent color index
                    let hash = 0;
                    for (let i = 0; i < userId.length; i++) {
                      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    return colors[Math.abs(hash) % colors.length];
                  };
                  
                  const userColor = isOwnMessage 
                    ? null // Will use Tailwind classes for own messages
                    : getUserColor(messageUserId);
                  
                  return (
                  <div
                    key={message._id}
                    className={cn(
                      "flex gap-3",
                      isOwnMessage ? "flex-row-reverse justify-start" : "flex-row justify-start"
                    )}
                  >
                    <div className="flex-shrink-0">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={isOwnMessage 
                          ? { background: 'linear-gradient(135deg, rgb(139, 92, 246) 0%, rgb(124, 58, 237) 100%)' }
                          : { background: userColor?.gradient }
                        }
                      >
                        {userInitial}
                      </div>
                    </div>
                    
                    <div className={cn(
                      "group max-w-[70%]",
                      isOwnMessage ? "flex flex-col items-end" : "flex flex-col items-start"
                    )}>
                      <div className={cn(
                        "flex items-center gap-2 mb-1",
                        isOwnMessage ? "flex-row-reverse" : "flex-row"
                      )}>
                        <span className={cn(
                          "font-semibold text-sm",
                          isOwnMessage ? "text-primary-600 dark:text-primary-400" : "text-gray-900 dark:text-white"
                        )}>
                          {isOwnMessage ? 'You' : userName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                        {!isOwnMessage && (
                          <button
                            onClick={() => handleReportMessage(message._id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-opacity"
                            title="Report message"
                          >
                            <Flag className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      <div 
                        className={cn(
                          "p-3 rounded-2xl",
                          isOwnMessage 
                            ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-sm" 
                            : "text-gray-900 dark:text-white rounded-tl-sm"
                        )}
                        style={!isOwnMessage && userColor ? {
                          background: userColor.light,
                          border: `1px solid ${userColor.bg}20`
                        } : undefined}
                      >
                        <p className="text-sm break-words">
                          {message.content}
                        </p>
                      </div>
                      
                      {message.reported && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
                          ⚠️ Reported
                        </span>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Message Input */}
          <Card className="p-4">
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex gap-3">
                <Input
                  type="text"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type your message..."
                  maxLength={500}
                  className="flex-1"
                  disabled={sendingMessage}
                />
                <Button
                  type="submit"
                  disabled={sendingMessage || !messageContent.trim()}
                  className="px-6"
                >
                  {sendingMessage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {messageContent.length} / 500 characters
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {circle.moderationSettings.maxMessagesPerDay} messages per day limit
                </span>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Leaderboard Tab - Only for members */}
      {isMember && activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {/* Leaderboard Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              {isOptedOut ? (
                <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {isOptedOut ? 'Hidden from leaderboard' : 'Visible on leaderboard'}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleLeaderboard}
            >
              {isOptedOut ? 'Show Me' : 'Hide Me'}
            </Button>
          </div>

          {/* Leaderboard */}
          <Card className="p-4">
            {!leaderboard || leaderboard.leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No leaderboard data yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.leaderboard.map((entry, index) => (
                  <div
                    key={entry.userId}
                    className={cn(
                      'flex items-center gap-4 p-3 rounded-lg',
                      index === 0 && 'bg-yellow-50 dark:bg-yellow-900/20',
                      index === 1 && 'bg-gray-100 dark:bg-gray-800',
                      index === 2 && 'bg-orange-50 dark:bg-orange-900/20',
                      index > 2 && 'bg-gray-50 dark:bg-gray-800/50'
                    )}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-700 font-bold text-sm">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {entry.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {entry.habitCount} active habits
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                          {entry.communityPoints || 0} ⭐
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          community pts
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {entry.weeklyStreakAverage}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          avg streak
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
