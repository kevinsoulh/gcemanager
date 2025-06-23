import * as functions from 'firebase-functions';
import { formatError } from '../utils/helpers';
import { createCalendarEventInternal } from '../utils/calendarUtils';

/**
 * Cloud Function to create a Google Calendar event with Google Meet
 * Returns the event ID and the Google Meet link
 */
export const createCalendarEvent = functions.https.onCall(async (request, context) => {
  try {
    const data = request.data;
    console.log('Creating calendar event:', data);

    const { eventId, meetLink } = await createCalendarEventInternal(data);
    
    console.log(`Created calendar event with ID: ${eventId} and Meet link: ${meetLink}`);

    return {
      eventId,
      meetLink,
      success: true
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return {
      eventId: '',
      meetLink: '',
      success: false,
      error: formatError(error)
    };
  }
});
