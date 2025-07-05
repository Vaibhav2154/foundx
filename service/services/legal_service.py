# services/legal_service.py

from typing import Dict, Any
import logging
from pathlib import Path
from utils.legal_generator import LegalDocumentGenerator
from services.content_generator import ContentGeneratorService

logger = logging.getLogger(__name__)

class LegalService:
    """
    Dedicated service for generating legal documents with AI-powered content generation
    """
    
    def __init__(self):
        self.legal_generator = LegalDocumentGenerator()
        self.content_generator = ContentGeneratorService()
        self.output_dir = Path("generated_docs/legal")
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    async def generate_nda(self, parties_info: Dict[str, Any], 
                          use_ai: bool = True) -> Dict[str, Any]:
        """Generate NDA document with optional AI content generation"""
        try:
            filename = f"nda_{parties_info.get('company_name', 'document').lower().replace(' ', '_')}.pdf"
            
            if use_ai:
                # Generate content using AI
                content_structure = await self.content_generator.generate_legal_document_content(
                    "nda", parties_info
                )
            else:
                # Use provided content structure (fallback)
                content_structure = parties_info.get('content_structure', {})
            
            file_path = self.legal_generator.create_nda(
                content_structure,
                str(self.output_dir / filename)
            )
            
            return {
                "file_path": file_path,
                "filename": filename,
                "file_type": "application/pdf",
                "status": "success",
                "ai_generated": use_ai
            }
            
        except Exception as e:
            logger.error(f"Error generating NDA: {str(e)}")
            raise
    
    async def generate_cda(self, parties_info: Dict[str, Any],
                          use_ai: bool = True) -> Dict[str, Any]:
        """Generate CDA (Confidentiality Disclosure Agreement) document with optional AI content generation"""
        try:
            filename = f"cda_{parties_info.get('company_name', 'document').lower().replace(' ', '_')}.pdf"
            
            if use_ai:
                # Generate content using AI
                content_structure = await self.content_generator.generate_legal_document_content(
                    "cda", parties_info
                )
            else:
                # Use provided content structure (fallback)
                content_structure = parties_info.get('content_structure', {})
            
            file_path = self.legal_generator.create_cda(
                content_structure,
                str(self.output_dir / filename)
            )
            
            return {
                "file_path": file_path,
                "filename": filename,
                "file_type": "application/pdf",
                "status": "success",
                "ai_generated": use_ai
            }
            
        except Exception as e:
            logger.error(f"Error generating CDA: {str(e)}")
            raise
    
    async def generate_employment_agreement(self, employment_info: Dict[str, Any],
                                          use_ai: bool = True) -> Dict[str, Any]:
        """Generate employment agreement with optional AI content generation"""
        try:
            filename = f"employment_{employment_info.get('employee_name', 'agreement').lower().replace(' ', '_')}.pdf"
            
            if use_ai:
                # Generate content using AI
                content_structure = await self.content_generator.generate_legal_document_content(
                    "employment", employment_info
                )
            else:
                # Use provided content structure (fallback)
                content_structure = employment_info.get('content_structure', {})
            
            file_path = self.legal_generator.create_employment_agreement(
                content_structure,
                str(self.output_dir / filename)
            )
            
            return {
                "file_path": file_path,
                "filename": filename,
                "file_type": "application/pdf",
                "status": "success",
                "ai_generated": use_ai
            }
            
        except Exception as e:
            logger.error(f"Error generating employment agreement: {str(e)}")
            raise
    
    async def generate_founder_agreement(self, founders_info: Dict[str, Any],
                                       use_ai: bool = True) -> Dict[str, Any]:
        """Generate founder agreement with optional AI content generation"""
        try:
            filename = f"founder_agreement_{founders_info.get('company_name', 'document').lower().replace(' ', '_')}.pdf"
            
            if use_ai:
                # Generate content using AI
                content_structure = await self.content_generator.generate_legal_document_content(
                    "founder", founders_info
                )
            else:
                # Use provided content structure (fallback)
                content_structure = founders_info.get('content_structure', {})
            
            file_path = self.legal_generator.create_founder_agreement(
                content_structure,
                str(self.output_dir / filename)
            )
            
            return {
                "file_path": file_path,
                "filename": filename,
                "file_type": "application/pdf",
                "status": "success",
                "ai_generated": use_ai
            }
            
        except Exception as e:
            logger.error(f"Error generating founder agreement: {str(e)}")
            raise

    async def generate_terms_of_service(self, company_info: Dict[str, Any],
                                       use_ai: bool = True) -> Dict[str, Any]:
        """Generate Terms of Service with optional AI content generation"""
        try:
            filename = f"terms_of_service_{company_info.get('company_name', 'document').lower().replace(' ', '_')}.pdf"
            
            if use_ai:
                # Generate content using AI
                content_structure = await self.content_generator.generate_legal_document_content(
                    "terms_of_service", company_info
                )
            else:
                # Use provided content structure (fallback)
                content_structure = company_info.get('content_structure', {})
            
            file_path = self.legal_generator.create_terms_of_service(
                content_structure,
                str(self.output_dir / filename)
            )
            
            return {
                "file_path": file_path,
                "filename": filename,
                "file_type": "application/pdf",
                "status": "success",
                "ai_generated": use_ai
            }
            
        except Exception as e:
            logger.error(f"Error generating Terms of Service: {str(e)}")
            raise

    async def generate_privacy_policy(self, company_info: Dict[str, Any],
                                     use_ai: bool = True) -> Dict[str, Any]:
        """Generate Privacy Policy with optional AI content generation"""
        try:
            filename = f"privacy_policy_{company_info.get('company_name', 'document').lower().replace(' ', '_')}.pdf"
            
            if use_ai:
                # Generate content using AI
                content_structure = await self.content_generator.generate_legal_document_content(
                    "privacy_policy", company_info
                )
            else:
                # Use provided content structure (fallback)
                content_structure = company_info.get('content_structure', {})
            
            file_path = self.legal_generator.create_privacy_policy(
                content_structure,
                str(self.output_dir / filename)
            )
            
            return {
                "file_path": file_path,
                "filename": filename,
                "file_type": "application/pdf",
                "status": "success",
                "ai_generated": use_ai
            }
            
        except Exception as e:
            logger.error(f"Error generating Privacy Policy: {str(e)}")
            raise