# Meal Prep AI Companion Backend

This is the backend service for the Meal Prep AI Companion chatbot. It uses FastAPI and the Gemini API to generate recipes based on user preferences.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Running the Server

To run the development server:
```bash
cd backend
uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`

## API Endpoints

### POST /api/chat
Generates a recipe based on user input and preferences.

Request body:
```json
{
    "message": "string",
    "preferences": {
        "allergies": ["string"],
        "cuisines": ["string"],
        "cookingLevel": "string",
        "mealFrequency": "string",
        "leftovers": ["string"]
    }
}
```

Response:
```json
{
    "response": "string"
}
```

## Notes
- Make sure to set your Gemini API key in the `.env` file
- The server is configured to accept requests from `http://localhost:5173` (default Vite dev server)
- If you're using a different frontend URL, update the CORS settings in `main.py` 