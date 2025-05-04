import React, { useState } from 'react';
import { usePreferences, CookingLevel, MealFrequency, MealType } from '../context/PreferencesContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Utensils, ChefHat, CalendarDays } from 'lucide-react';
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox';

// Common allergens
const commonAllergens = [
  "Peanuts", "Tree Nuts", "Milk", "Eggs", "Fish",
  "Shellfish", "Wheat", "Soy", "Sesame"
];

// Common cuisines
const commonCuisines = [
  "Italian", "Mexican", "Chinese", "Japanese", "Indian",
  "Thai", "Mediterranean", "French", "American", "Greek"
];

// Common leftovers
const commonLeftovers = [
  "Rice", "Pasta", "Chicken", "Beef", "Vegetables",
  "Bread", "Beans", "Potatoes", "Tofu", "Fish"
];

const mealTypeOptions: MealType[] = ['Breakfast', 'Lunch', 'Dinner'];

const PreferencesForm: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    addAllergy,
    removeAllergy,
    addCuisine,
    removeCuisine,
    addLeftover,
    removeLeftover
  } = usePreferences();

  const [newAllergy, setNewAllergy] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const [newLeftover, setNewLeftover] = useState('');

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAllergy.trim()) {
      addAllergy(newAllergy.trim());
      setNewAllergy('');
      toast.success(`Added allergy: ${newAllergy.trim()}`);
    }
  };

  const handleAddCuisine = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCuisine.trim()) {
      addCuisine(newCuisine.trim());
      setNewCuisine('');
      toast.success(`Added cuisine: ${newCuisine.trim()}`);
    }
  };

  const handleAddLeftover = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLeftover.trim()) {
      addLeftover(newLeftover.trim());
      setNewLeftover('');
      toast.success(`Added leftover: ${newLeftover.trim()}`);
    }
  };

  const handleCookingLevelChange = (value: string) => {
    updatePreferences({ cookingLevel: value as CookingLevel });
  };

  const handleMealFrequencyChange = (value: string) => {
    updatePreferences({ mealFrequency: value as MealFrequency });
  };

  const handleQuickAddAllergy = (allergy: string) => {
    if (!preferences.allergies.includes(allergy)) {
      addAllergy(allergy);
      toast.success(`Added allergy: ${allergy}`);
    } else {
      toast.info(`${allergy} is already in your allergies list`);
    }
  };

  const handleQuickAddCuisine = (cuisine: string) => {
    if (!preferences.cuisines.includes(cuisine)) {
      addCuisine(cuisine);
      toast.success(`Added cuisine: ${cuisine}`);
    } else {
      toast.info(`${cuisine} is already in your cuisines list`);
    }
  };

  const handleQuickAddLeftover = (leftover: string) => {
    if (!preferences.leftovers.includes(leftover)) {
      addLeftover(leftover);
      toast.success(`Added leftover: ${leftover}`);
    } else {
      toast.info(`${leftover} is already in your leftovers list`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Allergies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <form onSubmit={handleAddAllergy} className="flex gap-2 flex-1">
              <Input
                placeholder="Enter allergy (e.g., peanuts)"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Add</Button>
            </form>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Quick Add</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white">
                {commonAllergens.map((allergen) => (
                  <DropdownMenuItem 
                    key={allergen}
                    onClick={() => handleQuickAddAllergy(allergen)}
                  >
                    {allergen}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.allergies.map((allergy) => (
              <Badge 
                key={allergy} 
                variant="outline" 
                className="px-3 py-1 cursor-pointer" 
                onClick={() => removeAllergy(allergy)}
              >
                {allergy} ×
              </Badge>
            ))}
            {preferences.allergies.length === 0 && (
              <span className="text-gray-500 text-sm">No allergies added yet</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Preferred Cuisines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <form onSubmit={handleAddCuisine} className="flex gap-2 flex-1">
              <Input
                placeholder="Enter cuisine (e.g., Italian)"
                value={newCuisine}
                onChange={(e) => setNewCuisine(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Add</Button>
            </form>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Quick Add</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white">
                {commonCuisines.map((cuisine) => (
                  <DropdownMenuItem 
                    key={cuisine}
                    onClick={() => handleQuickAddCuisine(cuisine)}
                  >
                    {cuisine}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.cuisines.map((cuisine) => (
              <Badge 
                key={cuisine} 
                variant="outline" 
                className="px-3 py-1 cursor-pointer" 
                onClick={() => removeCuisine(cuisine)}
              >
                {cuisine} ×
              </Badge>
            ))}
            {preferences.cuisines.length === 0 && (
              <span className="text-gray-500 text-sm">No cuisines added yet</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Leftovers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <form onSubmit={handleAddLeftover} className="flex gap-2 flex-1">
              <Input
                placeholder="Enter leftover ingredients (e.g., rice)"
                value={newLeftover}
                onChange={(e) => setNewLeftover(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Add</Button>
            </form>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Quick Add</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white">
                {commonLeftovers.map((leftover) => (
                  <DropdownMenuItem 
                    key={leftover}
                    onClick={() => handleQuickAddLeftover(leftover)}
                  >
                    {leftover}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.leftovers.map((leftover) => (
              <Badge 
                key={leftover} 
                variant="outline" 
                className="px-3 py-1 cursor-pointer" 
                onClick={() => removeLeftover(leftover)}
              >
                {leftover} ×
              </Badge>
            ))}
            {preferences.leftovers.length === 0 && (
              <span className="text-gray-500 text-sm">No leftovers added yet</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cooking Level</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={preferences.cookingLevel}
            onValueChange={handleCookingLevelChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Beginner" id="beginner" />
              <Label htmlFor="beginner">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Intermediate" id="intermediate" />
              <Label htmlFor="intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Advanced" id="advanced" />
              <Label htmlFor="advanced">Advanced</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Meal Planning Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={preferences.mealFrequency}
            onValueChange={handleMealFrequencyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Select Meals (per day)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            {mealTypeOptions.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={preferences.mealTypes.includes(type)}
                  onCheckedChange={(checked) => {
                    const newTypes = checked
                      ? [...preferences.mealTypes, type]
                      : preferences.mealTypes.filter((t) => t !== type);
                    updatePreferences({ mealTypes: newTypes });
                  }}
                  id={`mealtype-${type}`}
                />
                {type}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesForm;
