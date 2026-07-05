import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

_DB_PATH = os.environ.get("KB_DB_PATH", "kb.db")
_engine = None
_SessionLocal = None


def get_engine():
    global _engine
    if _engine is None:
        _engine = create_engine(f"sqlite:///{_DB_PATH}", connect_args={"check_same_thread": False})
        Base.metadata.create_all(_engine)
    return _engine


def get_session():
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(bind=get_engine(), autocommit=False, autoflush=False)
    return _SessionLocal()
