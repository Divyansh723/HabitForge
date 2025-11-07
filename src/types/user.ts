export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  timezone: string;
  level: number;
  totalXP: number;
  forgivenessTokens: number;
  aiOptOut: boolean;
  theme: 'light' | 'dark' | 'system';
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
  createdAt: Date;
  updatedAt: Date;
  softDeleted: boolean;
  deletionRequestedAt?: Date;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  inApp: boolean;
  reminderTime?: string;
}

export interface PrivacySettings {
  shareWithCommunity: boolean;
  allowAIPersonalization: boolean;
  showOnLeaderboard: boolean;
}