# GCE Manager

A modern web application for scheduling and managing Google Calendar Events with Google Meet integration, featuring a mock calendar mode for development and testing.

## Features

- **Modern UI**: Built with React, Shadcn/UI, and Tailwind CSS
- **Meeting Management**: Create, update, and delete meetings with title, description, date/time, and participants
- **Development Modes**: 
  - Mock Calendar mode for local development without Google Calendar API
  - Local Storage mode for frontend-only development
  - Full Firebase integration with Google Calendar for production
- **Responsive Design**: Mobile-first design with desktop optimizations
- **Form Validation**: Built-in validation using React Hook Form and Zod
- **Professional UI**: Clean, minimalist design with loading states and error handling

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Shadcn/UI** components with Tailwind CSS
- **React Hook Form** for form handling
- **Firebase SDK** for Cloud Functions
- **date-fns** for date operations

### Backend
- **Firebase Cloud Functions** with TypeScript
- **Firestore** for data persistence
- **Google Calendar API** (optional, can use mock mode)
- **Firebase Emulator** support for local development

## Project Structure

```
gcemanager/
├── functions/                      # Firebase Cloud Functions
│   ├── src/
│   │   ├── config/                # Backend configuration
│   │   │   ├── calendar.ts        # Calendar service setup
│   │   │   └── firebase.ts        # Firebase admin setup
│   │   ├── functions/             # Cloud Functions
│   │   │   ├── createCalendarEvent.ts
│   │   │   ├── deleteCalendarEvent.ts
│   │   │   ├── deleteMeeting.ts
│   │   │   ├── getMeetings.ts
│   │   │   ├── scheduleMeeting.ts
│   │   │   └── updateMeeting.ts
│   │   └── utils/                 # Backend utilities
│   │       ├── calendarUtils.ts   # Calendar operations
│   │       └── helpers.ts         # Shared utilities
│   ├── package.json              # Backend dependencies
│   └── .env files               # Backend environment config
├── src/                         # Frontend source code
│   ├── App.tsx                 # Root component
│   ├── App.css                # Root styles
│   ├── main.tsx               # Application entry point
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn UI components
│   │   ├── MeetingCard.tsx   # Meeting display
│   │   ├── MeetingEditModal.tsx # Meeting editing
│   │   ├── MeetingsList.tsx  # Meetings list
│   │   └── MeetingScheduler.tsx # Meeting creation
│   ├── config/               # Frontend configuration
│   │   ├── firebase.ts      # Firebase client setup
│   │   └── features.ts      # Feature flags
│   ├── hooks/               # Custom React hooks
│   │   ├── useMeetings.ts  # Meeting management
│   │   ├── use-mobile.tsx  # Responsive utilities
│   │   └── use-toast.ts    # Toast notifications
│   ├── pages/               # Page components
│   │   ├── Index.tsx       # Main meetings page
│   │   └── NotFound.tsx    # 404 page
│   ├── services/           # Frontend services
│   │   ├── calendar.ts    # Calendar service
│   │   ├── firebase.ts    # Firebase operations
│   │   ├── functions.ts   # Cloud Functions client
│   │   └── localStorage.ts # Local storage service
│   └── lib/               # Utility functions
│       └── utils.ts      # Shared utilities
├── config files              # Project configuration
│   ├── .env files          # Environment variables
│   ├── .firebaserc         # Firebase project config
│   ├── firebase.json       # Firebase service config
│   ├── firestore.rules     # Firestore security rules
│   ├── components.json     # Shadcn/UI components config
│   ├── eslint.config.js    # ESLint configuration
│   ├── postcss.config.js   # PostCSS configuration
│   ├── tailwind.config.ts  # Tailwind CSS configuration
│   ├── tsconfig.json       # TypeScript base config
│   ├── tsconfig.app.json   # App TypeScript config
│   └── tsconfig.node.json  # Node TypeScript config
├── public/                 # Static assets
│   ├── favicon.ico        # Site favicon
│   ├── robots.txt         # Robots configuration
│   └── placeholder.svg    # Placeholder images
├── package.json           # Frontend dependencies
└── index.html            # HTML entry point
```

## Backend Architecture

The backend is built with Firebase Cloud Functions and supports three modes:

1. **Mock Calendar Mode** (`APP_USE_MOCK_CALENDAR=true`):
   - Uses Firestore for data storage
   - Generates mock Google Meet links
   - No Google Calendar API authentication needed

2. **Local Development**:
   - Uses Firebase Emulator Suite
   - Can work with either mock or real calendar
   - Supports hot reloading

3. **Production Mode**:
   - Full Firebase Functions deployment
   - Real Google Calendar API integration
   - Proper error handling and logging

## Feature Flags and Environment Configuration

The application uses feature flags and environment variables to control its behavior. These can be configured in your `.env` file:

