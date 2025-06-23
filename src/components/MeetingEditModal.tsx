import { useState } from "react";
import { Meeting } from "@/components/MeetingsList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Pencil } from "lucide-react";
import { format } from "date-fns";

interface MeetingEditModalProps {
  meeting: Meeting;
  onUpdate: (meetingId: string, meetingData: {
    title: string;
    description: string;
    dateTime: Date;
    participants: string[];
  }) => Promise<void>;
}

export function MeetingEditModal({ meeting, onUpdate }: MeetingEditModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(meeting.title);
  const [description, setDescription] = useState(meeting.description || "");
  const [dateTime, setDateTime] = useState(format(meeting.dateTime, "yyyy-MM-dd'T'HH:mm"));
  const [participants, setParticipants] = useState(meeting.participants.join(", "));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onUpdate(meeting.id, {
        title,
        description,
        dateTime: new Date(dateTime),
        participants: participants.split(",").map(p => p.trim()).filter(Boolean),
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update meeting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
            <DialogDescription>
              Make changes to your meeting. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Meeting title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Meeting description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dateTime">Date and Time</Label>
              <div className="flex gap-2">
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  required
                />
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="participants">
                Participants (comma-separated emails)
              </Label>
              <Input
                id="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="participant1@example.com, participant2@example.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
