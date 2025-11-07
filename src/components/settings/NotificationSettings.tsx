import React, { useState } from 'react';
import { Bell, Mail, Smartphone, Clock, Volume2, VolumeX } from 'lucide-react';
import { Card, Button, Badge, Checkbox } from '@/components/ui';
import { cn } from '@/utils/cn';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  category: 'habits' | 'social' | 'system' | 'marketing';
  channels: {
    push: boolean;
    email: boolean;
    inApp: boolean;
  };
  enabled: boolean;
  frequency?: 'immediate' | 'daily' | 'weekly';
}

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className }) => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'habit_reminders',
      title: 'Habit Reminders',
      description: 'Get notified when it\'s time to complete your habits',
      category: 'habits',
      channels: { push: true, email: false, inApp: true },
      enabled: true,
      frequency: 'immediate'
    },
    {
      id: 'streak_milestones',
      title: 'Streak Milestones',
      description: 'Celebrate when you reach streak milestones (7, 14, 30 days)',
      category: 'habits',
      channels: { push: true, email: true, inApp: true },
      enabled: true,
      frequency: 'immediate'
    },
    {
      id: 'daily_summary',
      title: 'Daily Summary',
      description: 'End-of-day summary of your habit completions and progress',
      category: 'habits',
      channels: { push: false, email: true, inApp: true },
      enabled: true,
      frequency: 'daily'
    },
    {
      id: 'weekly_insights',
      title: 'Weekly Insights',
      description: 'Weekly analytics and insights about your habit patterns',
      category: 'habits',
      channels: { push: false, email: true, inApp: true },
      enabled: true,
      frequency: 'weekly'
    },
    {
      id: 'challenge_updates',
      title: 'Challenge Updates',
      description: 'Updates about challenges you\'re participating in',
      category: 'social',
      channels: { push: true, email: false, inApp: true },
      enabled: true,
      frequency: 'immediate'
    },
    {
      id: 'community_activity',
      title: 'Community Activity',
      description: 'Activity from your community circles and friends',
      category: 'social',
      channels: { push: false, email: false, inApp: true },
      enabled: false,
      frequency: 'immediate'
    },
    {
      id: 'system_updates',
      title: 'System Updates',
      description: 'Important updates about HabitForge features and maintenance',
      category: 'system',
      channels: { push: true, email: true, inApp: true },
      enabled: true,
      frequency: 'immediate'
    },
    {
      id: 'tips_and_tricks',
      title: 'Tips & Tricks',
      description: 'Helpful tips to improve your habit-building journey',
      category: 'marketing',
      channels: { push: false, email: true, inApp: false },
      enabled: false,
      frequency: 'weekly'
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    inAppEnabled: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    soundEnabled: true
  });

  const updatePreference = (id: string, updates: Partial<NotificationPreference>) => {
    setPreferences(prev => prev.map(pref => 
      pref.id === id ? { ...pref, ...updates } : pref
    ));
  };

  const updateGlobalSetting = (key: string, value: any) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'habits': return '🎯';
      case 'social': return '👥';
      case 'system': return '⚙️';
      case 'marketing': return '💡';
      default: return '🔔';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'habits': return 'text-blue-600 dark:text-blue-400';
      case 'social': return 'text-green-600 dark:text-green-400';
      case 'system': return 'text-orange-600 dark:text-orange-400';
      case 'marketing': return 'text-purple-600 dark:text-purple-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const groupedPreferences = preferences.reduce((acc, pref) => {
    if (!acc[pref.category]) {
      acc[pref.category] = [];
    }
    acc[pref.category].push(pref);
    return acc;
  }, {} as Record<string, NotificationPreference[]>);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Global Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Channels
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-blue-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Push Notifications
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Mobile & desktop alerts
                </div>
              </div>
            </div>
            <Checkbox
              checked={globalSettings.pushEnabled}
              onChange={(checked) => updateGlobalSetting('pushEnabled', checked)}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Email Notifications
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Email summaries & alerts
                </div>
              </div>
            </div>
            <Checkbox
              checked={globalSettings.emailEnabled}
              onChange={(checked) => updateGlobalSetting('emailEnabled', checked)}
            />
          </div>

          {/* In-App Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  In-App Notifications
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Notifications within app
                </div>
              </div>
            </div>
            <Checkbox
              checked={globalSettings.inAppEnabled}
              onChange={(checked) => updateGlobalSetting('inAppEnabled', checked)}
            />
          </div>
        </div>

        {/* Additional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiet Hours */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Quiet Hours
                </span>
              </div>
              <Checkbox
                checked={globalSettings.quietHours.enabled}
                onChange={(checked) => updateGlobalSetting('quietHours', {
                  ...globalSettings.quietHours,
                  enabled: checked
                })}
              />
            </div>
            {globalSettings.quietHours.enabled && (
              <div className="flex items-center gap-2 text-sm">
                <input
                  type="time"
                  value={globalSettings.quietHours.start}
                  onChange={(e) => updateGlobalSetting('quietHours', {
                    ...globalSettings.quietHours,
                    start: e.target.value
                  })}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-gray-600 dark:text-gray-400">to</span>
                <input
                  type="time"
                  value={globalSettings.quietHours.end}
                  onChange={(e) => updateGlobalSetting('quietHours', {
                    ...globalSettings.quietHours,
                    end: e.target.value
                  })}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Sound Settings */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {globalSettings.soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-yellow-500" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  Notification Sounds
                </span>
              </div>
              <Checkbox
                checked={globalSettings.soundEnabled}
                onChange={(checked) => updateGlobalSetting('soundEnabled', checked)}
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Play sounds with notifications
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Preferences by Category */}
      {Object.entries(groupedPreferences).map(([category, prefs]) => (
        <Card key={category} className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-xl">{getCategoryIcon(category)}</span>
            <span className="capitalize">{category} Notifications</span>
          </h3>

          <div className="space-y-4">
            {prefs.map((pref) => (
              <div key={pref.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {pref.title}
                      </h4>
                      {pref.frequency && (
                        <Badge variant="outline" size="sm">
                          {pref.frequency}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pref.description}
                    </p>
                  </div>
                  <Checkbox
                    checked={pref.enabled}
                    onChange={(checked) => updatePreference(pref.id, { enabled: checked })}
                  />
                </div>

                {pref.enabled && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Channels:</span>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={pref.channels.push && globalSettings.pushEnabled}
                        disabled={!globalSettings.pushEnabled}
                        onChange={(checked) => updatePreference(pref.id, {
                          channels: { ...pref.channels, push: checked }
                        })}
                        size="sm"
                      />
                      <Smartphone className="h-4 w-4 text-blue-500" />
                      <span>Push</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={pref.channels.email && globalSettings.emailEnabled}
                        disabled={!globalSettings.emailEnabled}
                        onChange={(checked) => updatePreference(pref.id, {
                          channels: { ...pref.channels, email: checked }
                        })}
                        size="sm"
                      />
                      <Mail className="h-4 w-4 text-green-500" />
                      <span>Email</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={pref.channels.inApp && globalSettings.inAppEnabled}
                        disabled={!globalSettings.inAppEnabled}
                        onChange={(checked) => updatePreference(pref.id, {
                          channels: { ...pref.channels, inApp: checked }
                        })}
                        size="sm"
                      />
                      <Bell className="h-4 w-4 text-purple-500" />
                      <span>In-App</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Save Notification Preferences
        </Button>
      </div>
    </div>
  );
};