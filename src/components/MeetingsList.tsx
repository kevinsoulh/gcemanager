import { Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMeetings } from "@/hooks/useMeetings";
import MeetingCard from "@/components/MeetingCard";

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  dateTime: Date;
  participants: string[];
  meetLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  calendarEventId?: string; 
}

const MeetingsList = () => {
  const { meetings, isLoading, error, removeMeeting, updateExistingMeeting, refreshMeetings } = useMeetings();
  const { toast } = useToast();

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await removeMeeting(meetingId);
      toast({
        title: "Meeting Deleted",
        description: "The meeting has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast({
        title: "Error",
        description: "Failed to delete meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMeeting = async (meetingId: string, meetingData: any) => {
    try {
      await updateExistingMeeting(meetingId, meetingData);
      toast({
        title: "Meeting Updated",
        description: "The meeting has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast({
        title: "Error",
        description: "Failed to update meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading meetings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (meetings.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Scheduled Meetings</span>
          </CardTitle>
          <CardDescription>Your upcoming Google Meet sessions</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">No meetings scheduled</h3>
              <p className="text-gray-500 mt-1">Schedule your first meeting to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedMeetings = meetings.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  const upcomingMeetings = sortedMeetings.filter(m => m.dateTime > new Date());
  const pastMeetings = sortedMeetings.filter(m => m.dateTime <= new Date());

  return (
    <div className="space-y-6">
      {upcomingMeetings.length > 0 && (
        <div>          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Meetings</h3>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                onDelete={handleDeleteMeeting} 
                onUpdate={handleUpdateMeeting}
              />
            ))}
          </div>
        </div>
      )}

      {pastMeetings.length > 0 && (
        <div>          <h3 className="text-lg font-medium text-gray-500 mb-4">Past Meetings</h3>
          <div className="space-y-4">
            {pastMeetings.slice(0, 5).map((meeting) => (
              <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                isPast 
                onDelete={handleDeleteMeeting} 
                onUpdate={handleUpdateMeeting}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingsList;
