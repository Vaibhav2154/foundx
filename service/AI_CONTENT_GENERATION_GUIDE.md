# AI-Powered Content Generation Examples

This document shows how to use the new AI-powered content generation features for creating presentations and legal documents.

## Overview

The system now uses Google Gemini AI to automatically generate professional content for:
- **Legal Documents**: NDAs, CDAs, Employment Agreements, Founder Agreements
- **Presentations**: Pitch Decks, Business Plan Presentations

## Features

1. **AI Content Generation**: Automatically creates professional, tailored content
2. **Manual Override**: Option to provide your own content structure
3. **Content Preview**: Preview generated content before creating documents
4. **Fallback Support**: Graceful fallback if AI generation fails

## API Endpoints

### Legal Documents

#### 1. Create NDA with AI
```bash
POST /api/legal/create-nda
Content-Type: application/json

{
    "parties_info": {
        "company_name": "TechStartup Inc",
        "company_address": "123 Innovation Drive, San Francisco, CA 94107",
        "other_party_name": "John Smith",
        "other_party_address": "456 Business Ave, New York, NY 10001",
        "purpose": "Evaluation of potential business partnership",
        "duration": "2 years",
        "effective_date": "2025-06-18"
    },
    "use_ai": true
}
```

#### 2. Create Employment Agreement with AI
```bash
POST /api/legal/create-employment-agreement
Content-Type: application/json

{
    "employment_info": {
        "company_name": "TechStartup Inc",
        "employee_name": "Jane Doe",
        "position": "Senior Software Engineer",
        "department": "Engineering",
        "salary": "$120,000",
        "start_date": "2025-07-01",
        "employment_type": "Full-time",
        "benefits": "Health insurance, 401k, equity options",
        "location": "San Francisco, CA"
    },
    "use_ai": true
}
```

#### 3. Preview Legal Content
```bash
POST /api/legal/preview-content?document_type=nda
Content-Type: application/json

{
    "company_name": "TechStartup Inc",
    "other_party_name": "John Smith",
    "purpose": "Evaluation of potential business partnership"
}
```

### Presentations

#### 1. Create Pitch Deck with AI
```bash
POST /api/presentations/create-pitch-deck
Content-Type: application/json

{
    "business_info": {
        "company_name": "AI Solutions Inc",
        "industry": "Artificial Intelligence",
        "description": "We develop AI-powered automation tools for small businesses",
        "target_market": "Small to medium businesses looking to automate workflows",
        "business_model": "SaaS subscription with tiered pricing",
        "funding_amount": "$2M Series A",
        "team_size": "8 people",
        "stage": "Seed",
        "key_features": "AI workflow automation, drag-and-drop interface, integrations",
        "competitive_advantage": "First-to-market AI solution specifically for SMBs"
    },
    "use_ai": true
}
```

#### 2. Preview Presentation Content
```bash
POST /api/presentations/preview-content
Content-Type: application/json

{
    "company_name": "AI Solutions Inc",
    "industry": "Artificial Intelligence",
    "description": "We develop AI-powered automation tools for small businesses"
}
```

## Manual Content Structure (Fallback)

If you prefer to provide your own content or if AI generation fails, you can set `use_ai: false` and provide a `content_structure`:

### Legal Document Structure Example
```json
{
    "use_ai": false,
    "content_structure": {
        "document_title": "NON-DISCLOSURE AGREEMENT",
        "introduction": {
            "title": "Introduction and Parties",
            "content": "This agreement is between..."
        },
        "definitions": {
            "title": "Definition of Confidential Information",
            "content": "Confidential Information includes..."
        }
    }
}
```

### Presentation Structure Example
```json
{
    "use_ai": false,
    "content_structure": {
        "title": {
            "company_name": "Your Company",
            "tagline": "Your tagline",
            "founders": "Founder names"
        },
        "problem": {
            "title": "Problem",
            "main_problem": "Problem description",
            "pain_points": ["Point 1", "Point 2"]
        }
    }
}
```

## Response Format

All endpoints return either:
- **File Download**: Direct file download for document creation
- **JSON Response**: For preview endpoints with generated content structure

### Success Response Example
```json
{
    "filename": "pitch_deck_ai_solutions_inc.pptx",
    "file_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "status": "success",
    "ai_generated": true
}
```

## Configuration

Make sure your `.env` file contains the Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Error Handling

The system includes comprehensive error handling:
- If AI generation fails, it falls back to basic templates
- Missing API keys are handled gracefully
- Detailed error messages for debugging

## Tips for Best Results

1. **Provide detailed business information**: The more context you provide, the better the AI-generated content
2. **Use specific industry terms**: Help the AI understand your domain
3. **Include metrics when available**: Numbers make presentations more compelling
4. **Review generated content**: Always review before using in important situations

## Template Information

Get available templates and their requirements:
```bash
GET /api/legal/templates
GET /api/presentations/templates
```

This returns information about supported document types, required fields, and AI capabilities.
