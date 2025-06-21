import { format } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

// Korean timezone
export const KOREAN_TIMEZONE = 'Asia/Seoul';

/**
 * Convert UTC time string to Korean local time and format it
 */
export const formatKoreanTime = (utcTimeString: string, formatPattern: string = 'HH:mm'): string => {
  if (!utcTimeString) return '';
  
  try {
    const date = new Date(utcTimeString);
    
    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', utcTimeString);
      return '';
    }
    
    // Convert UTC to Korean time
    const koreanDate = toZonedTime(date, KOREAN_TIMEZONE);
    return format(koreanDate, formatPattern);
  } catch (error) {
    console.error('Error formatting Korean time:', error, 'Input:', utcTimeString);
    return '';
  }
};

/**
 * Convert Date object to UTC ISO string for server requests
 */
export const toUtcIsoString = (date: Date): string => {
  const utcDate = fromZonedTime(date, KOREAN_TIMEZONE);
  return utcDate.toISOString();
};

/**
 * Format local datetime to UTC for server
 */
export const formatLocalDateTimeToUtc = (date: Date): string => {
  const utcDate = fromZonedTime(date, KOREAN_TIMEZONE);
  return utcDate.toISOString();
}; 