import { useState, useEffect } from 'react';
import { Meeting } from '@/components/MeetingsList';
import { getMeetings, scheduleMeeting, deleteMeeting, updateMeeting, MeetingData } from '@/services/firebase';

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeetings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMeetings(await getMeetings());
    } catch (error) {
      setError('Failed to load meetings');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createMeeting = async (meetingData: MeetingData) => {
    try {
      const meetingId = await scheduleMeeting(meetingData);
      await loadMeetings();
      return meetingId;
    } catch (error) {
      throw new Error('Failed to create meeting');
    }
  };

  const removeMeeting = async (meetingId: string) => {
    try {
      await deleteMeeting(meetingId);
      await loadMeetings();
    } catch (error) {
      throw new Error('Failed to delete meeting');
    }
  };

  const updateExistingMeeting = async (meetingId: string, meetingData: MeetingData) => {
    try {
      const formattedData = {
        ...meetingData,
        dateTime: new Date(meetingData.dateTime)
      };
      
      await updateMeeting(meetingId, formattedData);
      await loadMeetings();
    } catch (error) {
      throw new Error('Failed to update meeting');
    }
  };
  
  useEffect(() => { loadMeetings(); }, []);

  return {
    meetings,
    isLoading,
    error,
    createMeeting,
    removeMeeting,
    updateExistingMeeting,
    refreshMeetings: loadMeetings,
  };
};
