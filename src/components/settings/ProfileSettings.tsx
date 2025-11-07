import React, { useState } from 'react';
import { User, Mail, Calendar, MapPin, Save, Edit, Camera } from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

interface ProfileSettingsProps {
  className?: string;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ className }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    timezone: user?.timezone || 'America/New_York',
    dateFormat: user?.dateFormat || 'MM/dd/yyyy',
    language: user?.language || 'en',
    bio: user?.bio || ''
  });

  const timezoneOptions = [
    { value: 'America/New_York', label: 'Eastern Time (New York)' },
    { value: 'America/Chicago', label: 'Central Time (Chicago)' },
    { value: 'America/Denver', label: 'Mountain Time (Denver)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (London)' },
    { value: 'Europe/Paris', label: 'Central European Time (Paris)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (Tokyo)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (Shanghai)' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (Mumbai)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)' }
  ];

  const dateFormatOptions = [
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (US)' },
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (UK)' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (ISO)' },
    { value: 'dd.MM.yyyy', label: 'DD.MM.YYYY (German)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'zh', label: '中文' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      timezone: user?.timezone || 'America/New_York',
      dateFormat: user?.dateFormat || 'MM/dd/yyyy',
      language: user?.language || 'en',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
              
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{timezoneOptions.find(tz => tz.value === formData.timezone)?.label || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                {formData.name || 'Not set'}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                  {formData.email || 'Not set'}
                </div>
              )}
              <Badge variant="outline" size="sm" className="text-green-600 border-green-600">
                Verified
              </Badge>
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            {isEditing ? (
              <Select
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                options={timezoneOptions}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                {timezoneOptions.find(tz => tz.value === formData.timezone)?.label || 'Not set'}
              </div>
            )}
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            {isEditing ? (
              <Select
                value={formData.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                options={dateFormatOptions}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                {dateFormatOptions.find(df => df.value === formData.dateFormat)?.label || 'Not set'}
              </div>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            {isEditing ? (
              <Select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                options={languageOptions}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white">
                {languageOptions.find(lang => lang.value === formData.language)?.label || 'Not set'}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              rows={3}
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white min-h-[80px]">
              {formData.bio || 'No bio added yet.'}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};