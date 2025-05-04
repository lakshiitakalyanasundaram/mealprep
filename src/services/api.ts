import { Preferences } from "@/context/PreferencesContext";

const API_BASE_URL = "http://localhost:8000";

export interface ChatResponse {
  response: string;
}

export const sendChatMessage = async (
  message: string,
  preferences: Preferences
): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        preferences,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.detail || 
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending chat message:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to connect to the server: ${error.message}`);
    }
    throw new Error("Failed to connect to the server. Please make sure the backend is running.");
  }
}; 