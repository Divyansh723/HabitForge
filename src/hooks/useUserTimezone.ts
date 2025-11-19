import { useAuth } from './useAuth';
import { getUserTimezone } from '@/utils/timezoneUtils';

/**
 * Hook to get the current user's timezone
 * Falls back to browser timezone if user timezone is not set
 */
export const useUserTimezone = (): string => {
  const { user } = useAuth();
  
  // Use user's saved timezone, or fall back to browser timezone
  return user?.timezone || getUserTimezone();
};
