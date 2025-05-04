
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our preferences
export type CookingLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type MealFrequency = 'Daily' | 'Weekly' | 'Monthly';

export interface Preferences {
  allergies: string[];
  cuisines: string[];
  cookingLevel: CookingLevel;
  mealFrequency: MealFrequency;
  leftovers: string[];
}

// Default preferences state
const defaultPreferences: Preferences = {
  allergies: [],
  cuisines: [],
  cookingLevel: 'Beginner',
  mealFrequency: 'Weekly',
  leftovers: [],
};

// Create the context
type PreferencesContextType = {
  preferences: Preferences;
  updatePreferences: (newPreferences: Partial<Preferences>) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  addCuisine: (cuisine: string) => void;
  removeCuisine: (cuisine: string) => void;
  addLeftover: (leftover: string) => void;
  removeLeftover: (leftover: string) => void;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Provider component
export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  const updatePreferences = (newPreferences: Partial<Preferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const addAllergy = (allergy: string) => {
    if (!preferences.allergies.includes(allergy)) {
      setPreferences(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy]
      }));
    }
  };

  const removeAllergy = (allergy: string) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addCuisine = (cuisine: string) => {
    if (!preferences.cuisines.includes(cuisine)) {
      setPreferences(prev => ({
        ...prev,
        cuisines: [...prev.cuisines, cuisine]
      }));
    }
  };

  const removeCuisine = (cuisine: string) => {
    setPreferences(prev => ({
      ...prev,
      cuisines: prev.cuisines.filter(c => c !== cuisine)
    }));
  };

  const addLeftover = (leftover: string) => {
    if (!preferences.leftovers.includes(leftover)) {
      setPreferences(prev => ({
        ...prev,
        leftovers: [...prev.leftovers, leftover]
      }));
    }
  };

  const removeLeftover = (leftover: string) => {
    setPreferences(prev => ({
      ...prev,
      leftovers: prev.leftovers.filter(l => l !== leftover)
    }));
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        addAllergy,
        removeAllergy,
        addCuisine,
        removeCuisine,
        addLeftover,
        removeLeftover
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook for using the preferences context
export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
