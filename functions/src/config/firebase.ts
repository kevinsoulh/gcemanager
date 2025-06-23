import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const isLocalMode = process.env.USE_LOCAL_FUNCTIONS === 'true';
const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

if (!admin.apps.length) {
  try {
    const projectId = process.env.APP_PROJECT_ID;
    let initOptions: admin.AppOptions = { projectId };

    if (!isEmulator) {
      const serviceAccountPath = process.env.APP_SERVICE_ACCOUNT;
      if (!serviceAccountPath) {
        throw new Error('APP_SERVICE_ACCOUNT environment variable is not set');
      }

      const absolutePath = path.resolve(serviceAccountPath);
      initOptions.credential = admin.credential.cert(absolutePath);
    }

    admin.initializeApp(initOptions);
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

// Collection names in Firestore
export const MEETINGS_COLLECTION = 'meetings';
export const CALENDAR_EVENTS_COLLECTION = 'calendar_events';

export const db = getFirestore();

console.log('Firebase Configuration:', {
  projectId: process.env.APP_PROJECT_ID,
  localMode: isLocalMode,
  emulator: isEmulator,
  emulatorHost: process.env.FIRESTORE_EMULATOR_HOST || 'none'
});

export { admin, isLocalMode, isEmulator };
