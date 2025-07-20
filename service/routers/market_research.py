"""
Market Research Router for FastAPI
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from services.market_research_service import MarketResearchService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/market-research", tags=["Market Research"])

market_research_service = MarketResearchService()

class MarketResearchRequest(BaseModel):
    market_query: str = Field(..., description="Market or industry to research")
    location: str = Field(default="us", description="Geographic location for research")
    include_news: bool = Field(default=True, description="Include news data in research")
    include_images: bool = Field(default=False, description="Include image data in research")

class CompetitorAnalysisRequest(BaseModel):
    company_name: str = Field(..., description="Company name for competitor analysis")
    industry: str = Field(..., description="Industry sector")
    location: str = Field(default="us", description="Geographic location")

class TrendAnalysisRequest(BaseModel):
    industry: str = Field(..., description="Industry for trend analysis")
    time_period: str = Field(default="recent", description="Time period for analysis")
    location: str = Field(default="us", description="Geographic location")

class MarketResearchResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    query: str
    location: str

@router.post("/comprehensive", response_model=MarketResearchResponse)
async def comprehensive_market_research(request: MarketResearchRequest):
    """
    Perform comprehensive market research including web search, news analysis, and AI insights
    """
    try:
        logger.info(f"Starting comprehensive market research for: {request.market_query}")
        
        result = await market_research_service.comprehensive_market_research(
            market_query=request.market_query,
            location=request.location,
            include_news=request.include_news,
            include_images=request.include_images
        )
        
        return MarketResearchResponse(
            success=True,
            data=result,
            query=request.market_query,
            location=request.location
        )
        
    except Exception as e:
        logger.error(f"Comprehensive market research failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Market research failed: {str(e)}"
        )

@router.post("/competitor-analysis", response_model=MarketResearchResponse)
async def competitor_analysis(request: CompetitorAnalysisRequest):
    """
    Perform detailed competitor analysis for a company in specific industry
    """
    try:
        logger.info(f"Starting competitor analysis for: {request.company_name} in {request.industry}")
        
        result = await market_research_service.competitor_analysis(
            company_name=request.company_name,
            industry=request.industry,
            location=request.location
        )
        
        return MarketResearchResponse(
            success=True,
            data=result,
            query=f"{request.company_name} competitors in {request.industry}",
            location=request.location
        )
        
    except Exception as e:
        logger.error(f"Competitor analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Competitor analysis failed: {str(e)}"
        )

@router.post("/trend-analysis", response_model=MarketResearchResponse)
async def trend_analysis(request: TrendAnalysisRequest):
    """
    Analyze industry trends and future predictions
    """
    try:
        logger.info(f"Starting trend analysis for: {request.industry}")
        
        result = await market_research_service.trend_analysis(
            industry=request.industry,
            time_period=request.time_period,
            location=request.location
        )
        
        return MarketResearchResponse(
            success=True,
            data=result,
            query=f"{request.industry} trends",
            location=request.location
        )
        
    except Exception as e:
        logger.error(f"Trend analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Trend analysis failed: {str(e)}"
        )

@router.get("/quick-search")
async def quick_market_search(
    query: str = Query(..., description="Search query for market data"),
    location: str = Query(default="us", description="Geographic location"),
    search_type: str = Query(default="search", description="Type of search: search, news, or images")
):
    """
    Quick market data search without full analysis
    """
    try:
        logger.info(f"Quick search for: {query}")
        
        if search_type == "search":
            result = await market_research_service.search_market_data(query, location)
        elif search_type == "news":
            result = await market_research_service.search_news_data(query, location)
        elif search_type == "images":
            result = await market_research_service.search_images(query)
        else:
            raise HTTPException(status_code=400, detail="Invalid search_type. Use: search, news, or images")
        
        return {
            "success": True,
            "data": result,
            "query": query,
            "search_type": search_type,
            "location": location
        }
        
    except Exception as e:
        logger.error(f"Quick search failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Quick search failed: {str(e)}"
        )

@router.get("/health")
async def market_research_health():
    """
    Health check for market research service
    """
    try:
        test_query = "test market"
        await market_research_service.search_market_data(test_query, "us")
        
        return {
            "status": "healthy",
            "service": "market_research",
            "serper_api": "connected" if market_research_service.serper_api_key else "not_configured",
            "gemini_api": "connected" if market_research_service.gemini_api_key else "not_configured"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "market_research",
            "error": str(e),
            "serper_api": "connected" if market_research_service.serper_api_key else "not_configured",
            "gemini_api": "connected" if market_research_service.gemini_api_key else "not_configured"
        }
