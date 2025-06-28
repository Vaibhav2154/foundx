from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from services.chatbot_rag import ChatbotRAGService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["GenAI Chatbot"])

rag_service = ChatbotRAGService()

class QuestionRequest(BaseModel):
    question: str
    context: Optional[str] = None
    startup_type: Optional[str] = None

class ExplainRequest(BaseModel):
    clause: str
    document_type: Optional[str] = "legal"
    detail_level: Optional[str] = "medium"

class ContentGenerationRequest(BaseModel):
    content_type: str
    user_info: Dict[str, Any]

class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = None
    confidence: Optional[float] = None

class ContentResponse(BaseModel):
    content_structure: Dict[str, Any]
    content_type: str
    user_info: Dict[str, Any]
    confidence: float

@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: QuestionRequest):
    """
    Q&A endpoint for startup-related questions using RAG
    """
    try:
        logger.info(f"Processing question: {request.question[:100]}...")
        
        # Prevent duplicate processing by checking if question is too short or empty
        if not request.question or len(request.question.strip()) < 3:
            raise HTTPException(status_code=400, detail="Question must be at least 3 characters long")
        
        result = await rag_service.ask_question(
            question=request.question,
            context=request.context,
            startup_type=request.startup_type
        )
        
        return ChatResponse(
            answer=result["answer"],
            sources=result.get("sources", []),
            confidence=result.get("confidence", 0.0)
        )
        
    except Exception as e:
        logger.error(f"Error processing question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@router.post("/explain", response_model=ChatResponse)
async def explain_clause(request: ExplainRequest):
    """
    Explain a legal or business clause in simple terms
    """
    try:
        logger.info(f"Explaining clause: {request.clause[:100]}...")
        
        # Prevent duplicate processing
        if not request.clause or len(request.clause.strip()) < 5:
            raise HTTPException(status_code=400, detail="Clause must be at least 5 characters long")
        
        result = await rag_service.explain_clause(
            clause=request.clause,
            document_type=request.document_type,
            detail_level=request.detail_level
        )
        
        return ChatResponse(
            answer=result["explanation"],
            sources=result.get("sources", []),
            confidence=result.get("confidence", 0.0)
        )
        
    except Exception as e:
        logger.error(f"Error explaining clause: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error explaining clause: {str(e)}")

@router.post("/generate-content", response_model=ContentResponse)
async def generate_content(request: ContentGenerationRequest):
    """
    Generate structured content for various document types (pitch deck, business plan, legal docs)
    """
    try:
        logger.info(f"Generating {request.content_type} content...")
        
        result = await rag_service.generate_content_structure(
            content_type=request.content_type,
            user_info=request.user_info
        )
        
        return ContentResponse(
            content_structure=result["content_structure"],
            content_type=result["content_type"],
            user_info=result["user_info"],
            confidence=result.get("confidence", 0.0)
        )
        
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")