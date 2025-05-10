# RealStateAPP

A real estate application built with React Native and Expo.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Running the App

### Using Batch Files

For convenience, several batch files have been created to run the app:

- `start-app.bat` - Start the app in development mode
- `start-android.bat` - Start the app on Android
- `start-web.bat` - Start the app on the web
- `start-clear.bat` - Clear the cache and start the app

Simply double-click on any of these batch files to run the app.

### Using npm Scripts

Alternatively, you can use npm scripts to run the app:

```bash
# Start the app in development mode
npm start

# Start the app on Android
npm run android

# Start the app on iOS
npm run ios

# Start the app on the web
npm run web

# Clear the cache and start the app
npm run start-clear
```

## Troubleshooting

If you encounter the error "Unknown command: 'expo'", try using the batch files or the npm scripts that use `npx expo` instead of `expo` directly.

If you still encounter issues, try the following:

1. Install Expo CLI globally:

```bash
npm install -g expo-cli
```

2. Clear the npm cache:

```bash
npm cache clean --force
```

3. Reinstall dependencies:

```bash
npm install
```

4. Start the app with cache clearing:

```bash
npm run start-clear
```

## Features

- Browse real estate listings
- Search for properties
- View property details
- Add new properties
- Take photos with the camera
- Upload images from the gallery
