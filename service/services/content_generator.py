# services/content_generator.py

import google.generativeai as genai
from typing import Dict, List, Optional, Any
import os
import logging
import json
from config import settings

logger = logging.getLogger(__name__)

class ContentGeneratorService:
    """
    Service for generating content using Gemini AI for presentations and legal documents
    """
    
    def __init__(self):
        self.setup_gemini()
    
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
            logger.info("Gemini AI configured successfully for content generation")
        except Exception as e:
            logger.error(f"Error configuring Gemini AI: {str(e)}")
            self.model = None
    
    async def _generate_response(self, prompt: str) -> str:
        """Generate a response using Gemini AI"""
        if not self.model:
            raise Exception("Gemini AI is not configured. Please check your API key.")
        
        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error generating content with Gemini: {str(e)}")
            raise
    
    async def generate_pitch_deck_content(self, business_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive pitch deck content based on business information"""
        
        prompt = f"""
        You are an expert startup advisor and pitch deck consultant. Generate a comprehensive pitch deck content structure for a startup based on the following business information:

        Business Information:
        - Company Name: {business_info.get('company_name', 'N/A')}
        - Industry: {business_info.get('industry', 'N/A')}
        - Business Description: {business_info.get('description', 'N/A')}
        - Target Market: {business_info.get('target_market', 'N/A')}
        - Business Model: {business_info.get('business_model', 'N/A')}
        - Funding Amount: {business_info.get('funding_amount', 'N/A')}
        - Team Size: {business_info.get('team_size', 'N/A')}
        - Current Stage: {business_info.get('stage', 'N/A')}
        - Key Features: {business_info.get('key_features', 'N/A')}
        - Competitive Advantage: {business_info.get('competitive_advantage', 'N/A')}

        Generate a detailed pitch deck structure with the following slides. For each slide, provide compelling, professional content that would impress investors:

        1. Title Slide
        2. Problem Statement
        3. Solution
        4. Market Opportunity
        5. Business Model
        6. Competition Analysis
        7. Team
        8. Financial Projections
        9. Funding Request
        10. Contact Information

        Return the response in JSON format with the following structure:
        {{
            "title": {{
                "company_name": "...",
                "tagline": "...",
                "founders": "..."
            }},
            "problem": {{
                "title": "Problem",
                "main_problem": "...",
                "pain_points": ["...", "...", "..."],
                "market_size_affected": "..."
            }},
            "solution": {{
                "title": "Solution", 
                "value_proposition": "...",
                "key_features": ["...", "...", "..."],
                "unique_selling_points": ["...", "...", "..."]
            }},
            "market": {{
                "title": "Market Opportunity",
                "total_addressable_market": "...",
                "serviceable_addressable_market": "...",
                "target_market_description": "...",
                "market_trends": ["...", "...", "..."]
            }},
            "business_model": {{
                "title": "Business Model",
                "revenue_streams": ["...", "...", "..."],
                "pricing_strategy": "...",
                "customer_acquisition": "...",
                "key_partnerships": ["...", "...", "..."]
            }},
            "competition": {{
                "title": "Competition",
                "main_competitors": ["...", "...", "..."],
                "competitive_advantages": ["...", "...", "..."],
                "market_positioning": "..."
            }},
            "team": {{
                "title": "Team",
                "team_description": "...",
                "key_team_members": ["...", "...", "..."],
                "advisors": ["...", "...", "..."],
                "hiring_plans": "..."
            }},
            "financials": {{
                "title": "Financial Projections",
                "revenue_projection": "...",
                "key_metrics": ["...", "...", "..."],
                "financial_highlights": ["...", "...", "..."],
                "break_even_timeline": "..."
            }},
            "funding": {{
                "title": "Funding Request",
                "funding_amount": "...",
                "use_of_funds": ["...", "...", "..."],
                "milestones": ["...", "...", "..."],
                "expected_roi": "..."
            }},
            "contact": {{
                "title": "Contact",
                "contact_info": "...",
                "website": "...",
                "social_media": "...",
                "call_to_action": "..."
            }}
        }}

        Make sure the content is professional, compelling, and tailored to the specific business information provided. Use realistic numbers and projections where appropriate.
        """
        
        try:
            response = await self._generate_response(prompt)
            
            content_structure = json.loads(response)
            return content_structure
            
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON response: {str(e)}")
            # Return a fallback structure if JSON parsing fails
            return self._get_fallback_pitch_deck_content(business_info)
        except Exception as e:
            logger.error(f"Error generating pitch deck content: {str(e)}")
            raise
    
    async def generate_legal_document_content(self, document_type: str, parties_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate legal document content based on document type and parties information"""
        
        if document_type.lower() in ['nda', 'cda']:
            return await self._generate_nda_cda_content(document_type, parties_info)
        elif document_type.lower() == 'employment':
            return await self._generate_employment_agreement_content(parties_info)
        elif document_type.lower() == 'founder':
            return await self._generate_founder_agreement_content(parties_info)
        else:
            raise ValueError(f"Unsupported document type: {document_type}")
    
    async def _generate_nda_cda_content(self, document_type: str, parties_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate NDA/CDA content"""
        
        doc_name = "Non-Disclosure Agreement" if document_type.lower() == 'nda' else "Confidentiality Disclosure Agreement"
        
        prompt = f"""
        You are a legal expert specializing in business contracts. Generate a comprehensive {doc_name} based on the following information:

        Parties Information:
        - Company Name: {parties_info.get('company_name', 'N/A')}
        - Company Address: {parties_info.get('company_address', 'N/A')}
        - Other Party Name: {parties_info.get('other_party_name', 'N/A')}
        - Other Party Address: {parties_info.get('other_party_address', 'N/A')}
        - Purpose: {parties_info.get('purpose', 'N/A')}
        - Duration: {parties_info.get('duration', 'N/A')}
        - Effective Date: {parties_info.get('effective_date', 'N/A')}

        Generate a professional {doc_name} with the following sections. Ensure the content is legally sound and professional:

        1. Introduction and Parties
        2. Definition of Confidential Information
        3. Obligations of Receiving Party
        4. Permitted Disclosures
        5. Return of Information
        6. Term and Termination
        7. Remedies
        8. General Provisions

        Return the response in JSON format with the following structure:
        {{
            "document_title": "{doc_name.upper()}",
            "introduction": {{
                "title": "Introduction and Parties",
                "content": "Detailed introduction paragraph mentioning both parties and the purpose of the agreement..."
            }},
            "definitions": {{
                "title": "Definition of Confidential Information", 
                "content": "Comprehensive definition of what constitutes confidential information..."
            }},
            "obligations": {{
                "title": "Obligations of Receiving Party",
                "content": "Detailed obligations and responsibilities of the receiving party..."
            }},
            "permitted_disclosures": {{
                "title": "Permitted Disclosures",
                "content": "Circumstances under which disclosure is permitted..."
            }},
            "return_of_information": {{
                "title": "Return of Information",
                "content": "Requirements for returning confidential information..."
            }},
            "term_termination": {{
                "title": "Term and Termination",
                "content": "Duration of the agreement and termination conditions..."
            }},
            "remedies": {{
                "title": "Remedies",
                "content": "Legal remedies available for breach of agreement..."
            }},
            "general_provisions": {{
                "title": "General Provisions",
                "content": "Governing law, jurisdiction, and other general terms..."
            }}
        }}

        Ensure all content is professional, legally appropriate, and customized to the provided party information.
        """
        
        try:
            response = await self._generate_response(prompt)
            content_structure = json.loads(response)
            return content_structure
            
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON response: {str(e)}")
            return self._get_fallback_nda_content(document_type, parties_info)
        except Exception as e:
            logger.error(f"Error generating {document_type} content: {str(e)}")
            raise
    
    async def _generate_employment_agreement_content(self, employment_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate employment agreement content"""
        
        prompt = f"""
        You are a legal expert specializing in employment law. Generate a comprehensive employment agreement based on the following information:

        Employment Information:
        - Company Name: {employment_info.get('company_name', 'N/A')}
        - Employee Name: {employment_info.get('employee_name', 'N/A')}
        - Position/Title: {employment_info.get('position', 'N/A')}
        - Department: {employment_info.get('department', 'N/A')}
        - Start Date: {employment_info.get('start_date', 'N/A')}
        - Salary: {employment_info.get('salary', 'N/A')}
        - Employment Type: {employment_info.get('employment_type', 'N/A')}
        - Benefits: {employment_info.get('benefits', 'N/A')}
        - Location: {employment_info.get('location', 'N/A')}

        Generate a professional employment agreement with standard employment terms. Return the response in JSON format with structured sections.

        {{
            "document_title": "EMPLOYMENT AGREEMENT",
            "parties_and_position": {{
                "title": "Parties and Position",
                "content": "Agreement details, parties involved, and position description..."
            }},
            "duties_responsibilities": {{
                "title": "Duties and Responsibilities", 
                "content": "Detailed job duties and responsibilities..."
            }},
            "compensation_benefits": {{
                "title": "Compensation and Benefits",
                "content": "Salary, benefits, and compensation details..."
            }},
            "confidentiality": {{
                "title": "Confidentiality",
                "content": "Confidentiality obligations and non-disclosure terms..."
            }},
            "termination": {{
                "title": "Termination",
                "content": "Termination conditions and procedures..."
            }},
            "general_provisions": {{
                "title": "General Provisions",
                "content": "Governing law, amendments, and other general terms..."
            }}
        }}
        """
        
        try:
            response = await self._generate_response(prompt)
            content_structure = json.loads(response)
            return content_structure
            
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON response: {str(e)}")
            return self._get_fallback_employment_content(employment_info)
        except Exception as e:
            logger.error(f"Error generating employment agreement content: {str(e)}")
            raise
    
    async def _generate_founder_agreement_content(self, founders_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate founder agreement content"""
        
        prompt = f"""
        You are a legal expert specializing in startup and business law. Generate a comprehensive founder agreement based on the following information:

        Founders Information:
        - Company Name: {founders_info.get('company_name', 'N/A')}
        - Founders: {founders_info.get('founders', 'N/A')}
        - Equity Split: {founders_info.get('equity_split', 'N/A')}
        - Roles and Responsibilities: {founders_info.get('roles', 'N/A')}
        - Vesting Schedule: {founders_info.get('vesting_schedule', 'N/A')}
        - Initial Investment: {founders_info.get('initial_investment', 'N/A')}

        Generate a professional founder agreement covering all essential aspects of a startup founder relationship.

        {{
            "document_title": "FOUNDER AGREEMENT",
            "company_formation": {{
                "title": "Company Formation and Ownership",
                "content": "Company details and initial ownership structure..."
            }},
            "equity_distribution": {{
                "title": "Equity Distribution", 
                "content": "Detailed equity allocation among founders..."
            }},
            "roles_responsibilities": {{
                "title": "Roles and Responsibilities",
                "content": "Each founder's role, duties, and time commitments..."
            }},
            "vesting_provisions": {{
                "title": "Vesting Provisions",
                "content": "Equity vesting schedules and conditions..."
            }},
            "decision_making": {{
                "title": "Decision Making Process",
                "content": "How major business decisions will be made..."
            }},
            "departure_provisions": {{
                "title": "Founder Departure",
                "content": "What happens if a founder leaves the company..."
            }},
            "intellectual_property": {{
                "title": "Intellectual Property",
                "content": "IP ownership and assignment provisions..."
            }},
            "general_provisions": {{
                "title": "General Provisions",
                "content": "Dispute resolution, governing law, and other terms..."
            }}
        }}
        """
        
        try:
            response = await self._generate_response(prompt)
            content_structure = json.loads(response)
            return content_structure
            
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing JSON response: {str(e)}")
            return self._get_fallback_founder_content(founders_info)
        except Exception as e:
            logger.error(f"Error generating founder agreement content: {str(e)}")
            raise
    
    def _get_fallback_pitch_deck_content(self, business_info: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback pitch deck content if AI generation fails"""
        company_name = business_info.get('company_name', 'Your Company')
        
        return {
            "title": {
                "company_name": company_name,
                "tagline": f"Innovative solutions in {business_info.get('industry', 'technology')}",
                "founders": business_info.get('founders', 'Founding Team')
            },
            "problem": {
                "title": "Problem",
                "main_problem": f"Current challenges in {business_info.get('industry', 'the market')}",
                "pain_points": ["Market inefficiencies", "Customer pain points", "Existing solution gaps"],
                "market_size_affected": "Large addressable market"
            },
            "solution": {
                "title": "Solution",
                "value_proposition": f"{company_name} provides innovative solutions",
                "key_features": ["Feature 1", "Feature 2", "Feature 3"],
                "unique_selling_points": ["Competitive advantage 1", "Competitive advantage 2"]
            },
            "market": {
                "title": "Market Opportunity",
                "total_addressable_market": "Large TAM",
                "serviceable_addressable_market": "Significant SAM",
                "target_market_description": business_info.get('target_market', 'Target customers'),
                "market_trends": ["Growing market", "Digital transformation", "Industry trends"]
            },
            "business_model": {
                "title": "Business Model",
                "revenue_streams": ["Primary revenue", "Secondary revenue", "Future opportunities"],
                "pricing_strategy": "Competitive pricing model",
                "customer_acquisition": "Multi-channel acquisition strategy",
                "key_partnerships": ["Strategic partner 1", "Strategic partner 2"]
            },
            "competition": {
                "title": "Competition",
                "main_competitors": ["Competitor 1", "Competitor 2", "Indirect competitors"],
                "competitive_advantages": ["Our advantage 1", "Our advantage 2"],
                "market_positioning": "Unique market position"
            },
            "team": {
                "title": "Team",
                "team_description": "Experienced team with domain expertise",
                "key_team_members": ["Founder/CEO", "CTO", "Key team members"],
                "advisors": ["Industry advisor", "Technical advisor"],
                "hiring_plans": "Strategic hiring roadmap"
            },
            "financials": {
                "title": "Financial Projections",
                "revenue_projection": "Growing revenue trajectory",
                "key_metrics": ["User growth", "Revenue growth", "Market penetration"],
                "financial_highlights": ["Positive unit economics", "Scalable model"],
                "break_even_timeline": "Path to profitability"
            },
            "funding": {
                "title": "Funding Request",
                "funding_amount": business_info.get('funding_amount', 'Seeking investment'),
                "use_of_funds": ["Product development", "Marketing", "Team expansion"],
                "milestones": ["6-month goals", "12-month goals", "18-month goals"],
                "expected_roi": "Strong return potential"
            },
            "contact": {
                "title": "Contact",
                "contact_info": "Contact information",
                "website": "www.company.com",
                "social_media": "Social media handles",
                "call_to_action": "Let's discuss partnership opportunities"
            }
        }
    
    def _get_fallback_nda_content(self, document_type: str, parties_info: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback NDA/CDA content if AI generation fails"""
        doc_title = "NON-DISCLOSURE AGREEMENT" if document_type.lower() == 'nda' else "CONFIDENTIALITY DISCLOSURE AGREEMENT"
        
        return {
            "document_title": doc_title,
            "introduction": {
                "title": "Introduction and Parties",
                "content": f"This {doc_title} is entered into between {parties_info.get('company_name', '[Company Name]')} and {parties_info.get('other_party_name', '[Other Party Name]')} for the purpose of {parties_info.get('purpose', '[Purpose]')}."
            },
            "definitions": {
                "title": "Definition of Confidential Information",
                "content": "Confidential Information includes all non-public, proprietary information disclosed by either party."
            },
            "obligations": {
                "title": "Obligations of Receiving Party",
                "content": "The receiving party agrees to maintain confidentiality and use the information solely for the specified purpose."
            },
            "permitted_disclosures": {
                "title": "Permitted Disclosures",
                "content": "Information may be disclosed if required by law or if it becomes publicly available through no fault of the receiving party."
            },
            "return_of_information": {
                "title": "Return of Information",
                "content": "All confidential materials must be returned or destroyed upon termination of this agreement."
            },
            "term_termination": {
                "title": "Term and Termination",
                "content": f"This agreement shall remain in effect for {parties_info.get('duration', '[Duration]')} unless terminated earlier."
            },
            "remedies": {
                "title": "Remedies",
                "content": "Breach of this agreement may result in irreparable harm, and the disclosing party may seek injunctive relief."
            },
            "general_provisions": {
                "title": "General Provisions",
                "content": "This agreement shall be governed by applicable law and any disputes shall be resolved through appropriate legal channels."
            }
        }
    
    def _get_fallback_employment_content(self, employment_info: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback employment agreement content if AI generation fails"""
        return {
            "document_title": "EMPLOYMENT AGREEMENT",
            "parties_and_position": {
                "title": "Parties and Position",
                "content": f"Employment agreement between {employment_info.get('company_name', '[Company Name]')} and {employment_info.get('employee_name', '[Employee Name]')} for the position of {employment_info.get('position', '[Position]')}."
            },
            "duties_responsibilities": {
                "title": "Duties and Responsibilities",
                "content": f"Employee will perform duties as {employment_info.get('position', '[Position]')} in the {employment_info.get('department', '[Department]')} department."
            },
            "compensation_benefits": {
                "title": "Compensation and Benefits",
                "content": f"Annual salary of {employment_info.get('salary', '[Salary]')} plus benefits as outlined in company policy."
            },
            "confidentiality": {
                "title": "Confidentiality",
                "content": "Employee agrees to maintain confidentiality of all proprietary company information."
            },
            "termination": {
                "title": "Termination",
                "content": "Employment may be terminated by either party with appropriate notice as required by law."
            },
            "general_provisions": {
                "title": "General Provisions",
                "content": "This agreement is governed by applicable employment law and company policies."
            }
        }
    
    def _get_fallback_founder_content(self, founders_info: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback founder agreement content if AI generation fails"""
        return {
            "document_title": "FOUNDER AGREEMENT",
            "company_formation": {
                "title": "Company Formation and Ownership",
                "content": f"Agreement for {founders_info.get('company_name', '[Company Name]')} among the founding team."
            },
            "equity_distribution": {
                "title": "Equity Distribution",
                "content": f"Equity will be distributed as follows: {founders_info.get('equity_split', '[Equity Split]')}."
            },
            "roles_responsibilities": {
                "title": "Roles and Responsibilities",
                "content": f"Founder roles and responsibilities: {founders_info.get('roles', '[Roles and Responsibilities]')}."
            },
            "vesting_provisions": {
                "title": "Vesting Provisions",
                "content": f"Equity vesting schedule: {founders_info.get('vesting_schedule', '[Vesting Schedule]')}."
            },
            "decision_making": {
                "title": "Decision Making Process",
                "content": "Major decisions require consensus among all founders."
            },
            "departure_provisions": {
                "title": "Founder Departure",
                "content": "Procedures for handling founder departure and equity treatment."
            },
            "intellectual_property": {
                "title": "Intellectual Property",
                "content": "All IP developed for the company belongs to the company."
            },
            "general_provisions": {
                "title": "General Provisions",
                "content": "This agreement is governed by applicable corporate law."
            }
        }
