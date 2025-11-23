export interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

export const COMMON_TIMEZONES: TimezoneOption[] = [
  // UTC
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: 'UTC+0' },

  // Americas - North America
  { value: 'America/New_York', label: 'New York (Eastern Time)', offset: 'UTC-5/-4' },
  { value: 'America/Chicago', label: 'Chicago (Central Time)', offset: 'UTC-6/-5' },
  { value: 'America/Denver', label: 'Denver (Mountain Time)', offset: 'UTC-7/-6' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (Pacific Time)', offset: 'UTC-8/-7' },
  { value: 'America/Anchorage', label: 'Anchorage (Alaska Time)', offset: 'UTC-9/-8' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (Hawaii Time)', offset: 'UTC-10' },
  { value: 'America/Phoenix', label: 'Phoenix (Arizona)', offset: 'UTC-7' },
  { value: 'America/Toronto', label: 'Toronto, Canada', offset: 'UTC-5/-4' },
  { value: 'America/Vancouver', label: 'Vancouver, Canada', offset: 'UTC-8/-7' },
  { value: 'America/Halifax', label: 'Halifax, Canada', offset: 'UTC-4/-3' },
  { value: 'America/St_Johns', label: 'St. Johns, Canada', offset: 'UTC-3:30/-2:30' },

  // Americas - Central & South America
  { value: 'America/Mexico_City', label: 'Mexico City, Mexico', offset: 'UTC-6/-5' },
  { value: 'America/Cancun', label: 'Cancun, Mexico', offset: 'UTC-5' },
  { value: 'America/Guatemala', label: 'Guatemala City, Guatemala', offset: 'UTC-6' },
  { value: 'America/Costa_Rica', label: 'San Jose, Costa Rica', offset: 'UTC-6' },
  { value: 'America/Panama', label: 'Panama City, Panama', offset: 'UTC-5' },
  { value: 'America/Bogota', label: 'Bogota, Colombia', offset: 'UTC-5' },
  { value: 'America/Lima', label: 'Lima, Peru', offset: 'UTC-5' },
  { value: 'America/Caracas', label: 'Caracas, Venezuela', offset: 'UTC-4' },
  { value: 'America/Santiago', label: 'Santiago, Chile', offset: 'UTC-4/-3' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires, Argentina', offset: 'UTC-3' },
  { value: 'America/Sao_Paulo', label: 'São Paulo, Brazil', offset: 'UTC-3/-2' },
  { value: 'America/Manaus', label: 'Manaus, Brazil', offset: 'UTC-4' },

  // Europe - Western
  { value: 'Europe/London', label: 'London, United Kingdom', offset: 'UTC+0/+1' },
  { value: 'Europe/Dublin', label: 'Dublin, Ireland', offset: 'UTC+0/+1' },
  { value: 'Europe/Lisbon', label: 'Lisbon, Portugal', offset: 'UTC+0/+1' },
  { value: 'Atlantic/Reykjavik', label: 'Reykjavik, Iceland', offset: 'UTC+0' },

  // Europe - Central
  { value: 'Europe/Paris', label: 'Paris, France', offset: 'UTC+1/+2' },
  { value: 'Europe/Berlin', label: 'Berlin, Germany', offset: 'UTC+1/+2' },
  { value: 'Europe/Rome', label: 'Rome, Italy', offset: 'UTC+1/+2' },
  { value: 'Europe/Madrid', label: 'Madrid, Spain', offset: 'UTC+1/+2' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam, Netherlands', offset: 'UTC+1/+2' },
  { value: 'Europe/Brussels', label: 'Brussels, Belgium', offset: 'UTC+1/+2' },
  { value: 'Europe/Vienna', label: 'Vienna, Austria', offset: 'UTC+1/+2' },
  { value: 'Europe/Zurich', label: 'Zurich, Switzerland', offset: 'UTC+1/+2' },
  { value: 'Europe/Prague', label: 'Prague, Czech Republic', offset: 'UTC+1/+2' },
  { value: 'Europe/Warsaw', label: 'Warsaw, Poland', offset: 'UTC+1/+2' },
  { value: 'Europe/Stockholm', label: 'Stockholm, Sweden', offset: 'UTC+1/+2' },
  { value: 'Europe/Oslo', label: 'Oslo, Norway', offset: 'UTC+1/+2' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen, Denmark', offset: 'UTC+1/+2' },

  // Europe - Eastern
  { value: 'Europe/Athens', label: 'Athens, Greece', offset: 'UTC+2/+3' },
  { value: 'Europe/Bucharest', label: 'Bucharest, Romania', offset: 'UTC+2/+3' },
  { value: 'Europe/Sofia', label: 'Sofia, Bulgaria', offset: 'UTC+2/+3' },
  { value: 'Europe/Helsinki', label: 'Helsinki, Finland', offset: 'UTC+2/+3' },
  { value: 'Europe/Kiev', label: 'Kyiv, Ukraine', offset: 'UTC+2/+3' },
  { value: 'Europe/Istanbul', label: 'Istanbul, Turkey', offset: 'UTC+3' },
  { value: 'Europe/Moscow', label: 'Moscow, Russia', offset: 'UTC+3' },

  // Africa
  { value: 'Africa/Cairo', label: 'Cairo, Egypt', offset: 'UTC+2' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg, South Africa', offset: 'UTC+2' },
  { value: 'Africa/Lagos', label: 'Lagos, Nigeria', offset: 'UTC+1' },
  { value: 'Africa/Nairobi', label: 'Nairobi, Kenya', offset: 'UTC+3' },
  { value: 'Africa/Casablanca', label: 'Casablanca, Morocco', offset: 'UTC+0/+1' },
  { value: 'Africa/Algiers', label: 'Algiers, Algeria', offset: 'UTC+1' },
  { value: 'Africa/Tunis', label: 'Tunis, Tunisia', offset: 'UTC+1' },
  { value: 'Africa/Accra', label: 'Accra, Ghana', offset: 'UTC+0' },

  // Middle East
  { value: 'Asia/Dubai', label: 'Dubai, UAE', offset: 'UTC+4' },
  { value: 'Asia/Riyadh', label: 'Riyadh, Saudi Arabia', offset: 'UTC+3' },
  { value: 'Asia/Kuwait', label: 'Kuwait City, Kuwait', offset: 'UTC+3' },
  { value: 'Asia/Qatar', label: 'Doha, Qatar', offset: 'UTC+3' },
  { value: 'Asia/Bahrain', label: 'Manama, Bahrain', offset: 'UTC+3' },
  { value: 'Asia/Baghdad', label: 'Baghdad, Iraq', offset: 'UTC+3' },
  { value: 'Asia/Tehran', label: 'Tehran, Iran', offset: 'UTC+3:30/+4:30' },
  { value: 'Asia/Jerusalem', label: 'Jerusalem, Israel', offset: 'UTC+2/+3' },
  { value: 'Asia/Beirut', label: 'Beirut, Lebanon', offset: 'UTC+2/+3' },
  { value: 'Asia/Amman', label: 'Amman, Jordan', offset: 'UTC+2/+3' },

  // Asia - South
  { value: 'Asia/Kolkata', label: 'Mumbai/Delhi, India', offset: 'UTC+5:30' },
  { value: 'Asia/Karachi', label: 'Karachi, Pakistan', offset: 'UTC+5' },
  { value: 'Asia/Dhaka', label: 'Dhaka, Bangladesh', offset: 'UTC+6' },
  { value: 'Asia/Colombo', label: 'Colombo, Sri Lanka', offset: 'UTC+5:30' },
  { value: 'Asia/Kathmandu', label: 'Kathmandu, Nepal', offset: 'UTC+5:45' },

  // Asia - Southeast
  { value: 'Asia/Bangkok', label: 'Bangkok, Thailand', offset: 'UTC+7' },
  { value: 'Asia/Singapore', label: 'Singapore', offset: 'UTC+8' },
  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur, Malaysia', offset: 'UTC+8' },
  { value: 'Asia/Jakarta', label: 'Jakarta, Indonesia', offset: 'UTC+7' },
  { value: 'Asia/Manila', label: 'Manila, Philippines', offset: 'UTC+8' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City, Vietnam', offset: 'UTC+7' },
  { value: 'Asia/Yangon', label: 'Yangon, Myanmar', offset: 'UTC+6:30' },

  // Asia - East
  { value: 'Asia/Shanghai', label: 'Beijing/Shanghai, China', offset: 'UTC+8' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: 'UTC+8' },
  { value: 'Asia/Taipei', label: 'Taipei, Taiwan', offset: 'UTC+8' },
  { value: 'Asia/Tokyo', label: 'Tokyo, Japan', offset: 'UTC+9' },
  { value: 'Asia/Seoul', label: 'Seoul, South Korea', offset: 'UTC+9' },
  { value: 'Asia/Pyongyang', label: 'Pyongyang, North Korea', offset: 'UTC+9' },
  { value: 'Asia/Ulaanbaatar', label: 'Ulaanbaatar, Mongolia', offset: 'UTC+8' },

  // Asia - Central
  { value: 'Asia/Almaty', label: 'Almaty, Kazakhstan', offset: 'UTC+6' },
  { value: 'Asia/Tashkent', label: 'Tashkent, Uzbekistan', offset: 'UTC+5' },
  { value: 'Asia/Yekaterinburg', label: 'Yekaterinburg, Russia', offset: 'UTC+5' },
  { value: 'Asia/Novosibirsk', label: 'Novosibirsk, Russia', offset: 'UTC+7' },
  { value: 'Asia/Vladivostok', label: 'Vladivostok, Russia', offset: 'UTC+10' },

  // Australia & Pacific
  { value: 'Australia/Sydney', label: 'Sydney, Australia', offset: 'UTC+10/+11' },
  { value: 'Australia/Melbourne', label: 'Melbourne, Australia', offset: 'UTC+10/+11' },
  { value: 'Australia/Brisbane', label: 'Brisbane, Australia', offset: 'UTC+10' },
  { value: 'Australia/Perth', label: 'Perth, Australia', offset: 'UTC+8' },
  { value: 'Australia/Adelaide', label: 'Adelaide, Australia', offset: 'UTC+9:30/+10:30' },
  { value: 'Australia/Darwin', label: 'Darwin, Australia', offset: 'UTC+9:30' },
  { value: 'Pacific/Auckland', label: 'Auckland, New Zealand', offset: 'UTC+12/+13' },
  { value: 'Pacific/Fiji', label: 'Suva, Fiji', offset: 'UTC+12/+13' },
  { value: 'Pacific/Guam', label: 'Guam', offset: 'UTC+10' },
  { value: 'Pacific/Port_Moresby', label: 'Port Moresby, Papua New Guinea', offset: 'UTC+10' },
  { value: 'Pacific/Tahiti', label: 'Tahiti, French Polynesia', offset: 'UTC-10' },
  { value: 'Pacific/Tongatapu', label: 'Nuku\'alofa, Tonga', offset: 'UTC+13' },
  { value: 'Pacific/Samoa', label: 'Apia, Samoa', offset: 'UTC+13' },
];

export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getTimezoneOffset = (timezone: string): string => {
  const now = new Date();
  const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
  const offset = (targetTime.getTime() - utc.getTime()) / (1000 * 60 * 60);

  const sign = offset >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offset));
  const minutes = Math.round((Math.abs(offset) - hours) * 60);

  return `UTC${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
};

/**
 * Format a date/time in the user's timezone
 * @param date - Date object or ISO string
 * @param userTimezone - User's timezone (e.g., 'America/New_York')
 * @param format - Format type: 'full', 'date', 'time', 'datetime', 'relative'
 */
export const formatInUserTimezone = (
  date: Date | string,
  userTimezone: string = 'UTC',
  format: 'full' | 'date' | 'time' | 'datetime' | 'relative' | 'short' = 'datetime'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {
    timeZone: userTimezone,
  };

  switch (format) {
    case 'full':
      return dateObj.toLocaleString('en-US', {
        ...options,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    case 'date':
      return dateObj.toLocaleDateString('en-US', {
        ...options,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

    case 'time':
      return dateObj.toLocaleTimeString('en-US', {
        ...options,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    case 'short':
      return dateObj.toLocaleString('en-US', {
        ...options,
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    case 'datetime':
      return dateObj.toLocaleString('en-US', {
        ...options,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

    case 'relative':
      return getRelativeTime(dateObj, userTimezone);

    default:
      return dateObj.toLocaleString('en-US', options);
  }
};

/**
 * Get relative time string (e.g., "2 hours ago", "in 5 minutes")
 */
export const getRelativeTime = (date: Date | string, userTimezone: string = 'UTC'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  // Convert both dates to the user's timezone for comparison
  const userNow = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
  const userDate = new Date(dateObj.toLocaleString('en-US', { timeZone: userTimezone }));

  const diffMs = userNow.getTime() - userDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) {
    return diffSec <= 0 ? 'just now' : `${diffSec}s ago`;
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else if (diffDay < 7) {
    return `${diffDay}d ago`;
  } else if (diffWeek < 4) {
    return `${diffWeek}w ago`;
  } else if (diffMonth < 12) {
    return `${diffMonth}mo ago`;
  } else {
    return `${diffYear}y ago`;
  }
};

/**
 * Convert UTC time string (HH:mm) to user's timezone
 * @param utcTime - Time in HH:mm format (UTC)
 * @param userTimezone - User's timezone
 * @returns Time in HH:mm format in user's timezone
 */
export const convertUTCTimeToUserTimezone = (
  utcTime: string,
  userTimezone: string = 'UTC'
): string => {
  if (!utcTime || !utcTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
    return utcTime;
  }

  const [hours, minutes] = utcTime.split(':').map(Number);
  const today = new Date();
  const utcDate = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    hours,
    minutes
  ));

  return utcDate.toLocaleTimeString('en-US', {
    timeZone: userTimezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Convert user's timezone time to UTC
 * @param localTime - Time in HH:mm format (user's timezone)
 * @param userTimezone - User's timezone
 * @returns Time in HH:mm format in UTC
 */
export const convertUserTimezoneToUTC = (
  localTime: string,
  userTimezone: string = 'UTC'
): string => {
  if (!localTime || !localTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
    return localTime;
  }

  const [hours, minutes] = localTime.split(':').map(Number);

  // Create a date in the user's timezone
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  
  // Create ISO string and parse it as if it's in the user's timezone
  const dateStr = `${year}-${month}-${day}T${timeStr}`;
  const localDateStr = new Date(dateStr).toLocaleString('en-US', { timeZone: userTimezone });
  const localDate = new Date(localDateStr);
  
  // Convert to UTC
  const utcHours = localDate.getUTCHours();
  const utcMinutes = localDate.getUTCMinutes();

  return `${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}`;
};