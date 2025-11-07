import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Clock, Volume2, VolumeX, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ className }) => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [preferences, setPreferences] = useState({
    habitReminders: true,
    streakMilestones: true,
    dailySummary: true,
    weeklyInsights: true,
    challengeUpdates: true,
    communityActivity: false,
    systemUpdates: true,
    tipsAndTricks: false
  });

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

  // Load user notification preferences
  useEffect(() => {
    if (user?.notificationPreferences) {
      const prefs = user.notificationPreferences;
      setPreferences({
        habitReminders: prefs.habitReminders ?? true,
        streakMilestones: prefs.streakMilestones ?? true,
        dailySummary: prefs.dailySummary ?? true,
        weeklyInsights: prefs.weeklyInsights ?? true,
        challengeUpdates: prefs.challengeUpdates ?? true,
        communityActivity: prefs.communityActivity ?? false,
        systemUpdates: prefs.systemUpdates ?? true,
        tipsAndTricks: prefs.tipsAndTricks ?? false
      });

      setGlobalSettings({
        pushEnabled: prefs.push ?? true,
        emailEnabled: prefs.email ?? true,
        inAppEnabled: prefs.inApp ?? true,
        quietHours: prefs.quietHours ?? {
          enabled: true,
          start: '22:00',
          end: '08:00'
        },
        soundEnabled: prefs.soundEnabled ?? true
      });
    }
  }, [user]);

  const updatePreference = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const updateGlobalSetting = (key: string, value: any) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      await updateProfile({
        notificationPreferences: {
          push: globalSettings.pushEnabled,
          email: globalSettings.emailEnabled,
          inApp: globalSettings.inAppEnabled,
          reminderTime: user?.notificationPreferences?.reminderTime,
          habitReminders: preferences.habitReminders,
          streakMilestones: preferences.streakMilestones,
          dailySummary: preferences.dailySummary,
          weeklyInsights: preferences.weeklyInsights,
          challengeUpdates: preferences.challengeUpdates,
          communityActivity: preferences.communityActivity,
          systemUpdates: preferences.systemUpdates,
          tipsAndTricks: preferences.tipsAndTricks,
          quietHours: globalSettings.quietHours,
          soundEnabled: globalSettings.soundEnabled
        }
      });

      setSaveSuccess(true);
      
      // Reload the page after a short delay to show success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save settings');
      setIsSaving(false);
    }
  };

  const notificationTypes = [
    {
      id: 'habitReminders',
      title: 'Habit Reminders',
      description: 'Get notified when it\'s time to complete your habits',
      category: 'habits',
      icon: '🎯'
    },
    {
      id: 'streakMilestones',
      title: 'Streak Milestones',
      description: 'Celebrate when you reach streak milestones (7, 14, 30 days)',
      category: 'habits',
      icon: '🔥'
    },
    {
      id: 'dailySummary',
      title: 'Daily Summary',
      description: 'End-of-day summary of your habit completions and progress',
      category: 'habits',
      icon: '📊'
    },
    {
      id: 'weeklyInsights',
      title: 'Weekly Insights',
      description: 'Weekly analytics and insights about your habit patterns',
      category: 'habits',
      icon: '📈'
    },
    {
      id: 'challengeUpdates',
      title: 'Challenge Updates',
      description: 'Updates about challenges you\'re participating in',
      category: 'social',
      icon: '🏆'
    },
    {
      id: 'communityActivity',
      title: 'Community Activity',
      description: 'Activity from your community circles and friends',
      category: 'social',
      icon: '👥'
    },
    {
      id: 'systemUpdates',
      title: 'System Updates',
      description: 'Important updates about HabitForge features and maintenance',
      category: 'system',
      icon: '⚙️'
    },
    {
      id: 'tipsAndTricks',
      title: 'Tips & Tricks',
      description: 'Helpful tips to improve your habit-building journey',
      category: 'marketing',
      icon: '💡'
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
          <p className="text-success-700 dark:text-success-300">Notification settings saved successfully!</p>
        </div>
      )}
      
      {saveError && (
        <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-error-600 dark:text-error-400" />
          <p className="text-error-700 dark:text-error-300">{saveError}</p>
        </div>
      )}

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
            <input
              type="checkbox"
              checked={globalSettings.pushEnabled}
              onChange={(e) => updateGlobalSetting('pushEnabled', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
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
            <input
              type="checkbox"
              checked={globalSettings.emailEnabled}
              onChange={(e) => updateGlobalSetting('emailEnabled', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
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
            <input
              type="checkbox"
              checked={globalSettings.inAppEnabled}
              onChange={(e) => updateGlobalSetting('inAppEnabled', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
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
              <input
                type="checkbox"
                checked={globalSettings.quietHours.enabled}
                onChange={(e) => updateGlobalSetting('quietHours', {
                  ...globalSettings.quietHours,
                  enabled: e.target.checked
                })}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
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
              <input
                type="checkbox"
                checked={globalSettings.soundEnabled}
                onChange={(e) => updateGlobalSetting('soundEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Play sounds with notifications
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          {notificationTypes.map((type) => (
            <div key={type.id} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl">{type.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {type.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {type.description}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferences[type.id as keyof typeof preferences]}
                onChange={(e) => updatePreference(type.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 mt-1"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          loading={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Notification Preferences'}
        </Button>
      </div>
    </div>
  );
};
