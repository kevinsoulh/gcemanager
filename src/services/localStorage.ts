import { Meeting } from '@/components/MeetingsList';

const STORAGE_KEY = 'meetings';

export const addMeetingToLocalStorage = (meeting: Meeting): string => {
  const existingMeetings = getMeetingsFromLocalStorage();
  const updatedMeetings = [...existingMeetings, meeting];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeetings));
  return meeting.id;
};

export const getMeetingsFromLocalStorage = (): Meeting[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  const meetings = JSON.parse(stored);
  return meetings.map((meeting: any) => ({
    ...meeting,
    dateTime: new Date(meeting.dateTime),
    createdAt: new Date(meeting.createdAt),
  }));
};

export const updateMeetingInLocalStorage = (
  meetingId: string, 
  updatedData: Partial<Meeting>
): void => {
  const existingMeetings = getMeetingsFromLocalStorage();
  const updatedMeetings = existingMeetings.map(meeting => 
    meeting.id === meetingId ? { ...meeting, ...updatedData } : meeting
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeetings));
};

export const deleteMeetingFromLocalStorage = (meetingId: string): void => {
  const existingMeetings = getMeetingsFromLocalStorage();
  const updatedMeetings = existingMeetings.filter(meeting => meeting.id !== meetingId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMeetings));
};
