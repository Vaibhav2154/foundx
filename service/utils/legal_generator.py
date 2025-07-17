"""
This class needs to be created to handle legal document generation
"""

from typing import Dict, Any, Optional
import logging
import base64
import os
from pathlib import Path
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image

logger = logging.getLogger(__name__)

class LegalDocumentGenerator:
    """
    Generates legal documents in PDF format with improved structure and optional logo
    """
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=1,  # Center alignment
            fontName='Helvetica-Bold'
        )
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        self.subheading_style = ParagraphStyle(
            'CustomSubHeading',
            parent=self.styles['Heading3'],
            fontSize=12,
            spaceAfter=8,
            spaceBefore=8,
            fontName='Helvetica-Bold'
        )
        self.date_style = ParagraphStyle(
            'DateStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceBefore=10,
            spaceAfter=20,
            alignment=2  # Right alignment
        )
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceBefore=6,
            spaceAfter=6,
            fontName='Helvetica'
        )
        
        self.logo_dir = Path("generated_docs/logos")
        self.logo_dir.mkdir(parents=True, exist_ok=True)
    
    def _process_logo(self, logo_data: str) -> Optional[str]:
        """Process base64 encoded logo and save to temp file"""
        if not logo_data:
            return None
            
        try:
            if logo_data.startswith('data:image'):
                _, logo_data = logo_data.split(',', 1)
                
            logo_bytes = base64.b64decode(logo_data)
            
            os.makedirs(self.logo_dir, exist_ok=True)
            
            filename = f"logo_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
            logo_path = self.logo_dir / filename
            
            with open(logo_path, 'wb') as f:
                f.write(logo_bytes)
            
            if not os.path.exists(logo_path):
                logger.error(f"Logo file was not created at {logo_path}")
                return None
                
            return str(logo_path)
        except Exception as e:
            logger.error(f"Error processing logo: {str(e)}")
            return None
    
    def _add_document_header(self, story, content_structure: Dict[str, Any], doc_title: str, logo_path: Optional[str] = None):
        """Add document header with optional logo, title and generation date"""

        if logo_path:
            try:
                logger.info(f"Attempting to add logo from path: {logo_path}")
                if not os.path.exists(logo_path):
                    logger.warning(f"Logo file does not exist at path: {logo_path}")

                else:
                    img = Image(logo_path, width=2*inch, height=1*inch)
                    img.hAlign = 'CENTER'
                    story.append(img)
                    story.append(Spacer(1, 12))
            except Exception as e:
                logger.error(f"Error adding logo to document: {str(e)}")
        
        story.append(Paragraph(doc_title, self.title_style))
        
        if content_structure.get('document_date'):
            date_text = f"Generated on: {content_structure.get('document_date')}"
            story.append(Paragraph(date_text, self.date_style))
        
        story.append(Spacer(1, 20))
    
    def create_nda(self, content_structure: Dict[str, Any], output_path: str, logo_data: Optional[str] = None) -> str:
        """Generate NDA/CDA PDF document with improved structure and optional logo"""
        doc_title = content_structure.get('document_title', 'NON-DISCLOSURE AGREEMENT')
        return self._create_formatted_document(
            content_structure=content_structure,
            output_path=output_path,
            title=doc_title,
            logo_data=logo_data
        )
    
    def create_cda(self, content_structure: Dict[str, Any], output_path: str, logo_data: Optional[str] = None) -> str:
        """Generate CDA (Confidentiality Disclosure Agreement) - alias for NDA with optional logo"""
        # CDA is essentially the same as NDA, just different naming
        content_structure['document_title'] = 'CONFIDENTIALITY DISCLOSURE AGREEMENT'
        return self.create_nda(content_structure, output_path, logo_data)
    
    def create_employment_agreement(self, content_structure: Dict[str, Any], output_path: str, logo_data: Optional[str] = None) -> str:
        """Generate Employment Agreement PDF document with improved structure and optional logo"""
        return self._create_formatted_document(
            content_structure=content_structure,
            output_path=output_path,
            title="EMPLOYMENT AGREEMENT",
            logo_data=logo_data
        )
    
    def create_founder_agreement(self, content_structure: Dict[str, Any], output_path: str, logo_data: Optional[str] = None) -> str:
        """Generate Founder Agreement PDF document with improved structure and optional logo"""
        return self._create_formatted_document(
            content_structure=content_structure,
            output_path=output_path,
            title="FOUNDER AGREEMENT",
            logo_data=logo_data
        )

    def create_terms_of_service(self, content_structure: Dict[str, Any], output_path: str, logo_data: Optional[str] = None) -> str:
        """Generate Terms of Service PDF document with improved structure and optional logo"""
        return self._create_formatted_document(
            content_structure=content_structure,
            output_path=output_path,
            title="TERMS OF SERVICE",
            logo_data=logo_data
        )

    def create_privacy_policy(self, content_structure: Dict[str, Any], output_path: str, logo_data: Optional[str] = None) -> str:
        """Generate Privacy Policy PDF document with improved structure and optional logo"""
        return self._create_formatted_document(
            content_structure=content_structure,
            output_path=output_path,
            title="PRIVACY POLICY",
            logo_data=logo_data
        )

    def _create_formatted_document(self, content_structure: Dict[str, Any], output_path: str, 
                                   title: str, logo_data: Optional[str] = None) -> str:
        """Template method for creating consistently formatted documents with optional logo"""
        try:
            output_dir = os.path.dirname(output_path)
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)
                
            doc = SimpleDocTemplate(output_path, pagesize=letter, topMargin=0.75*inch)
            story = []
            
            logo_path = None
            if logo_data:
                try:
                    logo_path = self._process_logo(logo_data)
                    if logo_path:
                        logger.info(f"Logo processed successfully: {logo_path}")
                except Exception as e:
                    logger.error(f"Error processing logo: {str(e)}")
            
            self._add_document_header(story, content_structure, title, logo_path)
            
            for section_key, section_content in content_structure.items():
                if isinstance(section_content, dict) and section_key not in ['document_date', 'document_datetime', 'generation_timestamp']:
                    if 'title' in section_content:
                        story.append(Spacer(1, 10))
                        story.append(Paragraph(section_content['title'], self.heading_style))
                    
                    if 'content' in section_content:
                        paragraphs = section_content['content'].split('\n\n')
                        for paragraph in paragraphs:
                            if paragraph.strip():
                                story.append(Paragraph(paragraph, self.normal_style))
                        story.append(Spacer(1, 12))
                    
                    if 'subsections' in section_content and isinstance(section_content['subsections'], list):
                        for subsection in section_content['subsections']:
                            if isinstance(subsection, dict):
                                if 'title' in subsection:
                                    story.append(Paragraph(subsection['title'], self.subheading_style))
                                if 'content' in subsection:
                                    story.append(Paragraph(subsection['content'], self.normal_style))
                                    story.append(Spacer(1, 8))
            
            doc.build(story)
            
            if logo_path:
                try:
                    if os.path.exists(logo_path):
                        os.remove(logo_path)
                        logger.info(f"Removed temporary logo file: {logo_path}")
                    else:
                        logger.warning(f"Could not find temporary logo file to delete: {logo_path}")
                except Exception as e:
                    logger.warning(f"Could not delete temporary logo file: {str(e)}")
            
            return output_path
            
        except Exception as e:
            logger.error(f"Error creating document: {str(e)}")
            raise