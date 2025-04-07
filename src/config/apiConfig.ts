
// API configuration
export const API_CONFIG = {
  // Default to empty string, will be set by user
  OPENAI_API_KEY: localStorage.getItem('OPENAI_API_KEY') || '',
};

export const updateApiKey = (key: string) => {
  localStorage.setItem('OPENAI_API_KEY', key);
  API_CONFIG.OPENAI_API_KEY = key;
};
