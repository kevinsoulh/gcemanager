import * as functions from 'firebase-functions';
import { db, MEETINGS_COLLECTION } from '../config/firebase';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { parseDate, formatError } from '../utils/helpers';
import { createCalendarEventInternal } from '../utils/calendarUtils';

/**
 * Cloud Function to schedule a meeting
 * This handles the entire process:
 * 1. Creates a Google Calendar event with Meet link (via calendarUtils)
 * 2. Stores the meeting data in Firestore
 * 3. Returns the meeting details
 */
export const scheduleMeeting = functions.https.onCall(async (request, context) => {
  try {
    const meetingData = request.data;
    console.log('Scheduling meeting:', meetingData);

    let eventId = '';
    let meetLink: string | undefined;
    
    try {
      const calendarResult = await createCalendarEventInternal(meetingData);
      eventId = calendarResult.eventId;
      meetLink = calendarResult.meetLink;
      console.log(`Created calendar event with ID: ${eventId} and Meet link: ${meetLink || 'none'}`);
    } catch (calendarError) {
      console.error('Error creating calendar event:', calendarError);

      if (process.env.APP_USE_MOCK_CALENDAR === 'true') {
        console.log('Using mock calendar data due to error (USE_MOCK_CALENDAR=true)');
        eventId = `mock-event-${Date.now()}`;
        meetLink = `https://meet.google.com/mock-link-${Date.now().toString(36).substring(2, 7)}`;
      } else {
        throw calendarError;
      }
    }
      
    console.log('Input dateTime:', meetingData.dateTime);
    const startTime = parseDate(meetingData.dateTime);
    console.log('Parsed startTime:', startTime);

    // Create the meeting document in Firestore
    const meetingRef = db.collection(MEETINGS_COLLECTION).doc();
    const meeting = {
      id: meetingRef.id,
      title: meetingData.title,
      description: meetingData.description || '',
      dateTime: Timestamp.fromDate(startTime),
      participants: meetingData.participants || [],
      calendarEventId: eventId,
      ...(meetLink && { meetLink }), // Only include meetLink if it exists
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await meetingRef.set(meeting);
    console.log(`Created meeting document with ID: ${meetingRef.id}`);

    return {
      ...meeting,
      dateTime: startTime.toISOString(), // Convert Timestamp back to ISO string for response
      createdAt: null, // These will be set server-side
      updatedAt: null
    };
  } catch (error) {
    console.error('Error in scheduleMeeting:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to schedule meeting',
      formatError(error)
    );
  }
});
