
import React from 'react';
import MealPlanner from '../components/MealPlanner';

const Index = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-700">Welcome to MealPrep Pal</h1>
        <p className="text-xl text-gray-600">
          Your AI assistant for personalized meal plans, grocery lists, and food waste reduction.
        </p>
      </div>
      
      <MealPlanner />
    </div>
  );
};

export default Index;
