
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import MeetingScheduler from "@/components/MeetingScheduler";
import MeetingsList from "@/components/MeetingsList";
import { Calendar, Video, Users } from "lucide-react";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMeetingScheduled = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Toaster />
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Video className="h-6 w-6 text-white" />
              </div>              <div>
                <h1 className="text-2xl font-bold text-gray-900">GCE Manager</h1>
                <p className="text-sm text-gray-600">Manage Google Calendar Events effortlessly</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Smart Scheduling</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Team Collaboration</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Schedule New Meeting</h2>
              <p className="text-gray-600">Create a new Google Meet session and invite participants</p>
            </div>
            <MeetingScheduler onMeetingScheduled={handleMeetingScheduled} />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Scheduled Meetings</h2>
              <p className="text-gray-600">View and manage your upcoming meetings</p>
            </div>
            <MeetingsList key={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
