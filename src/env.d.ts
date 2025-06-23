/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Feature Flags (safe to expose)
  readonly VITE_USE_FIREBASE: string
  readonly VITE_USE_GOOGLE_CALENDAR: string
  readonly VITE_USE_FUNCTIONS_EMULATOR: string
  
  // Development Settings (safe to expose)
  readonly VITE_FUNCTIONS_EMULATOR_HOST: string
  readonly VITE_MOCK_MEET_LINK: string

  // Firebase Public Config (safe to expose - these are public values)
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
