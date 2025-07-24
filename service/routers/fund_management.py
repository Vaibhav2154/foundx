from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from services.chatbot_rag import ChatbotRAGService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Fund Management AI"])

rag_service = ChatbotRAGService()

class FundManagementAnalysisRequest(BaseModel):
    query_type: str  # 'expense_analysis', 'budget_planning', 'funding_strategy', 'financial_insights'
    data: Dict[str, Any]  # Relevant financial data
    context: Optional[str] = None
    analysis_level: Optional[str] = "detailed"

class BudgetRecommendationRequest(BaseModel):
    startup_stage: str  # 'pre-seed', 'seed', 'series-a', etc.
    monthly_revenue: Optional[float] = None
    team_size: int
    industry: str
    funding_raised: Optional[float] = None
    burn_rate: Optional[float] = None

class FundraisingStrategyRequest(BaseModel):
    current_stage: str
    target_amount: float
    industry: str
    traction_metrics: Dict[str, Any]
    team_background: str
    market_size: Optional[str] = None

class FinancialHealthRequest(BaseModel):
    monthly_expenses: List[Dict[str, Any]]
    revenue_data: List[Dict[str, Any]]
    funding_sources: List[Dict[str, Any]]
    burn_rate: float
    runway_months: float

class AIResponse(BaseModel):
    analysis: str
    recommendations: List[str]
    insights: List[str]
    action_items: List[str]
    confidence: float
    sources: List[str]

@router.post("/analyze-finances", response_model=AIResponse)
async def analyze_finances(request: FundManagementAnalysisRequest):
    """
    AI-powered financial analysis for startups
    """
    try:
        if not rag_service.is_ai_configured():
            raise HTTPException(status_code=503, detail="AI service is not configured")

        # Build context-specific prompt
        prompt = _build_financial_analysis_prompt(request.query_type, request.data, request.context)
        
        # Generate AI response
        analysis = await rag_service._generate_response(prompt)
        
        # Extract recommendations and insights
        recommendations = _extract_recommendations(analysis)
        insights = _extract_insights(analysis)
        action_items = _extract_action_items(analysis)
        
        return AIResponse(
            analysis=analysis,
            recommendations=recommendations,
            insights=insights,
            action_items=action_items,
            confidence=0.85,
            sources=["startup_financial_knowledge", "industry_best_practices"]
        )
        
    except Exception as e:
        logger.error(f"Error in financial analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Financial analysis failed: {str(e)}")

@router.post("/budget-recommendations", response_model=AIResponse)
async def get_budget_recommendations(request: BudgetRecommendationRequest):
    """
    Generate AI-powered budget recommendations for startups
    """
    try:
        if not rag_service.is_ai_configured():
            raise HTTPException(status_code=503, detail="AI service is not configured")

        prompt = f"""
        As a startup financial advisor, provide detailed budget recommendations for a {request.startup_stage} startup with the following characteristics:
        
        - Industry: {request.industry}
        - Team Size: {request.team_size} people
        - Monthly Revenue: ${request.monthly_revenue or 'Not specified'}
        - Funding Raised: ${request.funding_raised or 'Not specified'}
        - Current Burn Rate: ${request.burn_rate or 'Not specified'}
        
        Please provide:
        1. Recommended monthly budget allocation by category (Development, Marketing, Operations, etc.)
        2. Key spending priorities for this stage
        3. Cost optimization opportunities
        4. Budget monitoring recommendations
        5. Red flags to watch for
        
        Structure your response with specific dollar amounts and percentages where possible.
        Focus on practical, actionable advice for this startup stage and industry.
        """
        
        analysis = await rag_service._generate_response(prompt)
        
        return AIResponse(
            analysis=analysis,
            recommendations=_extract_recommendations(analysis),
            insights=_extract_insights(analysis),
            action_items=_extract_action_items(analysis),
            confidence=0.88,
            sources=["startup_budgeting_best_practices", "industry_benchmarks"]
        )
        
    except Exception as e:
        logger.error(f"Error in budget recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Budget recommendation failed: {str(e)}")

