import google.generativeai as genai
from typing import List, Dict, Any, Optional
import os
import logging
import json
from datetime import datetime
from pathlib import Path
from pydantic import BaseModel
import base64
from config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BillItem(BaseModel):
    """Individual item in a bill"""
    description: str
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    total_price: Optional[float] = None
    category: Optional[str] = None

class BillParseResponse(BaseModel):
    """Response model for bill parsing"""
    vendor_name: Optional[str] = None
    vendor_address: Optional[str] = None
    vendor_contact: Optional[str] = None
    bill_number: Optional[str] = None
    bill_date: Optional[str] = None
    due_date: Optional[str] = None
    subtotal: Optional[float] = None
    tax_amount: Optional[float] = None
    tax_rate: Optional[float] = None
    discount: Optional[float] = None
    total_amount: Optional[float] = None
    currency: Optional[str] = "USD"
    payment_terms: Optional[str] = None
    items: List[BillItem] = []
    confidence: float = 0.0
    extracted_text: Optional[str] = None
    bill_type: Optional[str] = None

class BinaryContent:
    """Binary content container for images/PDFs"""
    def __init__(self, data: bytes, media_type: str = 'image/png'):
        self.data = data
        self.media_type = media_type

class Agent:
    """AI Agent for processing bills similar to your OCR implementation"""
    def __init__(self, model, output_type, headers=None, system_prompt: str = ""):
        self.model = model
        self.output_type = output_type
        self.headers = headers or {}
        self.system_prompt = system_prompt

    async def run(self, inputs: List):
        """Run the agent with inputs"""
        try:
            text_inputs = []
            image_parts = []
            
            for input_item in inputs:
                if isinstance(input_item, str):
                    text_inputs.append(input_item)
                elif isinstance(input_item, BinaryContent):
                    # Convert binary content to base64 for Gemini
                    image_data = base64.b64encode(input_item.data).decode('utf-8')
                    image_parts.append({
                        'mime_type': input_item.media_type,
                        'data': image_data
                    })
            
            combined_prompt = f"{self.system_prompt}\n\n" + "\n".join(text_inputs)
            
            content_parts = [combined_prompt]
            
            for image_part in image_parts:
                content_parts.append({
                    'mime_type': image_part['mime_type'],
                    'data': image_part['data']
                })
            
            response = await self.model.generate_content_async(content_parts)
            
            if not response.text:
                raise Exception("Empty response from AI model")
            
            if self.output_type == List[BillParseResponse]:
                try:
                    response_text = response.text.strip()
                    if response_text.startswith('```json'):
                        response_text = response_text[7:]
                    if response_text.startswith('```'):
                        response_text = response_text[3:]
                    if response_text.endswith('```'):
                        response_text = response_text[:-3]
                    
                    parsed_data = json.loads(response_text)
                    
                    if isinstance(parsed_data, list):
                        bills = [BillParseResponse(**bill) for bill in parsed_data]
                    else:
                        bills = [BillParseResponse(**parsed_data)]
                    
                    return type('AgentResult', (), {'output': bills})()
                except json.JSONDecodeError as e:
                    logger.error(f"Error parsing JSON response: {e}")
                    fallback_response = BillParseResponse(
                        extracted_text=response.text,
                        confidence=0.3
                    )
                    return type('AgentResult', (), {'output': [fallback_response]})()
            
            return type('AgentResult', (), {'output': response.text})()
            
        except Exception as e:
            logger.error(f"Error in agent run: {e}")
            raise

