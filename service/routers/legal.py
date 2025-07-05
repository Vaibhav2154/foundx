from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.legal_service import LegalService
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Legal Document Generation"])

# Initialize the legal service
legal_service = LegalService()

class NDARequest(BaseModel):
    parties_info: Dict[str, Any]  # Company info, other party info, etc.
    use_ai: bool = True  # Whether to use AI for content generation
    content_structure: Optional[Dict[str, Any]] = None  # Manual content if use_ai is False

class CDARequest(BaseModel):
    parties_info: Dict[str, Any]  # Same structure as NDA - CDA is essentially an NDA
    use_ai: bool = True  # Whether to use AI for content generation  
    content_structure: Optional[Dict[str, Any]] = None  # Manual content if use_ai is False

class EmploymentAgreementRequest(BaseModel):
    employment_info: Dict[str, Any]  # Employee details, company details, terms, etc.
    use_ai: bool = True  # Whether to use AI for content generation
    content_structure: Optional[Dict[str, Any]] = None  # Manual content if use_ai is False

class FounderAgreementRequest(BaseModel):
    founders_info: Dict[str, Any]  # Founder details, equity split, etc.
    use_ai: bool = True  # Whether to use AI for content generation
    content_structure: Optional[Dict[str, Any]] = None  # Manual content if use_ai is False

class TermsOfServiceRequest(BaseModel):
    company_info: Dict[str, Any]  # Company details, service details, etc.
    use_ai: bool = True  # Whether to use AI for content generation
    content_structure: Optional[Dict[str, Any]] = None  # Manual content if use_ai is False

class PrivacyPolicyRequest(BaseModel):
    company_info: Dict[str, Any]  # Company details, data collection practices, etc.
    use_ai: bool = True  # Whether to use AI for content generation
    content_structure: Optional[Dict[str, Any]] = None  # Manual content if use_ai is False

class LegalDocumentResponse(BaseModel):
    filename: str
    file_type: str
    status: str
    ai_generated: bool = False
    message: Optional[str] = None