@router.post("/fundraising-strategy", response_model=AIResponse)
async def get_fundraising_strategy(request: FundraisingStrategyRequest):
    """
    AI-powered fundraising strategy and recommendations
    """
    try:
        if not rag_service.is_ai_configured():
            raise HTTPException(status_code=503, detail="AI service is not configured")

        prompt = f"""
        As a startup fundraising expert, analyze this startup's fundraising needs and provide strategic recommendations:
        
        Current Details:
        - Stage: {request.current_stage}
        - Target Funding: ${request.target_amount:,.0f}
        - Industry: {request.industry}
        - Team Background: {request.team_background}
        - Market Size: {request.market_size or 'Not specified'}
        
        Traction Metrics:
        {request.traction_metrics}
        
        Please provide:
        1. Fundraising strategy and timeline recommendations
        2. Investor type recommendations (angels, VCs, etc.)
        3. Key metrics and milestones to highlight
        4. Potential valuation ranges and deal terms
        5. Common pitfalls to avoid
        6. Preparation checklist
        
        Be specific about the fundraising process, typical timeframes, and success factors.
        """
        
        analysis = await rag_service._generate_response(prompt)
        
        return AIResponse(
            analysis=analysis,
            recommendations=_extract_recommendations(analysis),
            insights=_extract_insights(analysis),
            action_items=_extract_action_items(analysis),
            confidence=0.87,
            sources=["fundraising_best_practices", "investor_relations_knowledge"]
        )
        
    except Exception as e:
        logger.error(f"Error in fundraising strategy: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Fundraising strategy failed: {str(e)}")

@router.post("/financial-health-check", response_model=AIResponse)
async def financial_health_check(request: FinancialHealthRequest):
    """
    Comprehensive financial health analysis for startups
    """
    try:
        if not rag_service.is_ai_configured():
            raise HTTPException(status_code=503, detail="AI service is not configured")

        # Calculate key metrics
        total_monthly_expenses = sum(exp.get('amount', 0) for exp in request.monthly_expenses)
        total_monthly_revenue = sum(rev.get('amount', 0) for rev in request.revenue_data)
        cash_flow = total_monthly_revenue - total_monthly_expenses
        
        prompt = f"""
        As a startup financial analyst, provide a comprehensive financial health assessment:
        
        Financial Metrics:
        - Monthly Expenses: ${total_monthly_expenses:,.0f}
        - Monthly Revenue: ${total_monthly_revenue:,.0f}
        - Net Cash Flow: ${cash_flow:,.0f}
        - Current Burn Rate: ${request.burn_rate:,.0f}
        - Runway: {request.runway_months:.1f} months
        
        Expense Breakdown:
        {request.monthly_expenses}
        
        Revenue Sources:
        {request.revenue_data}
        
        Funding Sources:
        {request.funding_sources}
        
        Please provide:
        1. Overall financial health assessment (scale 1-10 with explanation)
        2. Critical areas of concern
        3. Opportunities for improvement
        4. Runway extension strategies
        5. Key financial KPIs to track
        6. Immediate action recommendations
        
        Focus on actionable insights and specific recommendations for improving financial stability.
        """
        
        analysis = await rag_service._generate_response(prompt)
        
        return AIResponse(
            analysis=analysis,
            recommendations=_extract_recommendations(analysis),
            insights=_extract_insights(analysis),
            action_items=_extract_action_items(analysis),
            confidence=0.90,
            sources=["financial_health_indicators", "startup_financial_management"]
        )
        
    except Exception as e:
        logger.error(f"Error in financial health check: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Financial health check failed: {str(e)}")

@router.post("/expense-categorization", response_model=Dict[str, Any])
async def categorize_expenses(expenses: List[Dict[str, Any]]):
    """
    AI-powered expense categorization and optimization suggestions
    """
    try:
        if not rag_service.is_ai_configured():
            raise HTTPException(status_code=503, detail="AI service is not configured")

        # Analyze spending patterns
        category_totals = {}
        for expense in expenses:
            category = expense.get('category', 'Uncategorized')
            amount = expense.get('amount', 0)
            category_totals[category] = category_totals.get(category, 0) + amount
        
        total_expenses = sum(category_totals.values())
        
        prompt = f"""
        Analyze these startup expense categories and provide optimization recommendations:
        
        Expense Breakdown:
        {category_totals}
        
        Total Monthly Expenses: ${total_expenses:,.0f}
        
        Please provide:
        1. Category-wise spending analysis
        2. Potential cost reduction opportunities
        3. Spending pattern insights
        4. Benchmark comparisons for startup expenses
        5. Recommendations for expense optimization
        """
        
        analysis = await rag_service._generate_response(prompt)
        
        return {
            "analysis": analysis,
            "category_breakdown": category_totals,
            "optimization_score": _calculate_optimization_score(category_totals, total_expenses),
            "recommendations": _extract_recommendations(analysis)
        }
        
    except Exception as e:
        logger.error(f"Error in expense categorization: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Expense categorization failed: {str(e)}")

