import * as functions from 'firebase-functions';
import { calendar } from '../config/calendar';
import { db, MEETINGS_COLLECTION } from '../config/firebase';
import { formatCalendarDateRange, parseDate, formatError } from '../utils/helpers';

type UpdateMeetingData = {
  meetingId: string;
  meetingData: {
    title: string;
    description: string;
    dateTime: string | Date;
    participants: string[];
  };
};

/**
 * Cloud Function to update an existing meeting
 * This updates the meeting data in Firestore and Google Calendar
 */
export const updateMeeting = functions.https.onCall(async (request, context) => {  try {
    if (!request.data) {
      throw new functions.https.HttpsError('invalid-argument', 'No data provided');
    }
    
    const data = request.data as UpdateMeetingData;
    const { meetingId, meetingData } = data;
    if (!meetingId || !meetingData) {
      throw new Error('Missing required fields: meetingId or meetingData');
    }

    const meetingRef = db.collection(MEETINGS_COLLECTION).doc(meetingId);
    const meetingDoc = await meetingRef.get();

    if (!meetingDoc.exists) {
      throw new Error(`Meeting ${meetingId} not found`);
    }

    const existingData = meetingDoc.data();
    if (!existingData?.calendarEventId) {
      throw new Error('Calendar event ID not found');
    }  
    const startDate = parseDate(meetingData.dateTime);
    
    const { start, end } = formatCalendarDateRange(meetingData);
    const eventUpdate = {
      summary: meetingData.title,
      description: meetingData.description,
      start,
      end,
      attendees: meetingData.participants.map(email => ({ email }))
    };

    await calendar.events.patch({
      eventId: existingData.calendarEventId,
      requestBody: eventUpdate
    });

    const updateData = {
      title: meetingData.title,
      description: meetingData.description,
      dateTime: startDate,
      participants: meetingData.participants,
      status: existingData.status,
      meetLink: existingData.meetLink,
      calendarEventId: existingData.calendarEventId,
      updatedAt: new Date().toISOString()
    };
    await meetingRef.update(updateData);

    return { 
      success: true, 
      meetingId,
      meeting: {
        id: meetingId,
        ...updateData
      }
    };
  } catch (error) {
    console.error('Error updating meeting:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        throw new functions.https.HttpsError('not-found', error.message);
      } else if (error.message.includes('Missing required fields')) {
        throw new functions.https.HttpsError('invalid-argument', error.message);
      }
    }
    
    throw new functions.https.HttpsError(
      'internal',
      'Failed to update meeting: ' + formatError(error)
    );
  }
});
