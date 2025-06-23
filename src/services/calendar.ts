import { functions } from '@/config/firebase';
import { httpsCallable } from 'firebase/functions';
import { MeetingData } from './firebase';

interface CalendarEventResult {
  eventId: string;
  meetLink: string;
  meetingId?: string;
  success: boolean;
  error?: string;
}

export const createCalendarEvent = async (meetingData: MeetingData): Promise<CalendarEventResult> => {
  const createEvent = httpsCallable<MeetingData, CalendarEventResult>(
    functions, 
    'createCalendarEvent'
  );
  
  try {
    const result = await createEvent(meetingData);
    return result.data;
  } catch (error) {
    return {
      eventId: '',
      meetLink: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const deleteCalendarEvent = async (eventId: string): Promise<boolean> => {
  const deleteEvent = httpsCallable<{eventId: string}, {success: boolean}>(
    functions, 
    'deleteCalendarEvent'
  );
  
  try {
    const result = await deleteEvent({ eventId });
    return result.data.success;
  } catch {
    return false;
  }
};