def _build_financial_analysis_prompt(query_type: str, data: Dict[str, Any], context: Optional[str]) -> str:
    """Build context-specific financial analysis prompt"""
    
    base_prompt = "You are an expert startup financial advisor with deep knowledge of startup economics, fundraising, and financial management."
    
    if query_type == "expense_analysis":
        return f"""
        {base_prompt}
        
        Analyze the following expense data and provide insights:
        {data}
        
        Context: {context or 'General expense analysis'}
        
        Please provide:
        1. Spending pattern analysis
        2. Cost optimization opportunities
        3. Budget allocation recommendations
        4. Expense forecasting insights
        """
    
    elif query_type == "budget_planning":
        return f"""
        {base_prompt}
        
        Help plan a budget based on this startup data:
        {data}
        
        Context: {context or 'Budget planning assistance'}
        
        Please provide:
        1. Recommended budget allocation by category
        2. Spending priorities by startup stage
        3. Budget monitoring strategies
        4. Financial milestone planning
        """
    
    elif query_type == "funding_strategy":
        return f"""
        {base_prompt}
        
        Develop a funding strategy for this startup:
        {data}
        
        Context: {context or 'Funding strategy development'}
        
        Please provide:
        1. Fundraising timeline and strategy
        2. Investor targeting recommendations
        3. Valuation considerations
        4. Funding milestone planning
        """
    
    else:  # financial_insights
        return f"""
        {base_prompt}
        
        Provide general financial insights for this startup data:
        {data}
        
        Context: {context or 'General financial insights'}
        
        Please provide comprehensive financial analysis and recommendations.
        """

def _extract_recommendations(text: str) -> List[str]:
    """Extract recommendation points from AI response"""
    recommendations = []
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if any(marker in line.lower() for marker in ['recommend', 'suggest', 'should', 'consider']):
            if len(line) > 10:  # Filter out short lines
                recommendations.append(line)
    
    return recommendations[:5]  # Return top 5 recommendations

def _extract_insights(text: str) -> List[str]:
    """Extract insight points from AI response"""
    insights = []
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if any(marker in line.lower() for marker in ['insight', 'key finding', 'important', 'note that']):
            if len(line) > 10:
                insights.append(line)
    
    return insights[:5]  # Return top 5 insights

def _extract_action_items(text: str) -> List[str]:
    """Extract actionable items from AI response"""
    actions = []
    lines = text.split('\n')
    
    for line in lines:
        line = line.strip()
        if any(marker in line.lower() for marker in ['action', 'implement', 'start', 'begin', 'next step']):
            if len(line) > 10:
                actions.append(line)
    
    return actions[:5]  # Return top 5 action items

def _calculate_optimization_score(category_totals: Dict[str, float], total_expenses: float) -> Dict[str, Any]:
    """Calculate expense optimization score"""
    
    # Define optimal expense ratios for startups
    optimal_ratios = {
        'Development': 0.40,  # 40% on product development
        'Marketing': 0.25,    # 25% on marketing/sales
        'Operations': 0.20,   # 20% on operations
        'Legal': 0.05,        # 5% on legal
        'Equipment': 0.05,    # 5% on equipment
        'Office': 0.05        # 5% on office/other
    }
    
    score = 100
    deviations = {}
    
    for category, optimal_ratio in optimal_ratios.items():
        actual_amount = category_totals.get(category, 0)
        actual_ratio = actual_amount / total_expenses if total_expenses > 0 else 0
        deviation = abs(actual_ratio - optimal_ratio)
        deviations[category] = {
            'actual_ratio': actual_ratio,
            'optimal_ratio': optimal_ratio,
            'deviation': deviation
        }
        score -= deviation * 100  # Reduce score based on deviation
    
    return {
        'score': max(0, min(100, score)),  # Keep score between 0-100
        'deviations': deviations,
        'total_expenses': total_expenses
    }
