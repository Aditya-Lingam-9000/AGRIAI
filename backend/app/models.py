from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


# This file defines your database tables using SQLAlchemy ORM.
# Think of each class below as a "table" in SQLite.
# Each class attribute (Column) becomes a "column" in that table.


class FarmerProfile(Base):
    """Stores basic farmer profile details.

    We store `firebase_uid` so the backend can link data to the authenticated user.
    """

    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)

    # Firebase user id (stable unique id for the logged-in user)
    firebase_uid = Column(String, unique=True, index=True, nullable=False)

    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    preferred_language = Column(String, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # One farmer can have many fields.
    fields = relationship("Field", back_populates="farmer", cascade="all, delete-orphan")


class Field(Base):
    """Stores a single field / planning input for a farmer."""

    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)

    farmer_id = Column(Integer, ForeignKey("farmer_profiles.id"), nullable=False, index=True)

    land_area_acres = Column(Float, nullable=False)

    # For MVP we keep these as strings.
    # Later you can restrict them to allowed values using validation in your API layer.
    crop_selection = Column(String, nullable=False)
    water_availability = Column(String, nullable=False)  # low / medium / high
    investment_level = Column(String, nullable=False)  # low / medium / high

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    farmer = relationship("FarmerProfile", back_populates="fields")
