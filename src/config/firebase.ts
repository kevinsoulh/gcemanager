// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration loaded from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

// Connect to the Firebase Emulator based on environment variables
if (import.meta.env.VITE_USE_FUNCTIONS_EMULATOR === 'true') {
  const emulatorHost = import.meta.env.VITE_FUNCTIONS_EMULATOR_HOST || 'http://localhost:5001';
  const url = new URL(emulatorHost);
  console.log('📂 Connecting to Functions emulator:', emulatorHost);
  connectFunctionsEmulator(functions, url.hostname, parseInt(url.port) || 5001);
}

export { app, functions };
