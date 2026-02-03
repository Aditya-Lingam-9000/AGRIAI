from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite is a simple file-based database.
# This file sets up:
# 1) A connection to the SQLite file
# 2) A Session factory (how we talk to the DB safely)
# 3) A Base class for defining tables using Python classes (ORM)

# The database file will be created automatically if it doesn't exist.
# IMPORTANT: We anchor it to the backend folder, not the terminal's current directory.
# This avoids confusing behavior where `app.db` appears in different places.
_BACKEND_DIR = Path(__file__).resolve().parent.parent
_DB_PATH = _BACKEND_DIR / "app.db"
SQLITE_DATABASE_URL = f"sqlite:///{_DB_PATH.as_posix()}"

# check_same_thread=False is required for SQLite when used with FastAPI
# because requests can be handled in different threads.
engine = create_engine(
    SQLITE_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# A Session is like a short-lived "conversation" with the database.
# We create a new session per request and close it afterwards.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class for all your ORM models (tables).
Base = declarative_base()


def get_db():
    """FastAPI dependency that provides a DB session per request.

    Usage (later in routes):
        db = Depends(get_db)

    FastAPI will:
    - call get_db()
    - yield the session to your route
    - then close the session automatically
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
