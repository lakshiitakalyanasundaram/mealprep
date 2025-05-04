
// This file is now just a placeholder since we've removed API functionality
export const API_CONFIG = {
  // This is a frontend-only app now
  APP_VERSION: '1.0.0',
  OPENAI_API_KEY: '',  // Added empty key to avoid errors
};

// Adding placeholder function for updateApiKey to fix type errors
export const updateApiKey = (key: string) => {
  console.log('This is a frontend-only app. API key updates are not functional.');
  return false;
};
