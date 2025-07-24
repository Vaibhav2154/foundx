from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
import logging
from pydantic import BaseModel

from services.bill_parser_service import BillParserService, BillParseResponse

logger = logging.getLogger(__name__)

bill_parser = BillParserService()

router = APIRouter(prefix="/api/v1/bill-parser", tags=["Bill Parser"])

class BillParseRequest(BaseModel):
    """Request model for bill parsing from base64 images"""
    images: List[str]  # Base64 encoded images
    bill_type: Optional[str] = "auto"
    extract_text_only: Optional[bool] = False

class BillParseFromUrlRequest(BaseModel):
    """Request model for parsing bills from URLs"""
    image_urls: List[str]
    bill_type: Optional[str] = "auto"

class BillValidationResponse(BaseModel):
    """Response model for bill validation"""
    is_valid: bool
    errors: List[str]
    warnings: List[str]

@router.post("/parse-from-images", response_model=List[BillParseResponse])
async def parse_bills_from_images(request: BillParseRequest):
    """
    Parse bills from base64 encoded images
    
    **Bill Types:**
    - auto: Automatically detect bill type
    - invoice: Commercial invoice
    - receipt: Purchase receipt
    - estimate: Price estimate/quote
    - bill: Utility bill or service bill
    
    **Returns:** List of parsed bill data with structured information
    """
    try:
        if not bill_parser.is_ai_configured():
            raise HTTPException(status_code=503, detail="AI service is not configured. Please check API key.")
        
        if not request.images:
            raise HTTPException(status_code=400, detail="No images provided")
        
        import base64
        decoded_images = []
        for i, img_b64 in enumerate(request.images):
            try:
                if ',' in img_b64:
                    img_b64 = img_b64.split(',')[1]
                
                img_bytes = base64.b64decode(img_b64)
                decoded_images.append(img_bytes)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid base64 image at index {i}: {str(e)}")
        
        if request.extract_text_only:
            extracted_texts = await bill_parser.extract_text_only(decoded_images)
            return [BillParseResponse(extracted_text=text, confidence=0.8) for text in extracted_texts]
        
        results = await bill_parser.parse_bills_from_images(decoded_images, request.bill_type)
        
        logger.info(f"Parsed {len(results)} bills from {len(request.images)} images")
        return results
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error parsing bills from images: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/parse-from-files")
async def parse_bills_from_files(
    files: List[UploadFile] = File(...),
    bill_type: str = Form("auto"),
    extract_text_only: bool = Form(False)
):
    """
    Parse bills from uploaded image/PDF files
    
    **Supported formats:** JPG, JPEG, PNG, BMP, GIF, TIFF, PDF
    
    **Returns:** List of parsed bill data with structured information
    """
    try:
        if not bill_parser.is_ai_configured():
            raise HTTPException(status_code=503, detail="AI service is not configured. Please check API key.")
        
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded")
        
        supported_formats = bill_parser.get_supported_formats()
        file_data = []
        
        for file in files:
            if not any(file.filename.lower().endswith(fmt) for fmt in supported_formats):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Unsupported file format: {file.filename}. Supported: {', '.join(supported_formats)}"
                )
            
            content = await file.read()
            file_data.append(content)
        
        if extract_text_only:
            extracted_texts = await bill_parser.extract_text_only(file_data)
            return {
                "results": [{"extracted_text": text, "confidence": 0.8} for text in extracted_texts],
                "total_files_processed": len(files)
            }
        
        all_results = []
        for i, file_bytes in enumerate(file_data):
            if files[i].filename.lower().endswith('.pdf'):
                results = await bill_parser.parse_bills_from_pdf(file_bytes, bill_type)
            else:
                results = await bill_parser.parse_bills_from_images([file_bytes], bill_type)
            all_results.extend(results)
        
        logger.info(f"Parsed {len(all_results)} bills from {len(files)} files")
        return {
            "results": all_results,
            "total_files_processed": len(files),
            "total_bills_found": len(all_results)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error parsing bills from files: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/validate-bill", response_model=BillValidationResponse)
async def validate_bill(bill: BillParseResponse):
    """
    Validate parsed bill data for accuracy and completeness
    
    **Returns:** Validation results with errors and warnings
    """
    try:
        validation_result = bill_parser.validate_bill_data(bill)
        return BillValidationResponse(**validation_result)
        
    except Exception as e:
        logger.error(f"Error validating bill: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Validation error: {str(e)}")

@router.get("/supported-formats")
async def get_supported_formats():
    """
    Get list of supported file formats for bill parsing
    """
    return {
        "supported_formats": bill_parser.get_supported_formats(),
        "description": "Supported image and document formats for bill parsing"
    }

@router.get("/health")
async def health_check():
    """
    Check the health and configuration status of the bill parser service
    """
    return {
        "status": "healthy" if bill_parser.is_ai_configured() else "unhealthy",
        "ai_configured": bill_parser.is_ai_configured(),
        "supported_formats": bill_parser.get_supported_formats(),
        "service": "Bill Parser Service",
        "version": "1.0.0"
    }

@router.post("/parse-from-file-path")
async def parse_bill_from_path(
    file_path: str = Query(..., description="Path to the bill file"),
    bill_type: str = Query("auto", description="Type of bill to parse")
):
    """
    Parse bill from file system path (for internal use)
    
    **Note:** This endpoint is for internal server use only
    """
    try:
        if not bill_parser.is_ai_configured():
            raise HTTPException(status_code=503, detail="AI service is not configured. Please check API key.")
        
        results = await bill_parser.parse_bill_from_file(file_path, bill_type)
        
        logger.info(f"Parsed bill from file: {file_path}")
        return {
            "results": results,
            "file_path": file_path,
            "total_bills_found": len(results)
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error parsing bill from file path: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/example-response")
async def get_example_response():
    """
    Get example response structure for bill parsing
    """
    return {
        "example_response": {
            "vendor_name": "ABC Electronics Store",
            "vendor_address": "123 Main St, Cityville, CA 90210",
            "vendor_contact": "phone: (555) 123-4567, email: info@abcelectronics.com",
            "bill_number": "INV-2025-001234",
            "bill_date": "2025-07-20",
            "due_date": "2025-08-20",
            "subtotal": 1250.00,
            "tax_amount": 125.00,
            "tax_rate": 10.0,
            "discount": 50.00,
            "total_amount": 1325.00,
            "currency": "USD",
            "payment_terms": "Net 30 days",
            "items": [
                {
                    "description": "Laptop Computer - Model XYZ123",
                    "quantity": 1.0,
                    "unit_price": 1000.00,
                    "total_price": 1000.00,
                    "category": "Electronics"
                },
                {
                    "description": "Wireless Mouse",
                    "quantity": 2.0,
                    "unit_price": 125.00,
                    "total_price": 250.00,
                    "category": "Accessories"
                }
            ],
            "confidence": 0.95,
            "extracted_text": "ABC Electronics Store\\n123 Main St...\\n[full extracted text]",
            "bill_type": "invoice"
        },
        "validation_example": {
            "is_valid": True,
            "errors": [],
            "warnings": ["Bill date format may be incorrect"]
        }
    }
