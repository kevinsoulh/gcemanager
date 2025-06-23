// Feature flags configuration
// These flags control which features and implementations are active

interface FeatureFlags {
  useFirebase: boolean;
  useGoogleCalendar: boolean;
}

// Set feature flags based on environment variables
const features: FeatureFlags = {
  // Set to true to use Firebase Firestore instead of localStorage
  useFirebase: import.meta.env.VITE_USE_FIREBASE === 'true',
  
  // Set to true to use actual Google Calendar API instead of mock
  useGoogleCalendar: import.meta.env.VITE_USE_GOOGLE_CALENDAR === 'true',
};

// In production, we enable Firebase by default
if (import.meta.env.PROD) {
  features.useFirebase = import.meta.env.VITE_USE_FIREBASE !== 'false'; // default to true unless explicitly disabled
}

console.log('🚩 Feature flags:', features);

export default features;
