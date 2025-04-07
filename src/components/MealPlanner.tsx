
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { chatWithAI, MessageProps } from '../services/openaiService';
import { API_CONFIG } from '../config/apiConfig';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const MealPlanner = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState<boolean>(!API_CONFIG.OPENAI_API_KEY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!API_CONFIG.OPENAI_API_KEY) {
      toast.error('Please set your OpenAI API key in Settings');
      setShowApiKeyWarning(true);
      return;
    }
    
    if (!query.trim()) {
      toast.error('Please enter a meal planning query');
      return;
    }
    
    setLoading(true);
    setShowApiKeyWarning(false);
    
    try {
      const messages: MessageProps[] = [
        {
          role: 'system',
          content: 'You are GrubGenius, an AI meal planning assistant. Help users with meal recommendations, grocery lists, and food waste reduction.' +
          '\n\nWhen recommending meals:' +
          '\n- Provide personalized meal ideas based on preferences' +
          '\n- Consider dietary restrictions and preferences' +
          '\n- Suggest seasonal and nutritionally balanced options' +
          '\n\nWhen generating grocery lists:' +
          '\n- Organize ingredients by store section (produce, dairy, etc.)' +
          '\n- Indicate approximate quantities needed' +
          '\n- Highlight items that can be used across multiple meals'
        },
        { role: 'user', content: query }
      ];
      
      const result = await chatWithAI(messages);
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
      if ((error as Error).message.includes('quota exceeded')) {
        setResponse('Sorry, the API quota has been exceeded. Please update your OpenAI API key in Settings or check your billing details.');
      } else {
        setResponse(`Error: ${(error as Error).message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {showApiKeyWarning && (
        <Card className="border-amber-500">
          <CardContent className="pt-6">
            <p className="text-amber-600">
              ⚠️ Please set your OpenAI API key in Settings before using the meal planner.
            </p>
          </CardContent>
        </Card>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Ask about meal ideas, grocery lists, or ways to reduce food waste..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating meal plan...
            </>
          ) : (
            'Generate Meal Plan'
          )}
        </Button>
      </form>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Your Meal Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap">
              {response}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MealPlanner;
