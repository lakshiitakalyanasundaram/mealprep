
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const Settings = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>About MealPrep Pal</CardTitle>
          <CardDescription>
            Your frontend-only meal planning assistant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            MealPrep Pal helps you plan your meals based on your preferences. You can set your:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>Food allergies</li>
            <li>Cuisine preferences</li>
            <li>Cooking skill level</li>
            <li>Meal planning frequency</li>
            <li>Leftover ingredients to use</li>
          </ul>
          <p className="mb-4">
            To set your preferences, go to the <Link to="/" className="text-green-600 hover:underline">Meal Planner</Link> page 
            and click on the "Preferences" tab.
          </p>
          <p>
            All data is stored locally in your browser and is never sent to any server.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
