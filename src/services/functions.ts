import { functions } from '@/config/firebase';
import { httpsCallable } from 'firebase/functions';
import { Meeting } from '@/components/MeetingsList';
import { MeetingData } from './firebase';

interface MeetingResult {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  participants: string[];
  meetLink: string;
  status: string;
  calendarEventId?: string;
  success: boolean;
  error?: string;
}

export const scheduleMeetingViaFunction = async (meetingData: MeetingData): Promise<string> => {
  const scheduleFunction = httpsCallable<MeetingData, MeetingResult>(functions, 'scheduleMeeting');
  const result = await scheduleFunction(meetingData);
  
  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to schedule meeting');
  }
  
  return result.data.id;
};

export const getMeetingsViaFunction = async (): Promise<Meeting[]> => {
  const getMeetingsFunction = httpsCallable<{}, { success: boolean; meetings: any[] }>(
    functions, 
    'getMeetings'
  );
  
  const result = await getMeetingsFunction({});
  
  if (!result.data.success) {
    throw new Error('Failed to get meetings');
  }
  
  return result.data.meetings.map(meeting => ({
    ...meeting,
    dateTime: new Date(meeting.dateTime),
    createdAt: new Date(meeting.createdAt)
  })) as Meeting[];
};

export const deleteMeetingViaFunction = async (meetingId: string): Promise<void> => {
  const deleteMeetingFunction = httpsCallable<
    {meetingId: string}, 
    {success: boolean, error?: string}
  >(functions, 'deleteMeeting');
  
  const result = await deleteMeetingFunction({ meetingId });
  
  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to delete meeting');
  }
};

export const updateMeetingViaFunction = async (meetingId: string, meetingData: MeetingData): Promise<void> => {
  const updateFunction = httpsCallable<
    { meetingId: string; meetingData: MeetingData },
    { success: boolean; error?: string; meeting?: any }
  >(functions, 'updateMeeting');
  
  const result = await updateFunction({ meetingId, meetingData });
  
  if (!result.data.success) {
    throw new Error(result.data.error || 'Failed to update meeting');
  }
};
