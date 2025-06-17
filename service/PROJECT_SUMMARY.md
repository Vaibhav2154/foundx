# FoundX GenAI Service - Project Summary

## Overview

Successfully restructured the FoundX service following the civiceye_api architecture pattern and implemented a comprehensive GenAI service with the following capabilities:

## Implemented Features

### 1. FastAPI Service Structure
- Main application (`app.py`) with proper middleware and routing
- Modular router structure (`routers/chatbot.py`)
- Service layer (`services/chatbot_rag.py`) implementing RAG pipeline
- Utility modules (`utils/file_utils.py`) for document processing

### 2. Required API Endpoints

#### `/api/v1/ask` (Q&A for startups)
- Accepts questions with optional context and startup type
- Uses RAG to provide intelligent responses
- Returns answers with sources and confidence scores

#### `/api/v1/explain` (Clause explanations)
- Explains legal and business clauses in simple terms
- Supports different detail levels (basic, medium, detailed)
- Handles various document types

#### `/api/v1/generate-doc` (Document generation)
- Generates startup documents (business plans, pitch decks, legal docs)
- Uses templates and parameters for customization
- Supports multiple document types

### 3. RAG Pipeline Implementation
- Knowledge base initialization with FoundX PRD
- Document processing for PDFs, Word docs, and text files
- Context retrieval based on question analysis
- Integration with Google Gemini AI for response generation

### 4. Additional Features
- Health check endpoints
- Knowledge base management (status, refresh)
- File validation and processing utilities
- Docker configuration for deployment
- Comprehensive testing structure

## Project Structure

```
service/
├── app.py                      # Main FastAPI application
├── requirements.txt            # Dependencies
├── Dockerfile                  # Docker configuration
├── start.bat                   # Windows startup script
├── config.py                   # Settings management
├── test_app.py                 # Test suite
├── .env.example               # Environment template
├── FoundX-2.pdf              # PRD document
├── routers/
│   ├── __init__.py
│   └── chatbot.py             # API routes
├── services/
│   ├── __init__.py
│   └── chatbot_rag.py         # RAG service
└── utils/
    ├── __init__.py
    └── file_utils.py           # File utilities
```

## Key Technologies Used

- **FastAPI**: Modern web framework for APIs
- **Google Gemini AI**: Large language model for text generation
- **RAG Architecture**: Retrieval-Augmented Generation for knowledge-based responses
- **PyPDF2**: PDF document processing
- **python-docx**: Word document processing
- **Pydantic**: Data validation and settings management
- **Docker**: Containerization for deployment

## Setup Instructions

1. **Set up environment:**
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure API key:**
   - Copy `.env.example` to `.env`
   - Set your Gemini API key: `GEMINI_API_KEY=your_key_here`

3. **Run the service:**
   ```cmd
   start.bat
   ```
   Or manually:
   ```cmd
   uvicorn app:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Access the API:**
   - API Documentation: http://localhost:8000/docs
   - Service Status: http://localhost:8000/health

## Usage Examples

### Ask a Question
```python
import requests

response = requests.post("http://localhost:8000/api/v1/ask", json={
    "question": "How do I validate my startup idea?",
    "startup_type": "tech"
})
print(response.json()["answer"])
```

### Explain a Clause
```python
response = requests.post("http://localhost:8000/api/v1/explain", json={
    "clause": "liquidation preference clause",
    "document_type": "legal",
    "detail_level": "medium"
})
print(response.json()["answer"])
```

### Generate a Document
```python
response = requests.post("http://localhost:8000/api/v1/generate-doc", json={
    "doc_type": "business_plan",
    "parameters": {
        "company_name": "MyStartup",
        "industry": "FinTech"
    }
})
print(response.json()["answer"])
```

## Next Steps

1. **Get Gemini API Key**: Sign up at Google AI Studio and obtain your API key
2. **Test the Service**: Use the provided test suite or API documentation
3. **Customize Knowledge Base**: Add more documents to enhance the RAG pipeline
4. **Deploy**: Use Docker for easy deployment to production
5. **Frontend Integration**: Connect with your Next.js frontend

## Security Considerations

- Keep API keys secure (use environment variables)
- Configure CORS properly for production
- Implement rate limiting for production use
- Add authentication if needed
- Validate file uploads properly

## Performance Optimization

- Implement caching for frequently asked questions
- Use vector databases for better document retrieval
- Add request queuing for high load scenarios
- Monitor and log API usage

The service is now ready for development and testing. Make sure to set up your Gemini API key and you'll have a fully functional AI-powered startup assistance platform!
