from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-pro')

# Pydantic models
class Preferences(BaseModel):
    allergies: List[str] = []
    cuisines: List[str] = []
    cookingLevel: str = "Beginner"
    mealFrequency: str = "Weekly"
    leftovers: List[str] = []
    mealTypes: List[str] = ["Breakfast", "Lunch", "Dinner"]

class ChatRequest(BaseModel):
    message: str
    preferences: Optional[Preferences] = None

def generate_recipe_prompt(message: str, preferences: Preferences) -> str:
    prompt = f"""You are a professional chef and meal planning expert. Generate a splendid, visually clear, and easy-to-read meal plan based on the following request and preferences:

User Request: {message}

User Preferences:
- Cooking Level: {preferences.cookingLevel}
- Meal Frequency: {preferences.mealFrequency}
- Allergies: {', '.join(preferences.allergies) if preferences.allergies else 'None'}
- Preferred Cuisines: {', '.join(preferences.cuisines) if preferences.cuisines else 'Any'}
- Available Leftovers: {', '.join(preferences.leftovers) if preferences.leftovers else 'None'}
- Meals per day: {', '.join(preferences.mealTypes)}

Please generate a meal plan for the week (7 days) if frequency is weekly, or for 20 days if frequency is monthly. For each day, include only the selected meals: {', '.join(preferences.mealTypes)}. For each meal, generate a unique recipe that matches the user's prompt and preferences. Each meal section should include:
- Meal type (e.g., Breakfast, Lunch, Dinner)
- Recipe name
- Short description
- Total cooking time
- Servings
- Ingredients list with measurements
- Step-by-step instructions
- Tips for success
- Nutritional information (calories, protein, carbs, fat)
- Storage and reheating instructions if applicable

Format the response as markdown, with clear sections for each day and each meal. Use headings for each day (e.g., ## Day 1) and for each meal (e.g., ### Breakfast). Make the plan visually splendid, easy to read, and well-organized for the user. Strictly avoid any allergens and use leftovers and preferred cuisines where possible. Each recipe must be tailored to the user's prompt and preferences.

Never output [object Object] or any non-text value. Always use plain text and markdown for all sections."""
    return prompt

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not request.preferences:
        return {
            "response": "Please set your preferences first before requesting recipes. You can set your preferences in the settings page."
        }
    
    try:
        prompt = generate_recipe_prompt(request.message, request.preferences)
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 