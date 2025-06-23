import { calendar, CALENDAR_ID, authorizeCalendar } from '../config/calendar';
import { calculateEndTime, parseDate } from './helpers';
import { calendar_v3 } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config(); 

interface MeetingData {
  title: string;
  description: string;
  dateTime: string | Date;
  participants: string[];
}

interface CalendarEventResult {
  eventId: string;
  meetLink?: string;
}

/**
 * Create a calendar event and return its ID and meet link
 */
export async function createCalendarEventInternal(meetingData: MeetingData): Promise<CalendarEventResult> {
  try {
    await authorizeCalendar();

    const startDate = parseDate(meetingData.dateTime);

    const event: calendar_v3.Schema$Event = {
      summary: meetingData.title,
      description: meetingData.description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: calculateEndTime(startDate).toISOString(),
        timeZone: 'UTC',
      },
      attendees: meetingData.participants.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    if (!response.data || !response.data.id) {
      throw new Error('Failed to get event ID from calendar response');
    }

    return { 
      eventId: response.data.id,
      meetLink: response.data.hangoutLink || undefined
    };
  } catch (error) {
    console.error('Calendar event creation failed:', error);
    throw error;
  }
}

/**
 * Update an existing calendar event
 */
export async function updateCalendarEvent(
  eventId: string,
  meetingData: MeetingData
): Promise<CalendarEventResult> {
  try {
    await authorizeCalendar();

    const startDate = parseDate(meetingData.dateTime);

    const event: calendar_v3.Schema$Event = {
      summary: meetingData.title,
      description: meetingData.description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: calculateEndTime(startDate).toISOString(),
        timeZone: 'UTC',
      },
      attendees: meetingData.participants.map(email => ({ email })),
    };

    const response = await calendar.events.patch({
      calendarId: CALENDAR_ID,
      eventId: eventId,
      requestBody: event,
      sendUpdates: 'all',
    });

    if (!response.data || !response.data.id) {
      throw new Error('Failed to get event ID from calendar response');
    }

    return {
      eventId: response.data.id,
      meetLink: response.data.hangoutLink || undefined
    };
  } catch (error) {
    console.error('Calendar event update failed:', error);
    throw error;
  }
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  try {
    await authorizeCalendar();

    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: eventId,
      sendUpdates: 'all',
    });
  } catch (error) {
    console.error('Calendar event deletion failed:', error);
    throw error;
  }
}
