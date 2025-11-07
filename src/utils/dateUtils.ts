import { format, isToday, isYesterday, startOfDay, endOfDay } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export const formatDate = (date: Date, formatString: string = 'MMM dd, yyyy'): string => {
  return format(date, formatString);
};

export const isDateToday = (date: Date): boolean => {
  return isToday(date);
};

export const isDateYesterday = (date: Date): boolean => {
  return isYesterday(date);
};

export const getStartOfDay = (date: Date, timezone: string): Date => {
  const zonedDate = utcToZonedTime(date, timezone);
  const startOfDayZoned = startOfDay(zonedDate);
  return zonedTimeToUtc(startOfDayZoned, timezone);
};

export const getEndOfDay = (date: Date, timezone: string): Date => {
  const zonedDate = utcToZonedTime(date, timezone);
  const endOfDayZoned = endOfDay(zonedDate);
  return zonedTimeToUtc(endOfDayZoned, timezone);
};

export const getCurrentDateInTimezone = (timezone: string): Date => {
  return utcToZonedTime(new Date(), timezone);
};

export const convertToUserTimezone = (utcDate: Date, timezone: string): Date => {
  return utcToZonedTime(utcDate, timezone);
};