```dotenv
# Feature Flags
VITE_USE_FIREBASE=true         # Use Firebase instead of localStorage
VITE_USE_GOOGLE_CALENDAR=false # Use real Calendar API instead of mock

# Development Configuration
VITE_USE_FUNCTIONS_EMULATOR=true           # Use local Firebase Functions
VITE_FUNCTIONS_EMULATOR_HOST=http://localhost:5001

# Backend Mode (in functions/.env)
APP_USE_MOCK_CALENDAR=true     # Use mock calendar in backend
USE_LOCAL_FUNCTIONS=true       # Use local functions instead of deployed ones
```

The feature flags control the following behaviors:

1. **Frontend Storage Mode** (`VITE_USE_FIREBASE`):
   - When `true`: Uses Firebase Cloud Functions and Firestore
   - When `false`: Uses localStorage for offline development
   - Defaults to `true` in production unless explicitly disabled

2. **Calendar Integration** (`VITE_USE_GOOGLE_CALENDAR` and `APP_USE_MOCK_CALENDAR`):
   - Frontend flag controls whether to expect Calendar features
   - Backend flag controls whether to use mock or real Google Calendar
   - Can run in mock mode even in production if needed

3. **Functions Environment** (`VITE_USE_FUNCTIONS_EMULATOR` and `USE_LOCAL_FUNCTIONS`):
   - Controls whether to use local Firebase emulator or deployed functions
   - Allows full local development without deploying
   - Configure emulator host and ports as needed

This configuration allows for several development modes:
- Full local development with emulators
- Local frontend with production backend
- Full production mode
- Mixed modes (e.g., production functions with mock calendar)

## Frontend Service Layer

The frontend service layer is implemented with a clean separation of concerns:

1. **src/services/firebase.ts**: Main service interface with conditional implementations
2. **src/services/functions.ts**: Client-side wrappers for Cloud Functions
3. **src/services/localStorage.ts**: Mock implementation for local development
4. **src/hooks/useMeetings.ts**: Custom hook for components to access meeting functionality

Components never access backend services directly; they always use the `useMeetings` hook.

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/bun
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project (for deployment)

### Local Development Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/yourusername/gcemanager.git
   cd gcemanager
   npm install
   cd functions
   npm install
   ```

2. Configure environment:
   - Copy `.env.example` to `.env` in both root and `/functions`
   - For mock calendar mode (recommended for development):
     ```env
     APP_USE_MOCK_CALENDAR=true
     APP_CALENDAR_ID=primary
     APP_PROJECT_ID=your-project-id
     NODE_ENV=development
     ```

3. Start development servers:
   ```bash
   # Terminal 1: Start Firebase emulators
   firebase emulators:start

   # Terminal 2: Start Vite dev server
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Firebase Emulator UI: http://localhost:4000

### Production Setup

1. Create a Firebase project and enable:
   - Cloud Functions
   - Firestore Database

