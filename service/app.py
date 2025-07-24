from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chatbot, legal, market_research, bill_parser, fund_management
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
app.include_router(legal.router, prefix="/api/v1/legal")
app.include_router(market_research.router, prefix="/api/v1")
app.include_router(bill_parser.router)
app.include_router(fund_management.router, prefix="/api/v1/fund-management")

@app.get("/")
def root():
    return {
        "message": "FoundX GenAI Service v2.0 - Restructured with proper separation of concerns",
        "version": "2.0.0",        
        "services": {
            "chatbot": "/api/v1/ask, /api/v1/explain, /api/v1/generate-content",
            "legal": "/api/v1/legal/create-nda, /api/v1/legal/create-cda, /api/v1/legal/create-employment-agreement, /api/v1/legal/create-founder-agreement",
            "market_research": "/api/v1/market-research/comprehensive, /api/v1/market-research/competitor-analysis, /api/v1/market-research/trend-analysis",
            "bill_parser": "/api/v1/bill-parser/parse-from-images, /api/v1/bill-parser/parse-from-files, /api/v1/bill-parser/validate-bill"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "2.0.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)