class BillParserService:
    """
    Service for parsing bills and invoices from images and PDF files using AI
    """
    
    def __init__(self):
        self.setup_gemini()
        self.headers = {
            'User-Agent': 'FoundX-BillParser/1.0'
        }
    
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
            logger.info("Gemini AI configured successfully for bill parsing")
        except Exception as e:
            logger.error(f"Error configuring Gemini AI: {str(e)}")
            self.model = None

    async def parse_bills_from_images(self, images: List[bytes], bill_type: str = "auto") -> List[BillParseResponse]:
        """
        Parse bills from images using AI similar to your OCR implementation
        """
        if not self.model:
            raise Exception("Gemini AI is not configured. Please check your API key.")
        
        agent = Agent(
            model=self.model,
            output_type=List[BillParseResponse],
            headers=self.headers,
            system_prompt=(
                'You are an expert bill and invoice parser that extracts structured data from images. '
                'Your output MUST be 100% valid JSON format containing bill/invoice information. '
                
                'BILL PARSING RULES: '
                '1. Analyze the entire image carefully, including handwritten text, stamps, and logos '
                '2. For unclear handwriting or poor quality text, use context clues or mark as null '
                '3. Extract all relevant financial information with high accuracy '
                '4. Identify the type of document (invoice, receipt, estimate, bill, etc.) '
                '5. Parse line items with quantities, prices, and descriptions '
                
                'DATA EXTRACTION REQUIREMENTS: '
                '- Vendor information: name, address, contact details '
                '- Bill details: number, date, due date, payment terms '
                '- Financial data: subtotal, tax, discount, total amount, currency '
                '- Line items: description, quantity, unit price, total price, category '
                '- Additional notes or terms and conditions '
                
                'JSON OUTPUT STRUCTURE: '
                '- vendor_name: string (company/business name) '
                '- vendor_address: string (full address) '
                '- vendor_contact: string (phone, email, website) '
                '- bill_number: string (invoice/bill number) '
                '- bill_date: string (date format: YYYY-MM-DD or as appears) '
                '- due_date: string (payment due date) '
                '- subtotal: float (amount before tax) '
                '- tax_amount: float (tax amount) '
                '- tax_rate: float (tax percentage like 10.5 for 10.5%) '
                '- discount: float (discount amount if any) '
                '- total_amount: float (final total amount) '
                '- currency: string (currency code like USD, EUR, INR) '
                '- payment_terms: string (payment terms/conditions) '
                '- items: array of objects with description, quantity, unit_price, total_price, category '
                '- confidence: float (0.0-1.0 based on text clarity and extraction accuracy) '
                '- extracted_text: string (raw text extracted for reference) '
                '- bill_type: string (invoice, receipt, estimate, bill, etc.) '
                
                'ACCURACY AND CONFIDENCE SCORING: '
                '- 0.9-1.0: Clear, well-structured bill with all information easily readable '
                '- 0.7-0.9: Good quality with minor unclear elements '
                '- 0.5-0.7: Moderate quality with some handwritten or unclear sections '
                '- 0.3-0.5: Poor quality but basic information extractable '
                '- 0.0-0.3: Very poor quality, minimal information extracted '
                
                'SPECIAL HANDLING: '
                '- For multiple pages, treat as single bill unless clearly separate bills '
                '- Handle different currencies and formats (US, EU, Asian formats) '
                '- Parse taxes correctly (VAT, GST, Sales Tax, etc.) '
                '- Extract item categories when possible (materials, services, products) '
                '- Handle discounts, shipping charges, and other fees '
                
                'OUTPUT REQUIREMENTS: '
                '- Return valid JSON only, no markdown formatting '
                '- Use null for missing or unclear information '
                '- Ensure all numeric values are proper numbers (not strings) '
                '- Group related line items logically '
                '- Provide confidence score based on overall extraction quality '
                
                'CRITICAL: Your response must be valid JSON that can be parsed programmatically. '
                'Test your JSON structure mentally before responding.'
            )
        )

        binary_images = [
            BinaryContent(data=image, media_type='image/png') for image in images
        ]
        
        parsing_instruction = (
            'Extract all bill/invoice information from each image and format into valid JSON. '
            f'Expected bill type: {bill_type}. '
            'SPECIAL ATTENTION: If the image contains handwritten text, poor quality scans, '
            'or complex layouts, carefully analyze the entire image, use context clues for '
            'unclear writing, and organize the data logically. Parse all line items, '
            'financial totals, dates, and vendor information accurately. '
            'Provide confidence level based on text clarity and extraction completeness.'
        )
        
        try:
            result = await agent.run([
                parsing_instruction,
                *binary_images
            ])
            return result.output
        except Exception as e:
            logger.error(f"Error parsing bills from images: {e}")
            return [BillParseResponse(
                extracted_text=f"Error parsing bill: {str(e)}",
                confidence=0.0,
                bill_type="unknown"
            )]

    async def parse_bills_from_pdf(self, pdf_bytes: bytes, bill_type: str = "auto") -> List[BillParseResponse]:
        """
        Parse bills from PDF files
        """
        try:
            return await self.parse_bills_from_images([pdf_bytes], bill_type)
        except Exception as e:
            logger.error(f"Error parsing PDF bill: {e}")
            return [BillParseResponse(
                extracted_text=f"Error parsing PDF: {str(e)}",
                confidence=0.0,
                bill_type="unknown"
            )]

    async def parse_bill_from_file(self, file_path: str, bill_type: str = "auto") -> List[BillParseResponse]:
        """
        Parse bill from file path (supports images and PDFs)
        """
        try:
            file_path = Path(file_path)
            if not file_path.exists():
                raise FileNotFoundError(f"File not found: {file_path}")
            
            with open(file_path, 'rb') as f:
                file_bytes = f.read()
            
            file_extension = file_path.suffix.lower()
            if file_extension in ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff']:
                return await self.parse_bills_from_images([file_bytes], bill_type)
            elif file_extension == '.pdf':
                return await self.parse_bills_from_pdf(file_bytes, bill_type)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
                
        except Exception as e:
            logger.error(f"Error parsing bill from file: {e}")
            return [BillParseResponse(
                extracted_text=f"Error parsing file: {str(e)}",
                confidence=0.0,
                bill_type="unknown"
            )]

    def validate_bill_data(self, bill: BillParseResponse) -> Dict[str, Any]:
        """
        Validate and clean bill data
        """
        validation_result = {
            "is_valid": True,
            "errors": [],
            "warnings": []
        }
        
        if not bill.vendor_name:
            validation_result["errors"].append("Vendor name is missing")
            validation_result["is_valid"] = False
        
        if not bill.total_amount:
            validation_result["errors"].append("Total amount is missing")
            validation_result["is_valid"] = False
        
        if bill.subtotal and bill.total_amount and bill.tax_amount:
            calculated_total = bill.subtotal + bill.tax_amount
            if bill.discount:
                calculated_total -= bill.discount
            
            if abs(calculated_total - bill.total_amount) > 0.01:  # Allow for rounding
                validation_result["warnings"].append("Total amount doesn't match calculated total")
        
        if bill.bill_date:
            try:
                datetime.strptime(bill.bill_date, '%Y-%m-%d')
            except ValueError:
                validation_result["warnings"].append("Bill date format may be incorrect")
        
        return validation_result

    async def extract_text_only(self, images: List[bytes]) -> List[str]:
        """
        Extract plain text from images without structured parsing
        """
        if not self.model:
            raise Exception("Gemini AI is not configured. Please check your API key.")
        
        agent = Agent(
            model=self.model,
            output_type=str,
            headers=self.headers,
            system_prompt=(
                'You are an OCR system that extracts all text from images. '
                'Extract all visible text exactly as it appears in the image, '
                'including handwritten text, printed text, numbers, and any other readable content. '
                'Maintain the original layout and structure as much as possible. '
                'For unclear text, provide your best interpretation or mark as [unclear].'
            )
        )

        binary_images = [
            BinaryContent(data=image, media_type='image/png') for image in images
        ]
        
        try:
            result = await agent.run([
                'Extract all text from the provided images.',
                *binary_images
            ])
            return [result.output] if isinstance(result.output, str) else result.output
        except Exception as e:
            logger.error(f"Error extracting text: {e}")
            return [f"Error extracting text: {str(e)}"]

    def get_supported_formats(self) -> List[str]:
        """
        Get list of supported file formats
        """
        return ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.pdf']

    def is_ai_configured(self) -> bool:
        """
        Check if AI service is properly configured
        """
        return self.model is not None
