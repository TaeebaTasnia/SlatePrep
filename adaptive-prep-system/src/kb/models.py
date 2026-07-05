from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid

Base = declarative_base()


def _uuid():
    return str(uuid.uuid4())


class Session(Base):
    __tablename__ = "sessions"

    session_id = Column(String, primary_key=True, default=_uuid)
    created_at = Column(DateTime, default=datetime.utcnow)
    section_ids = Column(Text, nullable=False)  # JSON array "[5, 8]"
    total_q = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)

    questions = relationship("Question", back_populates="session", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    question_id = Column(String, primary_key=True, default=_uuid)
    session_id = Column(String, ForeignKey("sessions.session_id"), nullable=False)
    section_id = Column(Integer, nullable=False)
    question_text = Column(Text, nullable=False)
    choices = Column(Text, nullable=False)       # JSON {"A": "...", "B": "...", ...}
    correct_answer = Column(String(1), nullable=False)
    explanation = Column(Text, nullable=False)
    topic_tags = Column(Text, nullable=False, default="[]")  # JSON array

    session = relationship("Session", back_populates="questions")
    answer = relationship("Answer", back_populates="question", uselist=False, cascade="all, delete-orphan")


class Answer(Base):
    __tablename__ = "answers"

    answer_id = Column(String, primary_key=True, default=_uuid)
    question_id = Column(String, ForeignKey("questions.question_id"), nullable=False)
    user_answer = Column(String(1), nullable=True)
    is_correct = Column(Boolean, nullable=False)
    answered_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("Question", back_populates="answer")
