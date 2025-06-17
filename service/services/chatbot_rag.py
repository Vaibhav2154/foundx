import google.generativeai as genai
from typing import Dict, List, Optional, Any
import os
import logging
from pathlib import Path
import asyncio
from utils.file_utils import PDFProcessor, DocumentProcessor
from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatbotRAGService:
    """
    RAG (Retrieval-Augmented Generation) service for FoundX startup assistance.
    
    This service combines document retrieval with Gemini AI to provide
    intelligent responses to startup-related queries.
    """
    
    def __init__(self):
        self.setup_gemini()
        self.knowledge_base_path = Path("knowledge_base")
        self.knowledge_base_path.mkdir(exist_ok=True)
        self.document_processor = DocumentProcessor()
        self.pdf_processor = PDFProcessor()
        self.knowledge_base = {}
        self._load_knowledge_base()
    
    def setup_gemini(self):
        """Configure Gemini AI with API key"""
        api_key = settings.gemini_api_key or os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.warning("GEMINI_API_KEY not found in environment variables or settings")
            self.model = None
            return
        
        try:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            logger.info("Gemini AI configured successfully")
        except Exception as e:
            logger.error(f"Error configuring Gemini AI: {str(e)}")
            self.model = None
    
    def _load_knowledge_base(self):
        """Load and process documents for the knowledge base"""
        try:
            # Load the PRD document
            prd_path = Path("FoundX-2.pdf")
            if prd_path.exists():
                logger.info("Loading FoundX PRD document...")
                prd_content = self.pdf_processor.extract_text(str(prd_path))
                self.knowledge_base["foundx_prd"] = prd_content
            
            # Load additional startup knowledge
            self._load_startup_templates()
            logger.info(f"Knowledge base loaded with {len(self.knowledge_base)} documents")
            
        except Exception as e:
            logger.error(f"Error loading knowledge base: {str(e)}")
    
    def _load_startup_templates(self):
        """Load predefined startup knowledge and templates"""
        self.knowledge_base.update({
            "startup_basics": """
            Startup fundamentals include: business model validation, market research,
            MVP development, funding strategies, legal structure, team building,
            and growth planning. Key stages: ideation, validation, MVP, growth, scaling.
            """,
            "legal_clauses": """
            Common startup legal clauses: equity distribution, vesting schedules,
            non-disclosure agreements, employment terms, intellectual property rights,
            investment terms, board composition, liquidation preferences.
            """,
            "funding_types": """
            Startup funding stages: Pre-seed, Seed, Series A/B/C, Bridge rounds.
            Funding sources: bootstrapping, friends & family, angel investors,
            venture capital, crowdfunding, government grants.
            """
        })
    
    async def ask_question(self, question: str, context: Optional[str] = None, 
                          startup_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a startup-related question using RAG approach
        """
        try:
            # Retrieve relevant context from knowledge base
            relevant_context = self._retrieve_relevant_context(question, startup_type)
            
            # Construct the prompt
            prompt = self._build_qa_prompt(question, relevant_context, context, startup_type)
            
            # Generate response using Gemini
            response = await self._generate_response(prompt)
            
            return {
                "answer": response,
                "sources": self._get_sources_used(relevant_context),
                "confidence": self._calculate_confidence(question, response)
            }
            
        except Exception as e:
            logger.error(f"Error in ask_question: {str(e)}")
            raise
    
    async def explain_clause(self, clause: str, document_type: str = "legal", 
                           detail_level: str = "medium") -> Dict[str, Any]:
        """
        Explain a legal or business clause in simple terms
        """
        try:
            # Get relevant legal context
            legal_context = self.knowledge_base.get("legal_clauses", "")
            
            # Build explanation prompt
            prompt = self._build_explanation_prompt(clause, document_type, detail_level, legal_context)
            
            # Generate explanation
            explanation = await self._generate_response(prompt)
            
            return {
                "explanation": explanation,
                "sources": ["legal_knowledge_base"],
                "confidence": 0.85
            }
            
        except Exception as e:
            logger.error(f"Error in explain_clause: {str(e)}")
            raise
    
    async def generate_document(self, doc_type: str, template: Optional[str] = None,
                              parameters: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Generate startup documents using AI
        """
        try:
            if parameters is None:
                parameters = {}
            
            # Get relevant templates and examples
            template_context = self._get_document_template(doc_type)
            
            # Build generation prompt
            prompt = self._build_generation_prompt(doc_type, template_context, parameters)
            
            # Generate document
            document = await self._generate_response(prompt)
            
            return {
                "document": document,
                "templates_used": [f"{doc_type}_template"],
                "confidence": 0.80
            }
            
        except Exception as e:
            logger.error(f"Error in generate_document: {str(e)}")
            raise
    
    def _retrieve_relevant_context(self, question: str, startup_type: Optional[str] = None) -> str:
        """
        Retrieve relevant context from knowledge base based on question
        """
        relevant_docs = []
        question_lower = question.lower()
        
        # Simple keyword-based retrieval (can be enhanced with vector search)
        for doc_name, content in self.knowledge_base.items():
            if any(keyword in question_lower for keyword in 
                   ["legal", "clause", "contract", "agreement"]) and "legal" in doc_name:
                relevant_docs.append(content)
            elif any(keyword in question_lower for keyword in 
                     ["funding", "investment", "money", "capital"]) and "funding" in doc_name:
                relevant_docs.append(content)
            elif "foundx" in question_lower and "foundx_prd" in doc_name:
                relevant_docs.append(content)
            elif "startup" in question_lower or "business" in question_lower:
                relevant_docs.append(content)
        
        return "\n\n".join(relevant_docs[:3])  # Limit context length
    
    def _build_qa_prompt(self, question: str, context: str, user_context: Optional[str], 
                        startup_type: Optional[str]) -> str:
        """
        Build a comprehensive Q&A prompt for Gemini
        """
        prompt = f"""
You are an expert startup advisor and mentor with extensive knowledge of entrepreneurship, 
business development, legal matters, and funding strategies.

Context from Knowledge Base:
{context}

User Question: {question}
"""
        
        if user_context:
            prompt += f"\nAdditional Context: {user_context}"
        
        if startup_type:
            prompt += f"\nStartup Type: {startup_type}"
        
        prompt += """

Please provide a comprehensive, actionable answer that:
1. Directly addresses the question
2. Provides practical advice and next steps
3. Includes relevant examples where helpful
4. Considers the startup context and stage
5. Is written in a clear, accessible manner

Answer:"""
        
        return prompt
    
    def _build_explanation_prompt(self, clause: str, document_type: str, 
                                detail_level: str, legal_context: str) -> str:
        """
        Build a prompt for explaining legal/business clauses
        """
        detail_instructions = {
            "basic": "Provide a simple, one-paragraph explanation",
            "medium": "Provide a detailed explanation with key points and implications",
            "detailed": "Provide a comprehensive explanation with examples, implications, and best practices"
        }
        
        return f"""
You are a legal expert specializing in startup and business law.

Legal Context:
{legal_context}

Clause to Explain: "{clause}"
Document Type: {document_type}
Detail Level: {detail_level}

{detail_instructions.get(detail_level, detail_instructions["medium"])}

Please explain this clause in plain English, covering:
1. What it means in simple terms
2. Why it's important
3. Potential implications for startups
4. Common variations or alternatives
5. Red flags to watch out for

Explanation:"""
    
    def _build_generation_prompt(self, doc_type: str, template_context: str, 
                               parameters: Dict[str, Any]) -> str:
        """
        Build a prompt for generating startup documents
        """
        return f"""
You are an expert business consultant specializing in startup documentation.

Document Type to Generate: {doc_type}
Template Context: {template_context}
Parameters: {parameters}

Generate a professional {doc_type} that includes:
- Clear structure and formatting
- Industry best practices
- Relevant sections and content
- Professional tone and language
- Actionable content where appropriate

Please create the document now:"""
    
    def _get_document_template(self, doc_type: str) -> str:
        """
        Get template information for document generation
        """
        templates = {
            "business_plan": """
            Business Plan Template Structure:
            1. Executive Summary
            2. Company Description
            3. Market Analysis
            4. Organization & Management
            5. Products/Services
            6. Marketing & Sales Strategy
            7. Financial Projections
            8. Funding Requirements
            """,
            "pitch_deck": """
            Pitch Deck Template Structure:
            1. Problem
            2. Solution
            3. Market Opportunity
            4. Business Model
            5. Traction
            6. Competition
            7. Team
            8. Financial Projections
            9. Funding Ask
            10. Use of Funds
            """,
            "legal_doc": """
            Legal Document Templates:
            - Non-Disclosure Agreement (NDA)
            - Employment Agreement
            - Founder Agreement
            - Terms of Service
            - Privacy Policy
            """
        }
        
        return templates.get(doc_type, "Generic business document template")
    
    async def _generate_response(self, prompt: str) -> str:
        """
        Generate response using Gemini AI
        """
        if self.model is None:
            logger.error("Gemini model not available. Please check GEMINI_API_KEY environment variable.")
            return "I apologize, but the AI service is not properly configured. Please contact the administrator to set up the GEMINI_API_KEY environment variable."
        
        try:
            # Use asyncio to run the sync method in async context
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, self.model.generate_content, prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return f"I apologize, but I encountered an error while processing your request. Please try again or rephrase your question."
    
    def _get_sources_used(self, context: str) -> List[str]:
        """
        Extract source names from the context used
        """
        sources = []
        for doc_name in self.knowledge_base.keys():
            if any(phrase in context for phrase in self.knowledge_base[doc_name].split()[:10]):
                sources.append(doc_name)
        return sources
    
    def _calculate_confidence(self, question: str, response: str) -> float:
        """
        Calculate confidence score for the response
        """
        # Simple confidence calculation based on response length and question relevance
        if len(response) > 100 and "I don't know" not in response:
            return 0.85
        elif len(response) > 50:
            return 0.70
        else:
            return 0.50
    
    async def get_knowledge_base_status(self) -> Dict[str, Any]:
        """
        Get status of the knowledge base
        """
        return {
            "status": "active",
            "documents_loaded": len(self.knowledge_base),
            "document_names": list(self.knowledge_base.keys()),
            "last_updated": "2025-06-17"
        }
    
    async def refresh_knowledge_base(self) -> Dict[str, str]:
        """
        Refresh the knowledge base
        """
        try:
            self._load_knowledge_base()
            return {"status": "success", "message": "Knowledge base refreshed successfully"}
        except Exception as e:
            return {"status": "error", "message": f"Error refreshing knowledge base: {str(e)}"}
    
    def is_ai_configured(self) -> bool:
        """
        Check if the AI service is properly configured
        """
        return self.model is not None
    
    async def get_service_status(self) -> Dict[str, Any]:
        """
        Get comprehensive status of the RAG service
        """
        return {
            "ai_configured": self.is_ai_configured(),
            "knowledge_base_status": await self.get_knowledge_base_status(),
            "gemini_model": "gemini-2.0-flash" if self.is_ai_configured() else "not_configured"
        }