@router.post("/create-nda")
async def create_nda(request: NDARequest):
    """
    Generate a Non-Disclosure Agreement (NDA) document with AI-powered content generation
    
    Expected parties_info structure:
    {
        "company_name": "Your Company",
        "company_address": "Company address",
        "other_party_name": "Individual/Company name", 
        "other_party_address": "Other party address",
        "purpose": "Purpose of disclosure",
        "duration": "Duration of agreement",
        "effective_date": "Agreement effective date"
    }
    
    Set use_ai=True (default) to automatically generate professional legal content,
    or use_ai=False to provide manual content_structure.
    """
    try:
        logger.info(f"Creating {'AI-generated' if request.use_ai else 'manual'} NDA for: {request.parties_info.get('company_name', 'Unknown')}")
        
        # Add content_structure to parties_info if provided manually
        if not request.use_ai and request.content_structure:
            request.parties_info['content_structure'] = request.content_structure
        
        result = await legal_service.generate_nda(
            parties_info=request.parties_info,
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
        logger.error(f"Error creating NDA: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating NDA: {str(e)}")

@router.post("/create-cda")
async def create_cda(request: CDARequest):
    """
    Generate a Confidentiality Disclosure Agreement (CDA) document with AI-powered content generation
    CDA is essentially the same as NDA with different terminology
    
    Expected parties_info structure:
    {
        "company_name": "Your Company",
        "company_address": "Company address",
        "other_party_name": "Individual/Company name", 
        "other_party_address": "Other party address",
        "purpose": "Purpose of disclosure",
        "duration": "Duration of agreement",
        "effective_date": "Agreement effective date"
    }
    
    Set use_ai=True (default) to automatically generate professional legal content,
    or use_ai=False to provide manual content_structure.
    """
    try:
        logger.info(f"Creating {'AI-generated' if request.use_ai else 'manual'} CDA for: {request.parties_info.get('company_name', 'Unknown')}")
        
        # Add content_structure to parties_info if provided manually
        if not request.use_ai and request.content_structure:
            request.parties_info['content_structure'] = request.content_structure
        
        result = await legal_service.generate_cda(
            parties_info=request.parties_info,
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
        logger.error(f"Error creating CDA: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating CDA: {str(e)}")

@router.post("/create-employment-agreement")
async def create_employment_agreement(request: EmploymentAgreementRequest):
    """
    Generate an Employment Agreement document with AI-powered content generation
    
    Expected employment_info structure:
    {
        "company_name": "Your Company",
        "employee_name": "Employee Name",
        "position": "Job Title",
        "department": "Department",
        "salary": "Annual salary",
        "start_date": "Employment start date",
        "employment_type": "Full-time/Part-time/Contract",
        "benefits": "Benefits description",
        "location": "Work location"
    }
    
    Set use_ai=True (default) to automatically generate professional legal content,
    or use_ai=False to provide manual content_structure.
    """
    try:
        logger.info(f"Creating {'AI-generated' if request.use_ai else 'manual'} employment agreement for: {request.employment_info.get('employee_name', 'Unknown')}")
        
        # Add content_structure to employment_info if provided manually
        if not request.use_ai and request.content_structure:
            request.employment_info['content_structure'] = request.content_structure
        
        result = await legal_service.generate_employment_agreement(
            employment_info=request.employment_info,
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
        logger.error(f"Error creating employment agreement: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating employment agreement: {str(e)}")

@router.post("/create-founder-agreement")
async def create_founder_agreement(request: FounderAgreementRequest):
    """
    Generate a Founder Agreement document with AI-powered content generation
    
    Expected founders_info structure:
    {
        "company_name": "Your Company",
        "founders": "Founder names and details",
        "equity_split": "Equity distribution details",
        "roles": "Roles and responsibilities",
        "vesting_schedule": "Equity vesting schedule",
        "initial_investment": "Initial investment details"
    }
    
    Set use_ai=True (default) to automatically generate professional legal content,
    or use_ai=False to provide manual content_structure.
    """
    try:
        logger.info(f"Creating {'AI-generated' if request.use_ai else 'manual'} founder agreement for: {request.founders_info.get('company_name', 'Unknown')}")
        
        # Add content_structure to founders_info if provided manually
        if not request.use_ai and request.content_structure:
            request.founders_info['content_structure'] = request.content_structure
        
        result = await legal_service.generate_founder_agreement(
            founders_info=request.founders_info,
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
        logger.error(f"Error creating founder agreement: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating founder agreement: {str(e)}")

@router.post("/create-terms-of-service")
async def create_terms_of_service(request: TermsOfServiceRequest):
    """
    Generate a Terms of Service document with AI-powered content generation
    
    Expected company_info structure:
    {
        "company_name": "Your Company",
        "website_url": "https://yourcompany.com",
        "contact_email": "contact@yourcompany.com",
        "service_description": "Description of your services",
        "governing_law": "State/Country of governing law",
        "effective_date": "Terms effective date"
    }
    
    Set use_ai=True (default) to automatically generate professional legal content,
    or use_ai=False to provide manual content_structure.
    """
    try:
        logger.info(f"Creating {'AI-generated' if request.use_ai else 'manual'} Terms of Service for: {request.company_info.get('company_name', 'Unknown')}")
        
        # Add content_structure to company_info if provided manually
        if not request.use_ai and request.content_structure:
            request.company_info['content_structure'] = request.content_structure
        
        result = await legal_service.generate_terms_of_service(
            company_info=request.company_info,
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
        logger.error(f"Error creating Terms of Service: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating Terms of Service: {str(e)}")

@router.post("/create-privacy-policy")
async def create_privacy_policy(request: PrivacyPolicyRequest):
    """
    Generate a Privacy Policy document with AI-powered content generation
    
    Expected company_info structure:
    {
        "company_name": "Your Company",
        "website_url": "https://yourcompany.com",
        "contact_email": "privacy@yourcompany.com",
        "data_collection": "Types of data collected",
        "data_usage": "How data is used",
        "data_sharing": "Data sharing practices",
        "governing_law": "State/Country of governing law",
        "effective_date": "Policy effective date"
    }
    
    Set use_ai=True (default) to automatically generate professional legal content,
    or use_ai=False to provide manual content_structure.
    """
    try:
        logger.info(f"Creating {'AI-generated' if request.use_ai else 'manual'} Privacy Policy for: {request.company_info.get('company_name', 'Unknown')}")
        
        # Add content_structure to company_info if provided manually
        if not request.use_ai and request.content_structure:
            request.company_info['content_structure'] = request.content_structure
        
        result = await legal_service.generate_privacy_policy(
            company_info=request.company_info,
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
        logger.error(f"Error creating Privacy Policy: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating Privacy Policy: {str(e)}")

@router.get("/templates")
async def get_legal_templates():
    """
    Get available legal document templates and their required information
    All templates now support AI-powered content generation
    """
    return {
        "nda": {
            "name": "Non-Disclosure Agreement",
            "description": "Protect confidential information shared between parties (AI-Generated)",
            "ai_supported": True,
            "required_fields": [
                "company_name", "company_address", "other_party_name", 
                "other_party_address", "purpose", "duration", "effective_date"
            ]
        },
        "cda": {
            "name": "Confidentiality Disclosure Agreement",
            "description": "Similar to NDA, with different terminology (AI-Generated)",
            "ai_supported": True,
            "required_fields": [
                "company_name", "company_address", "other_party_name", 
                "other_party_address", "purpose", "duration", "effective_date"
            ]
        },
        "employment": {
            "name": "Employment Agreement", 
            "description": "Define terms of employment for new hires (AI-Generated)",
            "ai_supported": True,
            "required_fields": [
                "company_name", "employee_name", "position", "department",
                "salary", "start_date", "employment_type", "benefits", "location"
            ]
        },
        "founder": {
            "name": "Founder Agreement",
            "description": "Define relationships and equity among co-founders (AI-Generated)", 
            "ai_supported": True,
            "required_fields": [
                "company_name", "founders", "equity_split", "roles",
                "vesting_schedule", "initial_investment"
            ]
        },
        "terms_of_service": {
            "name": "Terms of Service",
            "description": "Define the terms and conditions for using your service (AI-Generated)",
            "ai_supported": True,
            "required_fields": [
                "company_name", "service_description", "user_obligations", 
                "limitation_of_liability", "governing_law", "effective_date"
            ]
        },
        "privacy_policy": {
            "name": "Privacy Policy",
            "description": "Inform users about data collection and usage (AI-Generated)",
            "ai_supported": True,
            "required_fields": [
                "company_name", "data_collection_practices", "user_rights", 
                "data_security_measures", "effective_date"
            ]
        }
    }

@router.post("/preview-content")
async def preview_legal_content(document_type: str, parties_info: Dict[str, Any]):
    """
    Preview AI-generated content for legal documents without creating the PDF
    
    document_type: 'nda', 'cda', 'employment', 'founder', 'terms_of_service', or 'privacy_policy'
    parties_info: Same structure as the respective create endpoints
    """
    try:
        logger.info(f"Previewing AI content for {document_type}")
        
        # Import here to avoid circular imports
        from services.content_generator import ContentGeneratorService
        content_generator = ContentGeneratorService()
        
        content_structure = await content_generator.generate_legal_document_content(
            document_type, parties_info
        )
        
        return {
            "document_type": document_type,
            "content_structure": content_structure,
            "status": "success",
            "message": "Content generated successfully. Use this content structure to create the document."
        }
        
    except Exception as e:
        logger.error(f"Error previewing {document_type} content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error previewing content: {str(e)}")