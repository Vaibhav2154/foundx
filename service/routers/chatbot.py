from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from services.chatbot_rag import ChatbotRAGService
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["GenAI Chatbot"])

# Initialize the RAG service
rag_service = ChatbotRAGService()

class QuestionRequest(BaseModel):
    question: str
    context: Optional[str] = None
    startup_type: Optional[str] = None

class ExplainRequest(BaseModel):
    clause: str
    document_type: Optional[str] = "legal"
    detail_level: Optional[str] = "medium"  # basic, medium, detailed

class GenerateDocRequest(BaseModel):
    doc_type: str  # "business_plan", "pitch_deck", "legal_doc"
    template: Optional[str] = None
    parameters: Optional[dict] = None

class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = None
    confidence: Optional[float] = None

@router.post("/ask", response_model=ChatResponse)
async def ask_question(request: QuestionRequest):
    """
    Q&A endpoint for startup-related questions.
    
    This endpoint uses RAG to provide intelligent answers to startup questions
    by combining the user's query with relevant context from the knowledge base.
    """
    try:
        logger.info(f"Processing question: {request.question[:100]}...")
        
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
    Clause explanation endpoint for legal and business documents.
    
    This endpoint provides detailed explanations of clauses in legal documents,
    contracts, or business terms in simple, understandable language.
    """
    try:
        logger.info(f"Explaining clause: {request.clause[:100]}...")
        
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

@router.post("/generate-doc", response_model=ChatResponse)
async def generate_document(request: GenerateDocRequest):
    """
    Optional text generation endpoint for creating startup documents.
    
    This endpoint can generate various types of startup documents such as
    business plans, pitch decks, or legal documents based on provided parameters.
    """
    try:
        logger.info(f"Generating document of type: {request.doc_type}")
        
        result = await rag_service.generate_document(
            doc_type=request.doc_type,
            template=request.template,
            parameters=request.parameters or {}
        )
        
        return ChatResponse(
            answer=result["document"],
            sources=result.get("templates_used", []),
            confidence=result.get("confidence", 0.0)
        )
        
    except Exception as e:
        logger.error(f"Error generating document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating document: {str(e)}")

@router.get("/knowledge-base/status")
async def get_knowledge_base_status():
    """
    Get the status of the knowledge base and available documents.
    """
    try:
        status = await rag_service.get_knowledge_base_status()
        return status
    except Exception as e:
        logger.error(f"Error getting knowledge base status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting knowledge base status: {str(e)}")

@router.post("/knowledge-base/refresh")
async def refresh_knowledge_base():
    """
    Refresh the knowledge base with latest documents.
    """
    try:
        result = await rag_service.refresh_knowledge_base()
        return result
    except Exception as e:
        logger.error(f"Error refreshing knowledge base: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error refreshing knowledge base: {str(e)}")
