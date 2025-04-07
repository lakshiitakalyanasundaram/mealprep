
import { API_CONFIG } from '../config/apiConfig';
import { toast } from "sonner";

export interface MessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function chatWithAI(messages: MessageProps[]) {
  if (!API_CONFIG.OPENAI_API_KEY) {
    throw new Error('API key not found. Please set your OpenAI API key.');
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      
      // Special handling for quota errors
      if (error.error?.type === 'insufficient_quota') {
        toast.error('OpenAI API quota exceeded. Please update your API key or check your billing.');
        throw new Error('OpenAI API quota exceeded. Please check your billing details.');
      }
      
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in AI request:', error);
    throw error;
  }
}
