from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chatbot, presentations, legal
import uvicorn

app = FastAPI(
    title="FoundX GenAI Service",
    description="AI-powered startup assistance platform with document generation",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot.router, prefix="/api/v1")
app.include_router(presentations.router, prefix="/api/v1/presentations")
app.include_router(legal.router, prefix="/api/v1/legal")

@app.get("/")
def root():
    return {
        "message": "FoundX GenAI Service v2.0 - Restructured with proper separation of concerns",
        "version": "2.0.0",        
        "services": {
            "chatbot": "/api/v1/ask, /api/v1/explain, /api/v1/generate-content",
            "presentations": "/api/v1/presentations/create-pitch-deck, /api/v1/presentations/create-business-plan",
            "legal": "/api/v1/legal/create-nda, /api/v1/legal/create-cda, /api/v1/legal/create-employment-agreement, /api/v1/legal/create-founder-agreement"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "2.0.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)