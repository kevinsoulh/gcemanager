import * as functions from 'firebase-functions';
import { db, MEETINGS_COLLECTION } from '../config/firebase';
import { calendar, CALENDAR_ID, authorizeCalendar } from '../config/calendar';
import { formatError } from '../utils/helpers';

/**
 * Cloud Function to delete a meeting
 * This handles the entire process:
 * 1. Deletes the Google Calendar event if it exists
 * 2. Deletes the meeting from Firestore
 */
export const deleteMeeting = functions.https.onCall(async (request, context) => {
  try {
    const { meetingId } = request.data as { meetingId: string };
    console.log(`Deleting meeting with ID: ${meetingId}`);
    
    const meetingDoc = await db.collection(MEETINGS_COLLECTION).doc(meetingId).get();
    
    if (!meetingDoc.exists) {
      return { 
        success: false, 
        error: 'Meeting not found' 
      };
    }
    
    const meetingData = meetingDoc.data();
    
    if (meetingData?.calendarEventId) {
      await authorizeCalendar();
      
      await calendar.events.delete({
        calendarId: CALENDAR_ID,
        eventId: meetingData.calendarEventId,
        sendUpdates: 'all',
      });
      
      console.log(`Deleted calendar event with ID: ${meetingData.calendarEventId}`);
    }
    
    await db.collection(MEETINGS_COLLECTION).doc(meetingId).delete();
    console.log(`Deleted meeting with ID: ${meetingId} from Firestore`);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return { 
      success: false, 
      error: formatError(error)
    };
  }
});
