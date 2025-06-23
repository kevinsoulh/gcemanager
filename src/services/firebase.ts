import { Meeting } from "@/components/MeetingsList";
import features from "@/config/features";
import { 
  addMeetingToLocalStorage, 
  getMeetingsFromLocalStorage, 
  deleteMeetingFromLocalStorage 
} from "./localStorage";
import { 
  scheduleMeetingViaFunction, 
  getMeetingsViaFunction, 
  deleteMeetingViaFunction, 
  updateMeetingViaFunction 
} from "./functions";

export interface MeetingData {
  title: string;
  description: string;
  dateTime: Date;
  participants: string[];
}

export const scheduleMeeting = async (meetingData: MeetingData): Promise<string> => {
  if (features.useFirebase) {
    return scheduleMeetingViaFunction(meetingData);
  }

  const meeting: Meeting = {
    id: `meeting_${Date.now()}`,
    title: meetingData.title,
    description: meetingData.description,
    dateTime: meetingData.dateTime,
    participants: meetingData.participants,
    meetLink: import.meta.env.VITE_MOCK_MEET_LINK || "https://meet.google.com/mock-link",
    status: 'scheduled',
    createdAt: new Date()
  };
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  return addMeetingToLocalStorage(meeting);
};

export const getMeetings = async (): Promise<Meeting[]> => {
  if (features.useFirebase) {
    return getMeetingsViaFunction();
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  return getMeetingsFromLocalStorage();
};

export const deleteMeeting = async (meetingId: string): Promise<void> => {
  if (features.useFirebase) {
    await deleteMeetingViaFunction(meetingId);
    return;
  }
  
  await new Promise(resolve => setTimeout(resolve, 300));
  deleteMeetingFromLocalStorage(meetingId);
};

export const updateMeeting = async (meetingId: string, meetingData: MeetingData): Promise<void> => {
  if (features.useFirebase) {
    await updateMeetingViaFunction(meetingId, meetingData);
    return;
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  const meetings = await getMeetingsFromLocalStorage();
  const updatedMeetings = meetings.map(meeting => 
    meeting.id === meetingId 
      ? { ...meeting, ...meetingData, updatedAt: new Date() }
      : meeting
  );
  
  localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
};
