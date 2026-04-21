from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class GeneratedArchitecture(Base):
    __tablename__ = "generated_architectures"
    
    id = Column(Integer, primary_key=True, index=True)
    idea = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    def __repr__(self):
        return f"<GeneratedArchitecture(id={self.id}, created_at={self.created_at})>"
