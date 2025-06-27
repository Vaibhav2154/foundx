from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.presentation_service import PresentationService
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Presentation Generation"])

presentation_service = PresentationService()

class PitchDeckRequest(BaseModel):
    business_info: Dict[str, Any]
    use_ai: bool = True
    content_structure: Optional[Dict[str, Any]] = None

class BusinessPlanRequest(BaseModel):
    business_info: Dict[str, Any]  
    use_ai: bool = True 
    content_structure: Optional[Dict[str, Any]] = None

class PresentationResponse(BaseModel):
    filename: str
    file_type: str
    status: str
    ai_generated: bool = False
    message: Optional[str] = None

@router.post("/create-pitch-deck")
async def create_pitch_deck(request: PitchDeckRequest):
    """
    Create a pitch deck PowerPoint presentation with AI-powered content generation
    
    Expected business_info structure:
    {
        "company_name": "Your Company",
        "industry": "Technology/Healthcare/etc",
        "description": "Brief company description",
        "target_market": "Target customer description",
        "business_model": "Revenue model description",
        "funding_amount": "Seeking $X in funding",
        "team_size": "Number of team members",
        "stage": "Seed/Series A/etc",
        "key_features": "Key product features",
        "competitive_advantage": "What makes you unique"
    }
    
    Set use_ai=True (default) to automatically generate compelling presentation content,
    or use_ai=False to provide manual content_structure.
    """
    try:
        logger.info(f"Creating {'AI-generated' if request.use_ai else 'manual'} pitch deck for: {request.business_info.get('company_name', 'Unknown')}")
        
        result = await presentation_service.create_pitch_deck(
            business_info=request.business_info,
            use_ai=request.use_ai
        )
        
        file_path = result["file_path"]
        filename = result["filename"]
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail="Generated file not found")
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type=result["file_type"],
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        logger.error(f"Error creating pitch deck: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating pitch deck: {str(e)}")

@router.post("/create-business-plan")
async def create_business_plan_presentation(request: BusinessPlanRequest):
    """
    Create a business plan PowerPoint presentation with AI-powered content generation
    
    Expected business_info structure: (same as pitch deck)
    {
        "company_name": "Your Company",
        "industry": "Technology/Healthcare/etc",
        "description": "Brief company description",
        "target_market": "Target customer description", 
        "business_model": "Revenue model description",
        "funding_amount": "Seeking $X in funding",
        "team_size": "Number of team members",
        "stage": "Seed/Series A/etc",
        "key_features": "Key product features",
        "competitive_advantage": "What makes you unique"
    }
    
    Set use_ai=True (default) to automatically generate compelling presentation content,
    or use_ai=False to provide manual content_structure.
    """
    try:
        logger.info(f"Creating {'AI-generated' if request.use_ai else 'manual'} business plan for: {request.business_info.get('company_name', 'Unknown')}")
        
        result = await presentation_service.create_business_plan_presentation(
            business_info=request.business_info,
            use_ai=request.use_ai
        )
        
        file_path = result["file_path"]
        filename = result["filename"]
        
        if not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail="Generated file not found")
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type=result["file_type"],
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        logger.error(f"Error creating business plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating business plan: {str(e)}")

@router.get("/templates")
async def get_presentation_templates():
    """
    Get available presentation templates and their required information
    All templates now support AI-powered content generation
    """
    return {
        "pitch_deck": {
            "name": "Pitch Deck",
            "description": "Professional investor presentation with compelling content (AI-Generated)",
            "ai_supported": True,
            "slides": [
                "Title Slide", "Problem Statement", "Solution", "Market Opportunity",
                "Business Model", "Competition", "Team", "Financial Projections", 
                "Funding Request", "Contact Information"
            ],
            "required_fields": [
                "company_name", "industry", "description", "target_market",
                "business_model", "funding_amount", "team_size", "stage",
                "key_features", "competitive_advantage"
            ]
        },
        "business_plan": {
            "name": "Business Plan Presentation",
            "description": "Comprehensive business plan presentation for stakeholders (AI-Generated)",
            "ai_supported": True,
            "slides": [
                "Executive Summary", "Company Overview", "Market Analysis",
                "Products/Services", "Marketing Strategy", "Operations Plan",
                "Management Team", "Financial Projections", "Investment Request"
            ],
            "required_fields": [
                "company_name", "industry", "description", "target_market",
                "business_model", "funding_amount", "team_size", "stage",
                "key_features", "competitive_advantage"
            ]
        }
    }

@router.post("/preview-content")
async def preview_presentation_content(business_info: Dict[str, Any]):
    """
    Preview AI-generated content for presentations without creating the PowerPoint file
    
    business_info: Same structure as the create endpoints
    """
    try:
        logger.info(f"Previewing AI content for presentation")
        
        # Import here to avoid circular imports
        from services.content_generator import ContentGeneratorService
        content_generator = ContentGeneratorService()
        
        content_structure = await content_generator.generate_pitch_deck_content(business_info)
        
        return {
            "content_structure": content_structure,
            "status": "success",
            "message": "Content generated successfully. Use this content structure to create the presentation."
        }
        
    except Exception as e:
        logger.error(f"Error previewing presentation content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error previewing content: {str(e)}")