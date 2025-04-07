
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG, updateApiKey } from '../config/apiConfig';
import { toast } from "sonner";

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState<string>(API_CONFIG.OPENAI_API_KEY || '');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim() === '') {
      toast.error('Please enter a valid API key');
      return;
    }
    
    updateApiKey(apiKey.trim());
    toast.success('API key saved successfully');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>OpenAI API Settings</CardTitle>
        <CardDescription>
          Enter your OpenAI API key to enable AI meal planning features.
          If you're experiencing quota errors, you may need to update your key or check your OpenAI billing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <div className="relative">
              <Input
                type={isVisible ? "text" : "password"}
                placeholder="Enter your OpenAI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-20"
              />
              <Button 
                type="button"
                variant="ghost" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? "Hide" : "Show"}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full">Save API Key</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ApiKeyForm;
