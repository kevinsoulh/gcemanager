import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Mail, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMeetings } from "@/hooks/useMeetings";

const formSchema = z.object({
  title: z.string().min(1, "Meeting title is required").max(100, "Title too long"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Meeting date is required",
  }),
  time: z.string().min(1, "Meeting time is required"),
  participants: z.array(z.string().email("Invalid email address")).min(1, "At least one participant is required"),
});

type FormData = z.infer<typeof formSchema>;

interface MeetingSchedulerProps {
  onMeetingScheduled: () => void;
}

const MeetingScheduler = ({ onMeetingScheduled }: MeetingSchedulerProps) => {
  const [participantEmail, setParticipantEmail] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      participants: [],
    },
  });

  const addParticipant = () => {
    if (participantEmail && participantEmail.includes("@") && !participants.includes(participantEmail)) {
      const newParticipants = [...participants, participantEmail];
      setParticipants(newParticipants);
      form.setValue("participants", newParticipants);
      setParticipantEmail("");
    }
  };

  const removeParticipant = (email: string) => {
    const newParticipants = participants.filter(p => p !== email);
    setParticipants(newParticipants);
    form.setValue("participants", newParticipants);
  };
  const { createMeeting } = useMeetings();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log("Scheduling meeting with data:", data);
      
      // Combine date and time
      const [hours, minutes] = data.time.split(':').map(Number);
      const meetingDateTime = new Date(data.date);
      meetingDateTime.setHours(hours, minutes, 0, 0);

      const meetingData = {
        title: data.title,
        description: data.description || "",
        dateTime: meetingDateTime,
        participants: data.participants,
      };

      const result = await createMeeting(meetingData);

      if(!result) {
        throw new Error("Failed to create meeting");
      }
      
      toast({
        title: "Meeting Scheduled!",
        description: `${data.title} has been scheduled successfully.`,
      });

      // Reset form
      form.reset();
      setParticipants([]);
      onMeetingScheduled();
      
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <span>Schedule Meeting</span>
        </CardTitle>
        <CardDescription>
          Fill in the details to create a new Google Meet session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Weekly team standup" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Meeting agenda and details..." 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal h-10",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Clock className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                        <Input
                          type="time"
                          className="pl-10 h-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>            <div className="space-y-4">
              <FormLabel>Participants</FormLabel>
              <div className="flex space-x-2">
                <div className="relative flex-1 flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="participant@example.com"
                    value={participantEmail}
                    onChange={(e) => setParticipantEmail(e.target.value)}
                    className="pl-10 h-10"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
                  />
                </div>
                <Button
                  type="button"
                  onClick={addParticipant}
                  variant="outline"
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {participants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {participants.map((email) => (
                    <Badge key={email} variant="secondary" className="px-3 py-1">
                      {email}
                      <button
                        type="button"
                        onClick={() => removeParticipant(email)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <FormDescription>
                Add email addresses of meeting participants
              </FormDescription>
              {participants.length === 0 && (
                <FormMessage>At least one participant is required</FormMessage>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || participants.length === 0}
            >
              {isLoading ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MeetingScheduler;
