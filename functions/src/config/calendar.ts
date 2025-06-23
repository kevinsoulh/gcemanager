import * as dotenv from 'dotenv';
import { calendar_v3, google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { MethodOptions } from 'googleapis-common';

dotenv.config();

export const CALENDAR_ID = process.env.APP_CALENDAR_ID || 'primary';
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Function to check if mock calendar should be used
const shouldUseMock = () => {
  const useMock = process.env.APP_USE_MOCK_CALENDAR === 'true' || process.env.NODE_ENV === 'development';
  console.log('📂 Calendar Mode:', useMock ? 'Mock' : 'Real', {
    NODE_ENV: process.env.NODE_ENV,
    APP_USE_MOCK_CALENDAR: process.env.APP_USE_MOCK_CALENDAR,
    APP_CALENDAR_ID: process.env.APP_CALENDAR_ID,
  });
  return useMock;
};

// Mock calendar implementation
const mockCalendar = {
  events: {
    insert: (params: calendar_v3.Params$Resource$Events$Insert, options?: MethodOptions) => {
      const eventId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const meetLink = `https://meet.google.com/mock-link-${eventId.slice(-5)}`;
      
      const mockEvent: calendar_v3.Schema$Event = {
        id: eventId,
        status: 'confirmed',
        hangoutLink: meetLink,
        ...params.requestBody,
        kind: 'calendar#event',
        etag: `"${Date.now()}"`,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };

      return Promise.resolve({
        config: {},
        data: mockEvent,
        headers: { 'content-type': 'application/json' },
        status: 200,
        statusText: 'OK'
      });
    },

    list: (params: calendar_v3.Params$Resource$Events$List, options?: MethodOptions) => {
      const mockEventsList: calendar_v3.Schema$Events = {
        kind: 'calendar#events',
        etag: `"${Date.now()}"`,
        summary: 'Mock Calendar',
        description: 'Mock Calendar Events',
        updated: new Date().toISOString(),
        timeZone: 'UTC',
        accessRole: 'owner',
        items: []
      };

      return Promise.resolve({
        config: {},
        data: mockEventsList,
        headers: { 'content-type': 'application/json' },
        status: 200,
        statusText: 'OK'
      });
    },
    
    patch: (params: calendar_v3.Params$Resource$Events$Patch, options?: MethodOptions) => {
      const mockEvent: calendar_v3.Schema$Event = {
        id: params.eventId || `mock-${Date.now()}`,
        status: 'confirmed',
        ...params.requestBody,
        kind: 'calendar#event',
        etag: `"${Date.now()}"`,
        updated: new Date().toISOString(),
      };

      return Promise.resolve({
        config: {},
        data: mockEvent,
        headers: { 'content-type': 'application/json' },
        status: 200,
        statusText: 'OK'
      });
    },
    
    delete: (params: calendar_v3.Params$Resource$Events$Delete, options?: MethodOptions) => {
      console.log('🔧 Using mock calendar - simulating delete');
      return Promise.resolve({
        config: {},
        data: undefined,
        headers: { 'content-type': 'application/json' },
        status: 204,
        statusText: 'No Content'
      });
    }
  }
};

// Real Google Calendar implementation
const initializeRealCalendar = () => {
  try {
    const serviceAccountPath = process.env.APP_CREDENTIALS_PATH;
    if (!serviceAccountPath) {
      throw new Error('APP_CREDENTIALS_PATH environment variable is not set');
    }
    
    const absolutePath = serviceAccountPath.startsWith('.')
      ? path.resolve(__dirname, '..', '..', serviceAccountPath)
      : serviceAccountPath;
    
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Service account file not found at: ${absolutePath}`);
    }

    const serviceAccountKey = require(absolutePath);
    const privateKey = serviceAccountKey.private_key.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT({
      email: serviceAccountKey.client_email,
      key: privateKey,
      keyId: serviceAccountKey.private_key_id,
      scopes: SCOPES,
      subject: process.env.APP_IMPERSONATION_EMAIL
    });

    return google.calendar({ version: 'v3', auth: jwtClient });
  } catch (error) {
    console.error('Failed to initialize real calendar:', error);
    return null;
  }
};

// Export the appropriate calendar implementation
export const calendar = shouldUseMock() ? mockCalendar : initializeRealCalendar() || mockCalendar;

// Authorization function that adapts based on the implementation
export const authorizeCalendar = async (): Promise<void> => {
  if (shouldUseMock()) {
    console.log('🔧 Using mock calendar - no authentication needed');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const auth = (calendar as any)._options?.auth;
    if (!auth) {
      reject(new Error('No authentication client available'));
      return;
    }

    auth.authorize((err: Error | null, tokens: any) => {
      if (err) {
        console.error('❌ Failed to authenticate with Google Calendar API:', err);
        reject(err);
        return;
      }
      
      console.log('✅ Successfully authenticated with Google Calendar API');
      console.log('✅ Access token received:', !!tokens?.access_token);
      resolve();
    });
  });
};


