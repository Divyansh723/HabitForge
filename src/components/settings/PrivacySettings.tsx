import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Download, Trash2, AlertTriangle, Lock, Key, Database } from 'lucide-react';
import { Card, Button, Badge, Checkbox, Modal } from '@/components/ui';
import { cn } from '@/utils/cn';

interface PrivacySettingsProps {
  className?: string;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({ className }) => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private', // 'public', 'friends', 'private'
    habitDataSharing: false,
    analyticsSharing: false,
    aiPersonalization: true,
    communityParticipation: false,
    dataRetention: '1year', // '6months', '1year', '2years', 'indefinite'
    thirdPartySharing: false,
    marketingEmails: false
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDataExport = () => {
    // This would trigger the data export process
    console.log('Exporting user data...');
  };

  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== 'DELETE') return;
    
    setIsDeleting(true);
    try {
      // Simulate account deletion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Account deletion initiated...');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Anyone can see your profile and progress' },
    { value: 'friends', label: 'Friends Only', description: 'Only people you connect with can see your data' },
    { value: 'private', label: 'Private', description: 'Only you can see your data' }
  ];

  const retentionOptions = [
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
    { value: '2years', label: '2 Years' },
    { value: 'indefinite', label: 'Indefinite' }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Profile Visibility */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Profile Visibility
        </h3>

        <div className="space-y-4">
          {visibilityOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all',
                privacySettings.profileVisibility === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={privacySettings.profileVisibility === option.value}
                onChange={(e) => updateSetting('profileVisibility', e.target.value)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Data Sharing */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Sharing & Privacy
        </h3>

        <div className="space-y-6">
          {/* Habit Data Sharing */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Share Habit Data for Research
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Allow anonymized habit data to be used for research to improve the platform
              </div>
            </div>
            <Checkbox
              checked={privacySettings.habitDataSharing}
              onChange={(checked) => updateSetting('habitDataSharing', checked)}
            />
          </div>

          {/* Analytics Sharing */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Share Analytics Data
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Help improve the app by sharing usage analytics and performance data
              </div>
            </div>
            <Checkbox
              checked={privacySettings.analyticsSharing}
              onChange={(checked) => updateSetting('analyticsSharing', checked)}
            />
          </div>

          {/* AI Personalization */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                AI Personalization
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Use your data to provide personalized AI coaching and recommendations
              </div>
            </div>
            <Checkbox
              checked={privacySettings.aiPersonalization}
              onChange={(checked) => updateSetting('aiPersonalization', checked)}
            />
          </div>

          {/* Community Participation */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Community Features
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Participate in community challenges and leaderboards
              </div>
            </div>
            <Checkbox
              checked={privacySettings.communityParticipation}
              onChange={(checked) => updateSetting('communityParticipation', checked)}
            />
          </div>

          {/* Third Party Sharing */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Third-Party Integrations
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Allow data sharing with connected third-party apps and services
              </div>
            </div>
            <Checkbox
              checked={privacySettings.thirdPartySharing}
              onChange={(checked) => updateSetting('thirdPartySharing', checked)}
            />
          </div>

          {/* Marketing Emails */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Marketing Communications
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Receive promotional emails about new features and tips
              </div>
            </div>
            <Checkbox
              checked={privacySettings.marketingEmails}
              onChange={(checked) => updateSetting('marketingEmails', checked)}
            />
          </div>
        </div>
      </Card>

      {/* Data Retention */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Data Retention
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keep my data for
            </label>
            <select
              value={privacySettings.dataRetention}
              onChange={(e) => updateSetting('dataRetention', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {retentionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Data Retention Policy</p>
                <p>
                  Your data will be automatically deleted after the selected period of inactivity. 
                  You can always export your data before deletion or change this setting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Key className="h-5 w-5" />
          Data Management
        </h3>

        <div className="space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Export Your Data
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Download a complete copy of your data in CSV format
              </div>
            </div>
            <Button
              onClick={handleDataExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <div className="font-medium text-red-900 dark:text-red-100 mb-1">
                Delete Account
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                Permanently delete your account and all associated data
              </div>
            </div>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700 dark:text-red-300">
                <p className="font-medium mb-1">This action cannot be undone</p>
                <p>
                  Deleting your account will permanently remove all your habits, progress data, 
                  and personal information. This action cannot be reversed.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type "DELETE" to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAccountDeletion}
                disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
 