from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .database import Base, engine, get_db
from . import models
from .auth import get_current_user
from .crop_rules import generate_crop_plan
from .chatbot_rules import match_answer
from sqlalchemy.orm import Session

# ------------------------------
# Pydantic models for request/response
# ------------------------------

class ProfileCreate(BaseModel):
    name: str
    location: str
    preferred_language: str

class FieldCreate(BaseModel):
    land_area_acres: float
    crop_selection: str
    water_availability: str
    investment_level: str

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

# ------------------------------
# FastAPI app
# ------------------------------

app = FastAPI(title="AgriAI MVP Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)

# ------------------------------
# Public endpoints
# ------------------------------

@app.get("/")
def root() -> dict:
    return {"message": "AgriAI backend is running"}

@app.get("/health")
def health() -> dict:
    return {"status": "ok"}

# ------------------------------
# Protected endpoints (require Firebase token)
# ------------------------------

@app.get("/me")
def read_me(current_user: dict = Depends(get_current_user)):
    """Return decoded Firebase token payload."""
    return current_user

# Save or update farmer profile
@app.post("/profile")
def create_profile(
    payload: ProfileCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    firebase_uid = current_user["sub"]
    # Check if profile already exists
    existing = db.query(models.FarmerProfile).filter(models.FarmerProfile.firebase_uid == firebase_uid).first()
    if existing:
        # Update
        existing.name = payload.name
        existing.location = payload.location
        existing.preferred_language = payload.preferred_language
        db.commit()
        return {"message": "Profile updated", "profile_id": existing.id}
    else:
        # Create
        profile = models.FarmerProfile(
            firebase_uid=firebase_uid,
            name=payload.name,
            location=payload.location,
            preferred_language=payload.preferred_language,
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return {"message": "Profile created", "profile_id": profile.id}

# Save a field input for the logged-in farmer
@app.post("/fields")
def create_field(
    payload: FieldCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    firebase_uid = current_user["sub"]
    # Get the farmer profile
    farmer = db.query(models.FarmerProfile).filter(models.FarmerProfile.firebase_uid == firebase_uid).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found. Create profile first.")
    field = models.Field(
        farmer_id=farmer.id,
        land_area_acres=payload.land_area_acres,
        crop_selection=payload.crop_selection,
        water_availability=payload.water_availability,
        investment_level=payload.investment_level,
    )
    db.add(field)
    db.commit()
    db.refresh(field)
    return {"message": "Field saved", "field_id": field.id}

# Generate a crop plan for the latest field of the logged-in farmer
@app.get("/plan")
def get_plan(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    firebase_uid = current_user["sub"]
    farmer = db.query(models.FarmerProfile).filter(models.FarmerProfile.firebase_uid == firebase_uid).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found.")
    # Get the latest field entry
    latest_field = db.query(models.Field).filter(models.Field.farmer_id == farmer.id).order_by(models.Field.created_at.desc()).first()
    if not latest_field:
        raise HTTPException(status_code=404, detail="No field data found. Submit field details first.")
    plan = generate_crop_plan(
        crop=latest_field.crop_selection,
        land_area_acres=latest_field.land_area_acres,
        water_availability=latest_field.water_availability,
        investment_level=latest_field.investment_level,
    )
    return plan

# Simple chatbot Q&A
@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    answer = match_answer(payload.question)
    return {"answer": answer}