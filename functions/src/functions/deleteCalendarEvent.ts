import * as functions from 'firebase-functions';
import { calendar, CALENDAR_ID, authorizeCalendar } from '../config/calendar';
import { formatError } from '../utils/helpers';

/**
 * Cloud Function to delete a Google Calendar event
 */
export const deleteCalendarEvent = functions.https.onCall(async (request, context) => {
  try {
    const { eventId } = request.data as { eventId: string };
    console.log(`Deleting calendar event with ID: ${eventId}`);

    await authorizeCalendar();

    await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: eventId,
      sendUpdates: 'all', 
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return { 
      success: false, 
      error: formatError(error)
    };
  }
});
