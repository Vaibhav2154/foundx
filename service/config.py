import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    
    # API Configuration
    gemini_api_key: str = ""
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # CORS Configuration
    allowed_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # File Upload Configuration
    max_file_size_mb: float = 50.0
    allowed_file_types: List[str] = [".pdf", ".docx", ".txt"]
    
    # Knowledge Base Configuration
    knowledge_base_path: str = "./knowledge_base"
    auto_refresh_kb: bool = True
    
    # Logging Configuration
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create global settings instance
settings = Settings()
