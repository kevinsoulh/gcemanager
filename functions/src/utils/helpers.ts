/**
 * Convert a date string or Date object to a Date object
 * Throws an error if the date is invalid
 */
export const parseDate = (dateTime: string | Date): Date => {
  if (!dateTime) {
    throw new Error('Date is required');
  }

  let date: Date;
  if (dateTime instanceof Date) {
    date = dateTime;
  } else if (typeof dateTime === 'string') {
    date = new Date(dateTime);
  } else {
    throw new Error(`Invalid date format: ${dateTime}`);
  }

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${dateTime}`);
  }

  return date;
};

/**
 * Calculate end time (1 hour after start time)
 */
export const calculateEndTime = (startTime: Date): Date => {
  return new Date(startTime.getTime() + 60 * 60 * 1000);
};

/**
 * Format an error message
 */
export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
};

/**
 * Format date range for Google Calendar API
 */
export const formatCalendarDateRange = (meetingData: { dateTime: string | Date }) => {
  const startTime = parseDate(meetingData.dateTime);
  const endTime = calculateEndTime(startTime);

  return {
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'UTC'
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'UTC'
    }
  };
};
