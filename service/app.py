from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chatbot
import uvicorn

app = FastAPI(
    title="FoundX GenAI Service",
    description="AI-powered startup assistance platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chatbot.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "FoundX GenAI Service is running", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
