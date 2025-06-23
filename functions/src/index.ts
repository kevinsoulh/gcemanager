import {setGlobalOptions} from "firebase-functions";

setGlobalOptions({ maxInstances: 10 });

export { scheduleMeeting } from './functions/scheduleMeeting';
export { getMeetings } from './functions/getMeetings';
export { deleteMeeting } from './functions/deleteMeeting';
export { updateMeeting } from './functions/updateMeeting';
export { createCalendarEvent } from './functions/createCalendarEvent';
export { deleteCalendarEvent } from './functions/deleteCalendarEvent';
