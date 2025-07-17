import google.generativeai as genai
from typing import Dict, Any
import os
import logging
import json
from datetime import datetime
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
            self.model = genai.GenerativeModel('gemini-2.5-flash')
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
            logger.info(f"Gemini response received, length: {len(response.text) if response.text else 0}")
            
            if not response.text:
                logger.error("Empty response received from Gemini AI")
                raise Exception("Empty response received from Gemini AI")
            
            # Clean the response text
            response_text = response.text.strip()
            logger.debug(f"Gemini response preview: {response_text[:200]}...")
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            return response_text.strip()
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

        IMPORTANT: You must return ONLY a valid JSON object with no additional text, comments, or markdown formatting. Do not include ```json or ``` markers.

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

        Return the response as a valid JSON object with this exact structure:
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
            
            if not response:
                logger.error("Empty response from AI for pitch deck content")
                raise Exception("Empty response from AI")
            
            try:
                content_structure = json.loads(response)
                return content_structure
            except json.JSONDecodeError as json_err:
                logger.error(f"Error parsing JSON response: {str(json_err)}")
                logger.error(f"Raw response: {response[:500]}...")
                raise Exception(f"Invalid JSON response from AI: {str(json_err)}")
            
        except Exception as e:
            logger.error(f"Error generating pitch deck content: {str(e)}")
            raise
    
    async def generate_legal_document_content(self, document_type: str, document_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main method to generate legal document content based on document type
        """
        try:
            if document_type.lower() == "nda":
                return await self._generate_nda_content(document_info)
            elif document_type.lower() == "cda":
                return await self._generate_nda_content(document_info)  # CDA uses similar structure to NDA
            elif document_type.lower() == "employment":
                return await self._generate_employment_agreement_content(document_info)
            elif document_type.lower() == "founder":
                return await self._generate_founder_agreement_content(document_info)
            elif document_type.lower() == "terms_of_service":
                return await self._generate_terms_of_service_content(document_info)
            elif document_type.lower() == "privacy_policy":
                return await self._generate_privacy_policy_content(document_info)
            else:
                raise ValueError(f"Unsupported document type: {document_type}")
                
        except Exception as e:
            logger.error(f"Error generating {document_type} content: {str(e)}")
            raise

    async def _generate_nda_content(self, parties_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate NDA content using AI"""
        
        prompt = f"""
        You are a legal expert specializing in confidentiality agreements. Generate a comprehensive Non-Disclosure Agreement (NDA) based on the following information:

        Party Information:
        - Disclosing Party (Company): {parties_info.get('company_name', 'N/A')}
        - Company Address: {parties_info.get('company_address', 'N/A')}
        - Receiving Party: {parties_info.get('other_party_name', 'N/A')}
        - Receiving Party Address: {parties_info.get('other_party_address', 'N/A')}
        - Purpose: {parties_info.get('purpose', 'N/A')}
        - Duration: {parties_info.get('duration', '2')} years
        - Governing Law: {parties_info.get('governing_law', 'India')}

        IMPORTANT: You must return ONLY a valid JSON object with no additional text, comments, or markdown formatting. Do not include ```json or ``` markers.

        Generate a professional NDA with the following sections:
        1. Introduction and Parties
        2. Definition of Confidential Information
        3. Obligations of Receiving Party
        4. Permitted Disclosures
        5. Return of Information
        6. Term and Termination
        7. Remedies
        8. General Provisions

        Return the response as a valid JSON object with this exact structure:
        {{
            "document_title": "NON-DISCLOSURE AGREEMENT",
            "introduction": {{
                "title": "Introduction and Parties",
                "content": "This Non-Disclosure Agreement (Agreement) is entered into on [DATE] between {parties_info.get('company_name', '[COMPANY]')} (Disclosing Party) and {parties_info.get('other_party_name', '[RECEIVING_PARTY]')} (Receiving Party) for the purpose of {parties_info.get('purpose', 'discussing potential business opportunities')}."
            }},
            "definitions": {{
                "title": "Definition of Confidential Information", 
                "content": "For purposes of this Agreement, Confidential Information means any and all non-public, proprietary, or confidential information disclosed by the Disclosing Party..."
            }},
            "obligations": {{
                "title": "Obligations of Receiving Party",
                "content": "The Receiving Party agrees to hold and maintain the Confidential Information in strict confidence..."
            }},
            "permitted_disclosures": {{
                "title": "Permitted Disclosures",
                "content": "The obligations set forth in this Agreement shall not apply to information that..."
            }},
            "return_of_information": {{
                "title": "Return of Information",
                "content": "Upon termination of this Agreement or upon written request by the Disclosing Party..."
            }},
            "term_termination": {{
                "title": "Term and Termination",
                "content": "This Agreement shall remain in effect for a period of {parties_info.get('duration', '2')} years from the date of execution..."
            }},
            "remedies": {{
                "title": "Remedies",
                "content": "The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm..."
            }},
            "general_provisions": {{
                "title": "General Provisions",
                "content": "This Agreement shall be governed by the laws of {parties_info.get('governing_law', 'India')}..."
            }}
        }}

        Ensure all content is professional, legally appropriate, and customized to the provided party information.
        """
        
        try:
            response = await self._generate_response(prompt)
            
            if not response:
                logger.error("Empty response from AI for NDA content")
                raise Exception("Empty response from AI")
            
            try:
                content_structure = json.loads(response)
                return content_structure
            except json.JSONDecodeError as json_err:
                logger.error(f"Error parsing JSON response: {str(json_err)}")
                logger.error(f"Raw response: {response[:500]}...")
                raise Exception(f"Invalid JSON response from AI: {str(json_err)}")
            
        except Exception as e:
            logger.error(f"Error generating NDA content: {str(e)}")
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

        IMPORTANT: You must return ONLY a valid JSON object with no additional text, comments, or markdown formatting. Do not include ```json or ``` markers.
        
        Generate a professional employment agreement with standard employment terms. Return the response as a valid JSON object with this exact structure:

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
            
            if not response:
                logger.error("Empty response from AI for employment agreement content")
                raise Exception("Empty response from AI")
            
            try:
                content_structure = json.loads(response)
                return content_structure
            except json.JSONDecodeError as json_err:
                logger.error(f"Error parsing JSON response: {str(json_err)}")
                logger.error(f"Raw response: {response[:500]}...")
                raise Exception(f"Invalid JSON response from AI: {str(json_err)}")
            
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
        - Equity Split: {founders_info.get('equity_distribution', 'N/A')}
        - Roles and Responsibilities: {founders_info.get('roles_responsibilities', 'N/A')}
        - Vesting Schedule: {founders_info.get('vesting_schedule', 'N/A')}
        - Initial Investment: {founders_info.get('initial_investment', 'N/A')}

        IMPORTANT: You must return ONLY a valid JSON object with no additional text, comments, or markdown formatting. Do not include ```json or ``` markers.

        Generate a professional founder agreement covering all essential aspects of a startup founder relationship.

        Return the response as a valid JSON object with this exact structure:
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
            
            if not response:
                logger.error("Empty response from AI for founder agreement content")
                raise Exception("Empty response from AI")
            
            try:
                content_structure = json.loads(response)
                return content_structure
            except json.JSONDecodeError as json_err:
                logger.error(f"Error parsing JSON response: {str(json_err)}")
                logger.error(f"Raw response: {response[:500]}...")
                raise Exception(f"Invalid JSON response from AI: {str(json_err)}")
            
        except Exception as e:
            logger.error(f"Error generating founder agreement content: {str(e)}")
            raise

    async def _generate_terms_of_service_content(self, company_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate Terms of Service content using AI"""
        
        prompt = f"""
        You are a legal expert specializing in technology and business law. Generate comprehensive Terms of Service based on the following information:

        Company Information:
        - Company Name: {company_info.get('company_name', 'N/A')}
        - Website URL: {company_info.get('website_url', 'N/A')}
        - Contact Email: {company_info.get('contact_email', 'N/A')}
        - Service Description: {company_info.get('service_description', 'N/A')}
        - Governing Law: {company_info.get('governing_law', 'India')}
        - Effective Date: {company_info.get('effective_date', 'N/A')}

        IMPORTANT: You must return ONLY a valid JSON object with no additional text, comments, or markdown formatting. Do not include ```json or ``` markers.

        Generate professional Terms of Service that covers all essential legal protections for a digital service/platform.

        Return the response as a valid JSON object with this exact structure:
        {{
            "document_title": "TERMS OF SERVICE",
            "introduction": {{
                "title": "1. Introduction and Acceptance",
                "content": "These Terms of Service (Terms) govern your use of {company_info.get('company_name', '[COMPANY]')} services available at {company_info.get('website_url', '[WEBSITE]')}..."
            }},
            "service_description": {{
                "title": "2. Service Description",
                "content": "Our service provides {company_info.get('service_description', 'digital services')}..."
            }},
            "user_obligations": {{
                "title": "3. User Obligations and Prohibited Uses",
                "content": "By using our service, you agree to comply with all applicable laws and regulations..."
            }},
            "intellectual_property": {{
                "title": "4. Intellectual Property Rights",
                "content": "All content, features, and functionality of our service are owned by {company_info.get('company_name', '[COMPANY]')}..."
            }},
            "privacy_data": {{
                "title": "5. Privacy and Data Protection",
                "content": "Your privacy is important to us. Please review our Privacy Policy..."
            }},
            "payment_terms": {{
                "title": "6. Payment Terms and Refunds",
                "content": "If applicable, payment terms, billing cycles, and refund policies..."
            }},
            "limitation_liability": {{
                "title": "7. Limitation of Liability",
                "content": "To the maximum extent permitted by law, {company_info.get('company_name', '[COMPANY]')} shall not be liable for any indirect, incidental, special, consequential, or punitive damages..."
            }},
            "termination": {{
                "title": "8. Termination",
                "content": "We may terminate or suspend your access to our service immediately, without prior notice..."
            }},
            "dispute_resolution": {{
                "title": "9. Dispute Resolution",
                "content": "Any disputes arising from these Terms shall be resolved through binding arbitration under the laws of {company_info.get('governing_law', 'India')}..."
            }},
            "general_provisions": {{
                "title": "10. General Provisions",
                "content": "These Terms constitute the entire agreement between you and {company_info.get('company_name', '[COMPANY]')}. Contact us at {company_info.get('contact_email', '[EMAIL]')} for questions..."
            }}
        }}

        Ensure all content is professional, legally comprehensive, and customized to the provided company information.
        """
        
        try:
            response = await self._generate_response(prompt)
            
            if not response:
                logger.error("Empty response from AI for Terms of Service content")
                raise Exception("Empty response from AI")
            
            try:
                content_structure = json.loads(response)
                return content_structure
            except json.JSONDecodeError as json_err:
                logger.error(f"Error parsing JSON response for Terms of Service: {str(json_err)}")
                logger.error(f"Raw response: {response[:500]}...")
                raise Exception(f"Invalid JSON response from AI: {str(json_err)}")
            
        except Exception as e:
            logger.error(f"Error generating Terms of Service content: {str(e)}")
            raise

    async def _generate_privacy_policy_content(self, company_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate Privacy Policy content using AI"""
        
        prompt = f"""
        You are a legal expert specializing in privacy law and data protection. Generate a comprehensive Privacy Policy based on the following information:

        Company Information:
        - Company Name: {company_info.get('company_name', 'N/A')}
        - Website URL: {company_info.get('website_url', 'N/A')}
        - Contact Email: {company_info.get('contact_email', 'N/A')}
        - Data Collection: {company_info.get('data_collection', 'N/A')}
        - Data Usage: {company_info.get('data_usage', 'N/A')}
        - Data Sharing: {company_info.get('data_sharing', 'N/A')}
        - Governing Law: {company_info.get('governing_law', 'India')}
        - Effective Date: {company_info.get('effective_date', 'N/A')}

        IMPORTANT: You must return ONLY a valid JSON object with no additional text, comments, or markdown formatting. Do not include ```json or ``` markers.

        Generate a professional Privacy Policy that complies with major privacy regulations (GDPR, CCPA, etc.).

        Return the response as a valid JSON object with this exact structure:
        {{
            "document_title": "PRIVACY POLICY",
            "introduction": {{
                "title": "1. Introduction",
                "content": "This Privacy Policy describes how {company_info.get('company_name', '[COMPANY]')} collects, uses, and protects your personal information when you use our services at {company_info.get('website_url', '[WEBSITE]')}..."
            }},
            "information_collected": {{
                "title": "2. Information We Collect",
                "content": "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us..."
            }},
            "how_we_use": {{
                "title": "3. How We Use Your Information",
                "content": "We use the information we collect for purposes including: {company_info.get('data_usage', 'providing and improving our services')}..."
            }},
            "information_sharing": {{
                "title": "4. Information Sharing and Disclosure",
                "content": "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy..."
            }},
            "data_security": {{
                "title": "5. Data Security",
                "content": "We implement appropriate technical and organizational measures to protect your personal information..."
            }},
            "your_rights": {{
                "title": "6. Your Privacy Rights",
                "content": "Depending on your location, you may have certain rights regarding your personal information, including the right to access, update, or delete your data..."
            }},
            "cookies_tracking": {{
                "title": "7. Cookies and Tracking Technologies",
                "content": "We use cookies and similar tracking technologies to enhance your experience on our website..."
            }},
            "children_privacy": {{
                "title": "8. Children's Privacy",
                "content": "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children..."
            }},
            "policy_changes": {{
                "title": "9. Changes to This Privacy Policy",
                "content": "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page..."
            }},
            "contact_information": {{
                "title": "10. Contact Information",
                "content": "If you have any questions about this Privacy Policy, please contact us at {company_info.get('contact_email', '[EMAIL]')}..."
            }}
        }}

        Ensure all content is professional, legally compliant, and customized to the provided company information.
        """
        
        try:
            response = await self._generate_response(prompt)
            
            if not response:
                logger.error("Empty response from AI for Privacy Policy content")
                raise Exception("Empty response from AI")
            
            try:
                content_structure = json.loads(response)
                return content_structure
            except json.JSONDecodeError as json_err:
                logger.error(f"Error parsing JSON response for Privacy Policy: {str(json_err)}")
                logger.error(f"Raw response: {response[:500]}...")
                raise Exception(f"Invalid JSON response from AI: {str(json_err)}")
            
        except Exception as e:
            logger.error(f"Error generating Privacy Policy content: {str(e)}")
            raise

    def _get_fallback_content(self, document_type: str, document_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Provide fallback content when AI generation fails
        """
        if document_type.lower() in ["nda", "cda"]:
            return self._get_fallback_nda_content(document_info)
        elif document_type.lower() == "employment":
            return self._get_fallback_employment_content(document_info)
        elif document_type.lower() == "founder":
            return self._get_fallback_founder_content(document_info)
        elif document_type.lower() == "terms_of_service":
            return self._get_fallback_terms_content(document_info)
        elif document_type.lower() == "privacy_policy":
            return self._get_fallback_privacy_content(document_info)
        else:
            return {
                "document_title": f"{document_type.upper()} AGREEMENT",
                "content": {
                    "title": "Agreement",
                    "content": "This is a standard legal agreement template. Please consult with a legal professional for proper customization."
                }
            }

    def _get_fallback_nda_content(self, parties_info: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback NDA content when AI generation fails"""
        company_name = parties_info.get('company_name', '[COMPANY_NAME]')
        other_party = parties_info.get('other_party_name', '[RECEIVING_PARTY]')
        purpose = parties_info.get('purpose', 'discussing potential business opportunities')
        duration = parties_info.get('duration', '2')
        governing_law = parties_info.get('governing_law', 'India')
        
        return {
            "document_title": "NON-DISCLOSURE AGREEMENT",
            "introduction": {
                "title": "Introduction and Parties",
                "content": f"This Non-Disclosure Agreement (Agreement) is entered into between {company_name} (Disclosing Party) and {other_party} (Receiving Party) for the purpose of {purpose}."
            },
            "definitions": {
                "title": "Definition of Confidential Information",
                "content": "For purposes of this Agreement, Confidential Information means any and all non-public, proprietary, or confidential information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or in any other form."
            },
            "obligations": {
                "title": "Obligations of Receiving Party",
                "content": "The Receiving Party agrees to hold and maintain the Confidential Information in strict confidence and not to disclose such information to any third parties without prior written consent from the Disclosing Party."
            },
            "permitted_disclosures": {
                "title": "Permitted Disclosures",
                "content": "The obligations set forth in this Agreement shall not apply to information that: (a) is or becomes publicly available through no breach of this Agreement; (b) is rightfully received from a third party; or (c) is required to be disclosed by law."
            },
            "return_of_information": {
                "title": "Return of Information",
                "content": "Upon termination of this Agreement or upon written request by the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof."
            },
            "term_termination": {
                "title": "Term and Termination",
                "content": f"This Agreement shall remain in effect for a period of {duration} years from the date of execution, unless terminated earlier by mutual consent of the parties."
            },
            "remedies": {
                "title": "Remedies",
                "content": "The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party, for which monetary damages would be inadequate. Therefore, the Disclosing Party shall be entitled to seek injunctive relief."
            },
            "general_provisions": {
                "title": "General Provisions",
                "content": f"This Agreement shall be governed by the laws of {governing_law}. Any disputes arising under this Agreement shall be resolved through binding arbitration."
            }
        }

    def _get_fallback_employment_content(self, employment_info: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback employment agreement content when AI generation fails"""
        company_name = employment_info.get('company_name', '[COMPANY_NAME]')
        employee_name = employment_info.get('employee_name', '[EMPLOYEE_NAME]')
        position = employment_info.get('position', '[POSITION]')
        salary = employment_info.get('salary', '[SALARY]')
        
        return {
            "document_title": "EMPLOYMENT AGREEMENT",
            "parties_and_position": {
                "title": "Parties and Position",
                "content": f"This Employment Agreement is entered into between {company_name} (Company) and {employee_name} (Employee) for the position of {position}."
            },
            "duties_responsibilities": {
                "title": "Duties and Responsibilities",
                "content": f"The Employee shall perform the duties and responsibilities associated with the position of {position} as directed by the Company's management."
            },
            "compensation_benefits": {
                "title": "Compensation and Benefits",
                "content": f"The Employee shall receive an annual salary of {salary}, payable in accordance with the Company's standard payroll practices."
            },
            "termination": {
                "title": "Termination",
                "content": "This agreement may be terminated by either party with appropriate notice as required by applicable law."
            },
            "general_provisions": {
                "title": "General Provisions",
                "content": "This Agreement shall be governed by applicable employment laws and regulations."
            }
        }

    def _get_fallback_founder_content(self, founders_info: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback founder agreement content when AI generation fails"""
        company_name = founders_info.get('company_name', '[COMPANY_NAME]')
        
        return {
            "document_title": "FOUNDER AGREEMENT",
            "company_formation": {
                "title": "Company Formation and Ownership",
                "content": f"This Founder Agreement establishes the relationship between the founders of {company_name} and their respective ownership interests."
            },
            "equity_distribution": {
                "title": "Equity Distribution",
                "content": "The equity distribution among founders shall be as agreed upon and documented in the company's capitalization table."
            },
            "roles_responsibilities": {
                "title": "Roles and Responsibilities",
                "content": "Each founder shall have specific roles and responsibilities as outlined in this agreement and as may be modified by mutual consent."
            },
            "vesting_provisions": {
                "title": "Vesting Provisions",
                "content": "Founder equity shall be subject to vesting schedules to ensure long-term commitment to the company's success."
            },
            "decision_making": {
                "title": "Decision Making Process",
                "content": "Major business decisions shall be made collectively by the founders according to the voting procedures outlined herein."
            },
            "departure_provisions": {
                "title": "Founder Departure",
                "content": "In the event a founder leaves the company, the remaining founders shall have the right to repurchase unvested equity."
            },
            "intellectual_property": {
                "title": "Intellectual Property",
                "content": "All intellectual property created by founders in connection with the company shall be assigned to the company."
            },
            "general_provisions": {
                "title": "General Provisions",
                "content": "This Agreement shall be governed by applicable corporate law and shall be binding upon the parties and their successors."
            }
        }

    def _get_fallback_pitch_deck_content(self, business_info: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback pitch deck content when AI generation fails"""
        company_name = business_info.get('company_name', '[COMPANY_NAME]')
        
        return {
            "title": {
                "company_name": company_name,
                "tagline": business_info.get('tagline', 'Revolutionizing the industry'),
                "founders": business_info.get('founders', 'Founding Team')
            },
            "problem": {
                "title": "Problem",
                "main_problem": "There is a significant gap in the market that needs addressing.",
                "pain_points": ["Current solutions are inadequate", "Market needs innovation", "Customers are underserved"],
                "market_size_affected": "Large market segment affected"
            },
            "solution": {
                "title": "Solution",
                "value_proposition": f"{company_name} provides an innovative solution to address market needs.",
                "key_features": ["Feature 1", "Feature 2", "Feature 3"],
                "unique_selling_points": ["Unique advantage 1", "Unique advantage 2"]
            },
            "market": {
                "title": "Market Opportunity",
                "total_addressable_market": "$X Billion",
                "serviceable_addressable_market": "$Y Million",
                "target_market_description": "Our target market consists of..."
            }
        }
