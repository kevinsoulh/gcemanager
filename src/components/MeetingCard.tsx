import { format } from "date-fns";
import { Calendar, Clock, Users, ExternalLink, Copy, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Meeting } from "@/components/MeetingsList";
import { MeetingEditModal } from "@/components/MeetingEditModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MeetingCardProps {
  meeting: Meeting;
  isPast?: boolean;
  onDelete?: (meetingId: string) => void;
  onUpdate?: (meetingId: string, meetingData: {
    title: string;
    description: string;
    dateTime: Date;
    participants: string[];
  }) => Promise<void>;
}

const MeetingCard = ({ meeting, isPast = false, onDelete, onUpdate }: MeetingCardProps) => {
  const { toast } = useToast();

  const copyMeetLink = () => {
    if (meeting.meetLink) {
      navigator.clipboard.writeText(meeting.meetLink);
      toast({
        title: "Link Copied",
        description: "Meeting link copied to clipboard",
      });
    }
  };

  const joinMeeting = () => {
    if (meeting.meetLink) {
      window.open(meeting.meetLink, '_blank');
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(meeting.id);
      toast({
        title: "Meeting Deleted",
        description: "The meeting has been successfully deleted.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`w-full transition-all duration-200 hover:shadow-md ${isPast ? 'opacity-75' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-900">{meeting.title}</h3>
              <Badge className={getStatusColor(meeting.status)}>
                {meeting.status}
              </Badge>
            </div>

            {meeting.description && (
              <p className="text-gray-600 text-sm">{meeting.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(meeting.dateTime, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{format(meeting.dateTime, "h:mm a")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{meeting.participants.length} participants</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {meeting.participants.slice(0, 3).map((email) => (
                <Badge key={email} variant="outline" className="text-xs">
                  {email}
                </Badge>
              ))}
              {meeting.participants.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{meeting.participants.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          {meeting.meetLink && (
            <div className="ml-4 flex flex-col space-y-2">
              <Button
                size="sm"
                onClick={joinMeeting}
                className="flex items-center space-x-1"
                disabled={isPast}
              >
                <ExternalLink className="h-3 w-3" />
                <span>Join</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={copyMeetLink}
                className="flex items-center space-x-1"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </Button>
              {onUpdate && <MeetingEditModal meeting={meeting} onUpdate={onUpdate} />}
              {onDelete && !isPast && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this meeting? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
          
          {!meeting.meetLink && onDelete && !isPast && (
            <div className="ml-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this meeting? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {!meeting.meetLink && !isPast && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Meeting link will be generated shortly...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
