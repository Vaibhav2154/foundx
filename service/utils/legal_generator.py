"""
This class needs to be created to handle legal document generation
"""

from typing import Dict, Any
import logging
from pathlib import Path
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
import json

logger = logging.getLogger(__name__)

class LegalDocumentGenerator:
    """
    Generates legal documents in PDF format
    """
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=12,
            spaceAfter=12,
            spaceBefore=12
        )
        self.date_style = ParagraphStyle(
            'DateStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceBefore=10,
            spaceAfter=20,
            alignment=2  # Right alignment
        )
    
    def _add_document_header(self, story, content_structure: Dict[str, Any], doc_title: str):
        """Add document header with title and generation date"""
        # Add title
        story.append(Paragraph(doc_title, self.title_style))
        
        # Add generation date if available
        if content_structure.get('document_date'):
            date_text = f"Generated on: {content_structure.get('document_date')}"
            story.append(Paragraph(date_text, self.date_style))
        
        story.append(Spacer(1, 20))
    
    def create_nda(self, content_structure: Dict[str, Any], output_path: str) -> str:
        """Generate NDA/CDA PDF document"""
        try:
            doc = SimpleDocTemplate(output_path, pagesize=letter)
            story = []
            
            # Title - support both NDA and CDA
            doc_title = content_structure.get('document_title', 'NON-DISCLOSURE AGREEMENT')
            self._add_document_header(story, content_structure, doc_title)
            
            # Add content from structure
            for section_key, section_content in content_structure.items():
                if isinstance(section_content, dict) and section_key not in ['document_date', 'document_datetime', 'generation_timestamp']:
                    if 'title' in section_content:
                        story.append(Paragraph(section_content['title'], self.heading_style))
                    if 'content' in section_content:
                        story.append(Paragraph(section_content['content'], self.styles['Normal']))
                        story.append(Spacer(1, 12))
            
            doc.build(story)
            return output_path
            
        except Exception as e:
            logger.error(f"Error creating NDA/CDA: {str(e)}")
            raise
    
    def create_cda(self, content_structure: Dict[str, Any], output_path: str) -> str:
        """Generate CDA (Confidentiality Disclosure Agreement) - alias for NDA"""
        # CDA is essentially the same as NDA, just different naming
        content_structure['document_title'] = 'CONFIDENTIALITY DISCLOSURE AGREEMENT'
        return self.create_nda(content_structure, output_path)
    
    def create_employment_agreement(self, content_structure: Dict[str, Any], output_path: str) -> str:
        """Generate Employment Agreement PDF document"""
        try:
            doc = SimpleDocTemplate(output_path, pagesize=letter)
            story = []
            
            # Title
            self._add_document_header(story, content_structure, "EMPLOYMENT AGREEMENT")
            
            # Add content from structure
            for section_key, section_content in content_structure.items():
                if isinstance(section_content, dict) and section_key not in ['document_date', 'document_datetime', 'generation_timestamp']:
                    if 'title' in section_content:
                        story.append(Paragraph(section_content['title'], self.heading_style))
                    if 'content' in section_content:
                        story.append(Paragraph(section_content['content'], self.styles['Normal']))
                        story.append(Spacer(1, 12))
            
            doc.build(story)
            return output_path
            
        except Exception as e:
            logger.error(f"Error creating employment agreement: {str(e)}")
            raise
    
    def create_founder_agreement(self, content_structure: Dict[str, Any], output_path: str) -> str:
        """Generate Founder Agreement PDF document"""
        try:
            doc = SimpleDocTemplate(output_path, pagesize=letter)
            story = []
            
            # Title  
            self._add_document_header(story, content_structure, "FOUNDER AGREEMENT")
            
            # Add content from structure
            for section_key, section_content in content_structure.items():
                if isinstance(section_content, dict) and section_key not in ['document_date', 'document_datetime', 'generation_timestamp']:
                    if 'title' in section_content:
                        story.append(Paragraph(section_content['title'], self.heading_style))
                    if 'content' in section_content:
                        story.append(Paragraph(section_content['content'], self.styles['Normal']))
                        story.append(Spacer(1, 12))
            
            doc.build(story)
            return output_path
            
        except Exception as e:
            logger.error(f"Error creating founder agreement: {str(e)}")
            raise

    def create_terms_of_service(self, content_structure: Dict[str, Any], output_path: str) -> str:
        """Generate Terms of Service PDF document"""
        try:
            doc = SimpleDocTemplate(output_path, pagesize=letter)
            story = []
            
            # Title  
            self._add_document_header(story, content_structure, "TERMS OF SERVICE")
            
            # Add content from structure
            for section_key, section_content in content_structure.items():
                if isinstance(section_content, dict) and section_key not in ['document_date', 'document_datetime', 'generation_timestamp']:
                    if 'title' in section_content:
                        story.append(Paragraph(section_content['title'], self.heading_style))
                    if 'content' in section_content:
                        story.append(Paragraph(section_content['content'], self.styles['Normal']))
                        story.append(Spacer(1, 12))
            
            doc.build(story)
            return output_path
            
        except Exception as e:
            logger.error(f"Error creating Terms of Service: {str(e)}")
            raise

    def create_privacy_policy(self, content_structure: Dict[str, Any], output_path: str) -> str:
        """Generate Privacy Policy PDF document"""
        try:
            doc = SimpleDocTemplate(output_path, pagesize=letter)
            story = []
            
            # Title  
            self._add_document_header(story, content_structure, "PRIVACY POLICY")
            
            # Add content from structure
            for section_key, section_content in content_structure.items():
                if isinstance(section_content, dict) and section_key not in ['document_date', 'document_datetime', 'generation_timestamp']:
                    if 'title' in section_content:
                        story.append(Paragraph(section_content['title'], self.heading_style))
                    if 'content' in section_content:
                        story.append(Paragraph(section_content['content'], self.styles['Normal']))
                        story.append(Spacer(1, 12))
            
            doc.build(story)
            return output_path
            
        except Exception as e:
            logger.error(f"Error creating Privacy Policy: {str(e)}")
            raise