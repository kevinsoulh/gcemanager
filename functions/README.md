# Firebase Cloud Functions for GCE Manager

This directory contains the Firebase Cloud Functions for the GCE Manager application. These functions provide the backend functionality for creating, retrieving, and deleting meetings with Google Calendar integration.

## Project Structure

```
functions/
  src/
    index.ts                  # Main entry point that exports all functions
    config/                   # Configuration files
      calendar.ts             # Google Calendar API configuration
      firebase.ts             # Firebase admin configuration
    functions/                # Cloud Function implementations
      createCalendarEvent.ts  # Function to create calendar events
      deleteCalendarEvent.ts  # Function to delete calendar events
      deleteMeeting.ts        # Function to delete meetings
      getMeetings.ts          # Function to get meetings
      scheduleMeeting.ts      # Function to schedule meetings
    utils/                    # Utility functions
      calendarUtils.ts        # Calendar utility functions
      helpers.ts              # Helper functions
  dev-env.js                  # Development environment controller
```

## Development Environment Controller

The `dev-env.js` script gives you complete control over three key components:

1. **Functions**: Run cloud functions locally (emulator) or use the deployed production functions
2. **Firestore**: Use the local Firestore emulator or connect to the real production database
3. **Calendar/Meet**: Use mock calendar data (fake) or connect to the real Google Calendar API

## Quick Start

To start developing with the most common setup (local functions, real Firestore, mock calendar):

```bash
npm run dev:mock-real-db
```

This allows you to:
- Test your functions locally in real-time
- Store data in your real Firestore database
- Use mock calendar data (no real calendar events created)

## All Available Scripts

The package.json includes several pre-configured environments:

| Command | Description |
|---------|-------------|
| `npm run dev` | Run with default settings (all local) |
| `npm run dev:mock-real-db` | Local functions, real Firestore, mock calendar |
| `npm run dev:all-local` | Everything local (functions, Firestore, mock calendar) |
| `npm run dev:real-calendar` | Local functions, real Firestore, real calendar API |

## Custom Configuration

For complete control, you can use the `dev-env.js` script directly with custom flags:

```bash
node dev-env.js --functions=local --firestore=real --calendar=mock
```

### Available Options

Each component can be set to run locally or use the real/production version:

- `--functions=<local|real>`: Run functions in the emulator or use deployed functions
- `--firestore=<local|real>`: Use the Firestore emulator or real Firestore database
- `--calendar=<mock|real>`: Use mock calendar data or the real Google Calendar API

### Examples

1. Everything local (for completely isolated development):
   ```bash
   node dev-env.js --functions=local --firestore=local --calendar=mock
   ```

2. Local functions with real data services:
   ```bash
   node dev-env.js --functions=local --firestore=real --calendar=real
   ```

3. Just switch to real calendar while keeping everything else local:
   ```bash
   node dev-env.js --functions=local --firestore=local --calendar=real
   ```
    config/
      firebase.ts             # Firebase Admin initialization
      calendar.ts             # Google Calendar API setup
    utils/
      helpers.ts              # Helper utilities for common operations
    functions/
      scheduleMeeting.ts      # Creates meetings with Google Calendar integration
      getMeetings.ts          # Retrieves meetings from Firestore
      deleteMeeting.ts        # Deletes meetings from Firestore and Google Calendar
      createCalendarEvent.ts  # Creates a Google Calendar event with Meet link
      deleteCalendarEvent.ts  # Deletes a Google Calendar event
```

## Functions

### scheduleMeeting

This is the main function for creating meetings. It:
1. Creates a Google Calendar event with Google Meet integration
2. Stores the meeting details in Firestore
3. Returns the meeting data with the Google Meet link

### getMeetings

Retrieves all meetings from Firestore, with optional filtering by user ID.

### deleteMeeting

Deletes a meeting by:
1. Finding the meeting in Firestore
2. Deleting the associated Google Calendar event (if it exists)
3. Removing the meeting from Firestore

### createCalendarEvent

Creates a Google Calendar event with Google Meet integration. Returns the event ID and Meet link.

### deleteCalendarEvent

Deletes a Google Calendar event by ID.

## Deployment

To deploy these functions:

```bash
npm run build
firebase deploy --only functions
```

## Configuration

Update the Google Calendar API credentials in `src/config/calendar.ts` before deploying.

In production, you should use Firebase environment variables for sensitive information:

```bash
firebase functions:config:set serviceaccount.key="YOUR_KEY"
```

Then use `functions.config().serviceaccount.key` to access it.
