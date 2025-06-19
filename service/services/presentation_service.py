# services/presentation_service.py

from typing import Dict, Any
import logging
from pathlib import Path
from utils.ppt_generator import PowerPointGenerator
from services.content_generator import ContentGeneratorService

logger = logging.getLogger(__name__)

class PresentationService:
    """
    Dedicated service for generating PowerPoint presentations with AI-powered content generation
    """
    
    def __init__(self):
        self.ppt_generator = PowerPointGenerator()
        self.content_generator = ContentGeneratorService()
        self.output_dir = Path("generated_docs/presentations")
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    async def create_pitch_deck(self, business_info: dict, use_ai: bool = True) -> Dict[str, Any]:
        """Create a pitch deck presentation with AI-generated content or provided content"""
        try:
            if use_ai:
                content_structure = await self.content_generator.generate_pitch_deck_content(business_info)
            else:
                content_structure = business_info.get('content_structure', {})
            
            file_path = self.ppt_generator.create_pitch_deck(content_structure, business_info)
            
            company_name = business_info.get('company_name', 'pitch_deck')
            filename = f"pitch_deck_{company_name.lower().replace(' ', '_')}.pptx"
            
            logger.info(f"Pitch deck created successfully: {file_path}")
            
            return {
                "file_path": file_path,
                "filename": filename,
                "file_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "status": "success",
                "ai_generated": use_ai
            }
            
        except Exception as e:
            logger.error(f"Error creating pitch deck: {str(e)}")
            raise
    
    async def create_business_plan_presentation(self, business_info: Dict[str, Any],
                                              use_ai: bool = True) -> Dict[str, Any]:
        """Create a business plan presentation with AI-generated content or provided content"""
        try:
            if use_ai:
                # Generate content using AI - can reuse pitch deck content for business plan
                content_structure = await self.content_generator.generate_pitch_deck_content(business_info)
            else:
                # Use provided content structure (fallback)
                content_structure = business_info.get('content_structure', {})
            
            company_name = business_info.get('company_name', 'Business')
            filename = f"business_plan_{company_name.lower().replace(' ', '_')}.pptx"
            
            file_path = self.ppt_generator.create_business_plan_presentation(content_structure)
            
            return {
                "file_path": file_path,
                "filename": filename,
                "file_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "status": "success",
                "ai_generated": use_ai
            }
            
        except Exception as e:
            logger.error(f"Error creating business plan presentation: {str(e)}")
            raise

