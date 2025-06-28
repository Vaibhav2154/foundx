import google.generativeai as genai
from typing import Dict, List, Optional, Any
import os
import logging
from pathlib import Path
import asyncio
import json
from utils.file_utils import PDFProcessor, DocumentProcessor
from config import settings

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatbotRAGService:
    """
    Core RAG service for startup assistance - focuses only on Q&A and content generation
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
    
    async def _generate_response(self, prompt: str) -> str:
        """Generate a response using Gemini AI"""
        if not self.model:
            logger.warning("Gemini model not configured, returning fallback response")
            return "I'm sorry, the AI service is currently unavailable. Please try again later."
        
        try:
            response = await asyncio.to_thread(self.model.generate_content, prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error generating response with Gemini: {str(e)}")
            return f"I encountered an error while processing your request: {str(e)}"
    
    
    def _load_knowledge_base(self):
        """Load knowledge base from files and initialize with startup templates"""
        try:
            # Load startup templates first
            self._load_startup_templates()
            
            # Load any existing documents from knowledge_base directory
            if self.knowledge_base_path.exists():
                for file_path in self.knowledge_base_path.glob("*.txt"):
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            self.knowledge_base[file_path.stem] = content
                            logger.info(f"Loaded knowledge base file: {file_path.name}")
                    except Exception as e:
                        logger.error(f"Error loading {file_path}: {str(e)}")
                
                # Load PDF files if any
                for file_path in self.knowledge_base_path.glob("*.pdf"):
                    try:
                        content = self.pdf_processor.extract_text(str(file_path))
                        if content:
                            self.knowledge_base[file_path.stem] = content
                            logger.info(f"Loaded PDF knowledge base file: {file_path.name}")
                    except Exception as e:
                        logger.error(f"Error loading PDF {file_path}: {str(e)}")
            
            logger.info(f"Knowledge base loaded with {len(self.knowledge_base)} documents")
            
        except Exception as e:
            logger.error(f"Error loading knowledge base: {str(e)}")
            # Ensure we have at least the basic templates
            self._load_startup_templates()

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
        """Process a startup-related question using RAG approach"""
        try:
            relevant_context = self._retrieve_relevant_context(question, startup_type)
            prompt = self._build_qa_prompt(question, relevant_context, context, startup_type)
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
        """Explain a legal or business clause in simple terms"""
        try:
            legal_context = self.knowledge_base.get("legal_clauses", "")
            prompt = self._build_explanation_prompt(clause, document_type, detail_level, legal_context)
            explanation = await self._generate_response(prompt)
            
            return {
                "explanation": explanation,
                "sources": ["legal_knowledge_base"],
                "confidence": 0.85
            }
            
        except Exception as e:
            logger.error(f"Error in explain_clause: {str(e)}")
            raise
    
    async def generate_content_structure(self, content_type: str, user_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate structured content based on user input - separate from document creation
        """
        try:
            if content_type == "pitch_deck":
                prompt = self._build_pitch_deck_content_prompt(user_info)
            elif content_type == "business_plan":
                prompt = self._build_business_plan_content_prompt(user_info)
            elif content_type.startswith("legal_"):
                prompt = self._build_legal_content_prompt(content_type, user_info)
            else:
                raise ValueError(f"Unknown content type: {content_type}")
            
            response = await self._generate_response(prompt)
            content_structure = self._parse_ai_response_to_structure(response, content_type)
            
            return {
                "content_structure": content_structure,
                "content_type": content_type,
                "user_info": user_info,
                "confidence": 0.85
            }
            
        except Exception as e:
            logger.error(f"Error generating content structure: {str(e)}")
            raise
    
    def _build_pitch_deck_content_prompt(self, user_info: Dict[str, Any]) -> str:
        """Build prompt for generating pitch deck content structure"""
        return f"""
        Based on the following startup information, create a comprehensive pitch deck content structure:
        
        Company Name: {user_info.get('company_name', 'Not provided')}
        Industry: {user_info.get('industry', 'Not provided')}
        Target Market: {user_info.get('target_market', 'Not provided')}
        Problem Statement: {user_info.get('problem', 'Not provided')}
        Solution Description: {user_info.get('solution', 'Not provided')}
        Business Model: {user_info.get('business_model', 'Not provided')}
        Revenue Model: {user_info.get('revenue_model', 'Not provided')}
        Team Information: {user_info.get('team_info', 'Not provided')}
        Funding Required: {user_info.get('funding_amount', 'Not provided')}
        Use of Funds: {user_info.get('use_of_funds', 'Not provided')}
        Competitive Advantage: {user_info.get('competitive_advantage', 'Not provided')}
        Market Size: {user_info.get('market_size', 'Not provided')}
        
        Generate a detailed JSON structure with slide-by-slide content for a professional investor pitch deck.
        Include specific, actionable content for each slide based on the provided information.
        
        Required JSON structure:
        {{
            "slide_1_title": {{
                "title": "Company name and compelling tagline",
                "subtitle": "Brief value proposition"
            }},
            "slide_2_problem": {{
                "title": "The Problem",
                "problem_statement": "Clear problem description",
                "pain_points": ["Specific pain point 1", "Pain point 2", "Pain point 3"],
                "market_impact": "Quantified impact of the problem"
            }},
            "slide_3_solution": {{
                "title": "Our Solution",
                "solution_overview": "How you solve the problem",
                "key_features": ["Feature 1", "Feature 2", "Feature 3"],
                "unique_value": "What makes your solution unique"
            }},
            "slide_4_market": {{
                "title": "Market Opportunity",
                "market_size": "TAM, SAM, SOM breakdown",
                "market_trends": ["Trend 1", "Trend 2"],
                "target_segments": ["Segment 1", "Segment 2"]
            }},
            "slide_5_business_model": {{
                "title": "Business Model",
                "revenue_streams": ["Stream 1", "Stream 2"],
                "pricing_strategy": "How you price your product/service",
                "unit_economics": "Key metrics and profitability"
            }},
            "slide_6_competition": {{
                "title": "Competitive Landscape",
                "competitors": ["Competitor 1", "Competitor 2"],
                "competitive_advantage": "Your differentiation",
                "market_positioning": "Where you fit in the market"
            }},
            "slide_7_traction": {{
                "title": "Traction & Milestones",
                "key_metrics": ["Metric 1", "Metric 2"],
                "achievements": ["Achievement 1", "Achievement 2"],
                "customer_testimonials": "Social proof"
            }},
            "slide_8_team": {{
                "title": "Team",
                "team_overview": "Why this team can execute",
                "key_members": [
                    {{"name": "Name", "role": "Role", "experience": "Key experience"}},
                    {{"name": "Name", "role": "Role", "experience": "Key experience"}}
                ],
                "advisors": ["Advisor 1", "Advisor 2"]
            }},
            "slide_9_financials": {{
                "title": "Financial Projections",
                "revenue_forecast": "3-5 year revenue projection",
                "key_assumptions": ["Assumption 1", "Assumption 2"],
                "path_to_profitability": "When and how you become profitable"
            }},
            "slide_10_funding": {{
                "title": "Funding Ask",
                "funding_amount": "Amount seeking",
                "use_of_funds": [
                    {{"category": "Development", "percentage": "40%", "description": "Details"}},
                    {{"category": "Marketing", "percentage": "35%", "description": "Details"}},
                    {{"category": "Operations", "percentage": "25%", "description": "Details"}}
                ],
                "timeline": "Key milestones with this funding"
            }},
            "slide_11_next_steps": {{
                "title": "Next Steps",
                "immediate_goals": ["Goal 1", "Goal 2"],
                "long_term_vision": "Where you see the company in 5 years",
                "call_to_action": "What you want from investors"
            }}
        }}
        
        Make all content specific to the provided information and ensure it's compelling for investors.
        """
    
    def _build_business_plan_content_prompt(self, user_info: Dict[str, Any]) -> str:
        """Build prompt for business plan content"""
        return f"""
        Create a comprehensive business plan structure based on this information:
        {json.dumps(user_info, indent=2)}
        
        Generate detailed JSON content for a professional business plan presentation covering:
        - Executive Summary
        - Company Description  
        - Market Analysis
        - Organization & Management
        - Products/Services
        - Marketing & Sales Strategy
        - Financial Projections
        - Funding Requirements
        
        Make the content detailed and specific to the provided business information.
        """
    
    def _build_legal_content_prompt(self, legal_type: str, user_info: Dict[str, Any]) -> str:
        """Build prompt for legal document content"""
        legal_templates = {
            "legal_nda": "Non-Disclosure Agreement",
            "legal_employment": "Employment Agreement", 
            "legal_founder": "Founder Agreement",
            "legal_investor": "Investor Agreement"
        }
        
        doc_type = legal_templates.get(legal_type, "Legal Document")
        
        return f"""
        Generate a structured {doc_type} based on the following information:
        {json.dumps(user_info, indent=2)}
        
        Create a comprehensive JSON structure with all necessary clauses and sections
        for a professional {doc_type}. Include standard legal language appropriate
        for startups while making it understandable.
        
        Structure should include all typical sections for this type of legal document.
        """
    
    def _parse_ai_response_to_structure(self, response: str, content_type: str) -> Dict[str, Any]:
        """Parse AI response into structured content"""
        try:
            import re
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                return self._get_fallback_structure(content_type)
        except Exception as e:
            logger.error(f"Error parsing AI response: {str(e)}")
            return self._get_fallback_structure(content_type)
    
    def _get_fallback_structure(self, content_type: str) -> Dict[str, Any]:
        """Fallback content structure when AI fails"""
        if content_type == "pitch_deck":
            return {
                "slide_1_title": {
                    "title": "Your Startup Name",
                    "subtitle": "Solving problems, creating value"
                },
                "slide_2_problem": {
                    "title": "The Problem",
                    "problem_statement": "Describe the problem you're solving",
                    "pain_points": ["Pain point 1", "Pain point 2", "Pain point 3"],
                    "market_impact": "Quantify the problem's impact"
                }
                # Add more fallback slides...
            }
        return {"error": "Fallback content not available"}
    
    # Helper methods remain the same...
    def _retrieve_relevant_context(self, question: str, startup_type: Optional[str] = None) -> str:
        """Retrieve relevant context from knowledge base"""
        relevant_docs = []
        question_lower = question.lower()
        
        for doc_name, content in self.knowledge_base.items():
            if any(keyword in content.lower() for keyword in question_lower.split()):
                relevant_docs.append(f"From {doc_name}: {content[:500]}...")
        
        return "\n\n".join(relevant_docs) if relevant_docs else "No specific context found."
    
    def _build_qa_prompt(self, question: str, context: str, additional_context: Optional[str] = None, 
                        startup_type: Optional[str] = None) -> str:
        """Build a prompt for Q&A"""
        prompt = f"""You are a startup advisor with expertise in entrepreneurship, business development, and startup ecosystem.

Context from knowledge base:
{context}

{f"Additional context: {additional_context}" if additional_context else ""}
{f"Startup type: {startup_type}" if startup_type else ""}

Question: {question}

Please provide a comprehensive, actionable response based on the context and your expertise."""
        
        return prompt
    
    def _build_explanation_prompt(self, clause: str, document_type: str, detail_level: str, legal_context: str) -> str:
        """Build prompt for clause explanation"""
        return f"""
        You are a legal expert specializing in startup and business law.
        
        Legal context: {legal_context}
        
        Please explain this {document_type} clause in {detail_level} detail:
        "{clause}"
        
        Provide a clear, understandable explanation suitable for entrepreneurs who may not have legal backgrounds.
        Include potential implications and considerations.
        """
    
    def _get_sources_used(self, context: str) -> List[str]:
        """Extract sources from context"""
        sources = []
        lines = context.split('\n')
        for line in lines:
            if line.startswith("From "):
                source = line.split(":")[0].replace("From ", "")
                if source not in sources:
                    sources.append(source)
        return sources
    
    def _calculate_confidence(self, question: str, response: str) -> float:
        """Calculate confidence score for the response"""
        confidence = min(0.9, len(response) / 1000)
        startup_terms = ["startup", "business", "funding", "market", "revenue", "growth"]
        term_matches = sum(1 for term in startup_terms if term.lower() in response.lower())
        confidence += min(0.1, term_matches * 0.02)
        return round(confidence, 2)

    def is_ai_configured(self) -> bool:
        """Check if the AI service is properly configured"""
        return self.model is not None
