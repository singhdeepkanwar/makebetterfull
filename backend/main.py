from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from typing import Dict, Any, List, Optional
import os
app = FastAPI()

# --- CONFIGURATION (Keep your credentials!) ---
SUPABASE_URL = os.getenv("SUPABASE_URL") 
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: Supabase credentials not found in environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
origins = [
    "http://localhost:5173",                 # Local development
    "https://makebetterfull.vercel.app",     # Your Vercel Frontend
    "https://makebetterfull.vercel.app/",     # Trailing slash variation (just in case)
    "https://www.makebetter.tech",               # Your custom domain
    "https://www.makebetter.tech/",              # Trailing slash variation (just in case)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class HeroSection(BaseModel):
    badge: str
    headline_part1: str
    headline_highlight: str
    subheadline: str
    cta_primary: str
    cta_secondary: str

class AboutSection(BaseModel):
    badge: str
    headline: str
    description: str
    image_url: str

class ServiceItem(BaseModel):
    title: str
    description: str

class StatsItem(BaseModel):
    value: str
    label: str

class ContentSchema(BaseModel):
    hero: HeroSection
    about: Optional[AboutSection] = None # Made optional to prevent errors if DB is empty
    services: List[ServiceItem]
    stats: List[StatsItem]
    contact_email: str
    contact_phone: str

class LeadSchema(BaseModel):
    name: str
    company: str
    email: str
    message: str

# --- ENDPOINTS ---

@app.get("/api/content", response_model=ContentSchema)
async def get_content():
    """Fetch content from Supabase"""
    try:
        response = supabase.table("site_content").select("content").eq("id", 1).execute()
        if not response.data:
            return {"error": "No content found"}
        return response.data[0]['content']
    except Exception as e:
        # If DB schema doesn't match Pydantic, return raw data or handle error
        print(f"Error fetching content: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/content")
async def update_content(new_content: Dict[str, Any]):
    """Update content in Supabase"""
    try:
        response = supabase.table("site_content").update({"content": new_content}).eq("id", 1).execute()
        return {"message": "Updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/contact")
async def submit_lead(lead: LeadSchema):
    """Save form submission"""
    try:
        response = supabase.table("leads").insert(lead.dict()).execute()
        return {"message": "Lead captured"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leads")
async def get_leads():
    """Fetch all leads"""
    try:
        response = supabase.table("leads").select("*").order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)