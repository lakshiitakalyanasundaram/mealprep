
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { usePreferences } from '../context/PreferencesContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreferencesForm from './PreferencesForm';

const MealPlanner = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { preferences } = usePreferences();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a meal planning query');
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate a meal plan based on preferences (frontend only)
      const preferencesText = `
Allergies: ${preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'None'}
Cuisines: ${preferences.cuisines.length > 0 ? preferences.cuisines.join(', ') : 'Any'}
Cooking Level: ${preferences.cookingLevel}
Meal Frequency: ${preferences.mealFrequency}
Leftovers to use: ${preferences.leftovers.length > 0 ? preferences.leftovers.join(', ') : 'None'}
      `;
      
      // Since we're removing OpenAI functionality, we'll generate a mock response
      setTimeout(() => {
        const mockResponse = generateMockMealPlan(query, preferences);
        setResponse(mockResponse);
        setLoading(false);
      }, 1500); // Simulate loading
      
    } catch (error) {
      console.error('Error:', error);
      setResponse(`Error generating meal plan. Please try again.`);
      setLoading(false);
    }
  };

  const generateMockMealPlan = (query: string, preferences: any) => {
    // Simple frontend-only meal plan generation based on preferences
    
    const mealIdeas = [
      { name: "Vegetable Stir Fry", cuisine: "Asian", level: "Beginner" },
      { name: "Spaghetti Bolognese", cuisine: "Italian", level: "Beginner" },
      { name: "Grilled Chicken Salad", cuisine: "American", level: "Beginner" },
      { name: "Beef Tacos", cuisine: "Mexican", level: "Beginner" },
      { name: "Vegetable Curry", cuisine: "Indian", level: "Intermediate" },
      { name: "Pad Thai", cuisine: "Thai", level: "Intermediate" },
      { name: "Ratatouille", cuisine: "French", level: "Intermediate" },
      { name: "Baked Salmon with Asparagus", cuisine: "European", level: "Intermediate" },
      { name: "Beef Wellington", cuisine: "British", level: "Advanced" },
      { name: "Soufflé", cuisine: "French", level: "Advanced" },
      { name: "Sushi Rolls", cuisine: "Japanese", level: "Advanced" },
      { name: "Beef Bourguignon", cuisine: "French", level: "Advanced" }
    ];
    
    // Filter based on preferences
    const filteredMeals = mealIdeas.filter(meal => {
      // Filter by cooking level
      if (preferences.cookingLevel === 'Beginner' && meal.level !== 'Beginner') return false;
      if (preferences.cookingLevel === 'Intermediate' && meal.level === 'Advanced') return false;
      
      // Filter by cuisine if preferences exist
      if (preferences.cuisines.length > 0 && !preferences.cuisines.some(c => meal.cuisine.toLowerCase().includes(c.toLowerCase()))) {
        return false;
      }
      
      return true;
    });
    
    // Generate meal plan based on frequency
    let mealPlanText = "";
    
    if (preferences.mealFrequency === 'Daily') {
      mealPlanText = generateDailyPlan(filteredMeals, preferences);
    } else if (preferences.mealFrequency === 'Weekly') {
      mealPlanText = generateWeeklyPlan(filteredMeals, preferences);
    } else {
      mealPlanText = generateMonthlyPlan(filteredMeals, preferences);
    }
    
    return mealPlanText;
  };
  
  const generateDailyPlan = (meals: any[], preferences: any) => {
    const selectedMeals = getRandomElements(meals, 3);
    
    let plan = `# Daily Meal Plan\n\n`;
    plan += `Based on your preferences, here's a meal plan for today:\n\n`;
    plan += `## Breakfast\n${selectedMeals[0]?.name || 'Oatmeal with fruits'}\n\n`;
    plan += `## Lunch\n${selectedMeals[1]?.name || 'Mixed green salad with protein'}\n\n`;
    plan += `## Dinner\n${selectedMeals[2]?.name || 'Baked chicken with vegetables'}\n\n`;
    
    if (preferences.leftovers.length > 0) {
      plan += `## Using Leftovers\nRecipe ideas incorporating your leftovers (${preferences.leftovers.join(', ')}):\n`;
      plan += `- ${getLeftoverRecipeIdea(preferences.leftovers[0])}\n`;
      if (preferences.leftovers.length > 1) {
        plan += `- ${getLeftoverRecipeIdea(preferences.leftovers[1])}\n`;
      }
      plan += `\n`;
    }
    
    plan += `## Grocery List\n`;
    plan += `- Proteins: Chicken, eggs\n`;
    plan += `- Vegetables: Spinach, carrots, bell peppers\n`;
    plan += `- Fruits: Bananas, apples\n`;
    plan += `- Grains: Rice, pasta\n`;
    plan += `- Dairy: Milk, cheese\n`;
    
    return plan;
  };
  
  const generateWeeklyPlan = (meals: any[], preferences: any) => {
    const selectedMeals = getRandomElements(meals, 7);
    
    let plan = `# Weekly Meal Plan\n\n`;
    plan += `Based on your preferences, here's your meal plan for the week:\n\n`;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach((day, index) => {
      plan += `## ${day}\n`;
      plan += `- Dinner: ${selectedMeals[index]?.name || 'Chef\'s choice meal'}\n\n`;
    });
    
    if (preferences.leftovers.length > 0) {
      plan += `## Using Leftovers\nRecipe ideas incorporating your leftovers (${preferences.leftovers.join(', ')}):\n`;
      preferences.leftovers.forEach((leftover: string) => {
        plan += `- ${getLeftoverRecipeIdea(leftover)}\n`;
      });
      plan += `\n`;
    }
    
    plan += `## Weekly Grocery List\n`;
    plan += `- Proteins: Chicken, beef, fish, eggs\n`;
    plan += `- Vegetables: Spinach, carrots, bell peppers, zucchini\n`;
    plan += `- Fruits: Bananas, apples, berries\n`;
    plan += `- Grains: Rice, pasta, bread\n`;
    plan += `- Dairy: Milk, cheese, yogurt\n`;
    
    return plan;
  };
  
  const generateMonthlyPlan = (meals: any[], preferences: any) => {
    let plan = `# Monthly Meal Planning Guide\n\n`;
    plan += `Based on your preferences, here's a framework for your monthly meal planning:\n\n`;
    
    plan += `## Week 1 Theme: Quick & Easy\n`;
    plan += `- Meal ideas: Stir-fries, sheet pan dinners, pasta dishes\n\n`;
    
    plan += `## Week 2 Theme: International Flavors\n`;
    if (preferences.cuisines.length > 0) {
      plan += `- Featured cuisines: ${preferences.cuisines.join(', ')}\n\n`;
    } else {
      plan += `- Try dishes from Italian, Mexican, and Asian cuisines\n\n`;
    }
    
    plan += `## Week 3 Theme: Batch Cooking\n`;
    plan += `- Make large portions of freezer-friendly meals: chili, casseroles, soups\n\n`;
    
    plan += `## Week 4 Theme: New Recipes\n`;
    plan += `- Challenge yourself with ${preferences.cookingLevel} level recipes\n\n`;
    
    if (preferences.leftovers.length > 0) {
      plan += `## Using Leftovers\nRecipe ideas incorporating your leftovers (${preferences.leftovers.join(', ')}):\n`;
      preferences.leftovers.forEach((leftover: string) => {
        plan += `- ${getLeftoverRecipeIdea(leftover)}\n`;
      });
      plan += `\n`;
    }
    
    plan += `## Monthly Staples Shopping List\n`;
    plan += `- Pantry: Rice, pasta, canned beans, spices\n`;
    plan += `- Freezer: Frozen vegetables, protein portions\n`;
    plan += `- Weekly fresh items: Vegetables, fruits, dairy\n`;
    
    return plan;
  };
  
  const getLeftoverRecipeIdea = (leftover: string) => {
    const ideas: {[key: string]: string} = {
      'rice': 'Fried rice with vegetables',
      'chicken': 'Chicken salad wraps',
      'pasta': 'Pasta frittata with herbs',
      'bread': 'Homemade croutons or breadcrumbs',
      'vegetables': 'Vegetable soup or stock',
      'potatoes': 'Potato pancakes',
      'beans': 'Bean and corn salad',
      'cheese': 'Cheese quesadillas with herbs'
    };
    
    return ideas[leftover.toLowerCase()] || `${leftover} stir-fry or add to soups`;
  };
  
  const getRandomElements = (array: any[], count: number) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <Tabs defaultValue="planner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="planner" className="mt-4 space-y-6">
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
                <CardDescription>
                  Based on your preferences and query
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">
                  {response}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-4">
          <PreferencesForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MealPlanner;