2. Configure service account:
   - Download service account JSON from Firebase Console
   - Place it in project root (it's gitignored)
   - Update `APP_CREDENTIALS_PATH` in environment files

3. Deploy:
   ```bash
   # Deploy Firebase Functions
   cd functions
   npm run deploy

   # Build and deploy frontend
   cd ..
   npm run build
   firebase deploy --only hosting
   ```

### Environment Variables

The application uses the following environment variables:

```env
# Required
APP_USE_MOCK_CALENDAR=true/false    # Use mock calendar mode
APP_CALENDAR_ID=primary             # Google Calendar ID
APP_PROJECT_ID=your-project-id      # Firebase project ID
APP_CREDENTIALS_PATH=../service-account.json  # Path to service account

# Optional
FIRESTORE_EMULATOR_HOST=localhost:8081  # For local development
```

See `.env.example` for a complete list of available options.
- Firebase account

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd gcemanager
npm install
```

### Step 2: Firebase Project Setup

1. **Create Firebase Project**
   ```bash
   firebase login
   firebase init
   ```
   - Select Firestore, Functions, and Hosting
   - Choose your Firebase project or create a new one
   - Use default settings for Firestore
   - Select TypeScript for Functions
   - Install dependencies

2. **Enable Required APIs in Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your Firebase project
   - Enable Google Calendar API
   - Enable Firebase APIs (automatically enabled)

### Step 3: Service Account Setup

1. **Create Service Account**
   - In Google Cloud Console, go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name: `calendar-scheduler`
   - Grant roles: `Calendar Editor`, `Firebase Admin`

2. **Generate Service Account Key**
   - Click on your service account
   - Go to Keys tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the key file

3. **Configure Service Account in Functions**
   - Replace the `SERVICE_ACCOUNT_KEY` object in `functions/src/index.ts` with your downloaded key
   - **Important**: Never commit real credentials to git!

### Step 4: Enable Feature Flags

To start using Firebase and Google Calendar:

1. Edit `src/config/features.ts`:
   ```typescript
   const features: FeatureFlags = {
     // Set to true to use Firebase Firestore instead of localStorage
     useFirebase: true, 
     
     // Set to true to use actual Google Calendar API instead of mock
     useGoogleCalendar: true,
   };
   ```

2. Deploy Firebase Functions:
   ```bash
   cd functions
   npm install
   npm run deploy
   ```

### Step 4: Calendar Configuration

1. **Domain-wide Delegation (Optional but Recommended)**
   - In Google Cloud Console, go to your service account
   - Enable "Domain-wide delegation"
   - Note the Client ID
   - In Google Workspace Admin (if applicable), authorize the client

2. **Update Calendar ID**
   - In `functions/src/index.ts`, update `CALENDAR_ID`
   - Use `'primary'` for the service account's calendar
   - Or specify a specific calendar ID

### Step 5: Deploy Backend

```bash
cd functions
npm install
cd ..
firebase deploy --only functions,firestore
```

### Step 6: Update Frontend Configuration

1. **Get Firebase Config**
   - In Firebase Console, go to Project Settings
   - Copy your web app's Firebase configuration

2. **Update Frontend**
   - Replace placeholder config in `src/services/firebase.ts`
   - Uncomment the Firebase SDK calls
   - Install Firebase SDK:
   ```bash
   npm install firebase
   ```

### Step 7: Run Development Server

```bash
npm run dev
```

## Environment Variables

For production, use Firebase Functions config:

```bash
firebase functions:config:set calendar.service_account="$(cat path/to/service-account-key.json)"
```

Then update your function to use:
```javascript
const serviceAccount = functions.config().calendar.service_account;
```

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use Firebase Functions config** for production secrets
3. **Implement proper Firestore security rules**
4. **Add Firebase Authentication** for user management
5. **Validate all inputs** on both client and server
6. **Use HTTPS only** for production

## Production Deployment

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy
   ```

3. **Set up Custom Domain** (optional)
   - In Firebase Console, go to Hosting
   - Add custom domain
   - Follow DNS configuration steps

## Development Environment

The project includes a flexible development environment controller that allows you to mix and match:

1. **Functions**: Run locally (emulator) or use deployed functions
2. **Firestore**: Use local emulator or real production database
3. **Calendar/Meet**: Use mock implementation or real Google Calendar API

### Running Different Configurations

```bash
# Default: Everything local with mock calendar
cd functions
npm run dev

# Local functions + real Firestore + mock calendar
npm run dev:mock-real-db

# Everything local
npm run dev:all-local

# Local functions + real Firestore + real calendar
npm run dev:real-calendar

# Custom configuration
npm run build && node dev-env.js --functions=local --firestore=real --calendar=mock
```

### Debug Commands

```bash
# View Firebase Functions logs
firebase functions:log

# Test functions locally
firebase emulators:start --only functions

# Check Firestore data
firebase firestore:rules
```

## Features in Detail

### Meeting Scheduling Form
- Title and description input
- Date picker with calendar interface
- Time selection
- Email participant management with validation
- Form validation using Zod schema

### Meetings List
- Upcoming and past meetings separation
- Meeting status indicators
- Quick actions (Join, Copy link)
- Responsive card layout

### Real-time Updates
- Automatic refresh when new meetings are created
- Loading states for better UX
- Error handling with toast notifications

## Architecture Notes

This application follows a clean architecture where:

1. **Backend Integration**: All Firebase, Firestore, and Google Calendar API integrations happen exclusively in the backend (Firebase Cloud Functions)
2. **Client-Server Communication**: The client code only interacts with the backend through HTTP callable functions (no direct Firestore access)
3. **Feature Flags**: Toggle between localStorage (client-only) and Firebase (backend) implementations
4. **Separation of Concerns**: UI components are completely separate from data operations

This architecture ensures:
- Better security (API keys and logic remain on the server)
- Cleaner client code (UI components don't need to know about implementation details)
- Easier maintenance (backend changes don't require client changes)
- Flexibility (can switch between implementations without changing UI components)

## Development Modes

### Mock Calendar Mode

The application includes a mock calendar mode that simulates Google Calendar integration without requiring actual API access. This is useful for:
- Local development without Google Calendar setup
- Testing meeting management features
- CI/CD pipelines
- Demo environments

To enable mock mode, set in your environment:
```env
APP_USE_MOCK_CALENDAR=true
```

In mock mode:
- Calendar events are stored in Firestore
- Meet links are generated with mock URLs
- No Google Calendar API authentication is needed
- All CRUD operations work normally

### Local Storage Mode

For pure frontend development, you can disable Firebase completely:

```typescript
// src/config/features.ts
const features = {
  useFirebase: false,
  useGoogleCalendar: false
};
```

This mode:
- Stores all data in browser localStorage
- Works without any backend services
- Perfect for UI development and testing
- Includes simulated API delays for realism

### Production Mode

When deploying to production:
1. Disable mock calendar mode
2. Configure proper service account credentials
3. Enable Firebase features
4. Deploy both functions and frontend

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.
