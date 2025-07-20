# FoundX GenAI Service

A comprehensive FastAPI-based AI service for startup assistance, providing intelligent Q&A, clause explanations, document generation, and market research using Google's Gemini AI with RAG (Retrieval-Augmented Generation) capabilities.

## Features

- **Q&A for Startups**: Intelligent question-answering system for startup-related queries
- **Clause Explanations**: Legal and business clause explanations in simple terms
- **Document Generation**: AI-powered generation of business documents
- **Market Research**: Comprehensive market analysis using real-time data and AI insights
- **RAG Pipeline**: Retrieval-Augmented Generation using company knowledge base
- **RESTful API**: Clean, documented API endpoints
- **Docker Support**: Easy deployment with Docker

## Project Structure

```
service/
├── app.py                      # Main FastAPI application
├── requirements.txt            # Project dependencies
├── Dockerfile                  # Docker configuration
├── start.bat                   # Windows startup script
├── .env.example               # Environment variables template
├── FoundX-2.pdf              # Product Requirements Document
├── routers/
│   ├── __init__.py
│   └── chatbot.py             # API route definitions
├── services/
│   ├── __init__.py
│   └── chatbot_rag.py         # RAG service logic
└── utils/
    ├── __init__.py
    └── file_utils.py           # Utility functions for file handling
```

## API Endpoints

### 1. Ask Question
**POST** `/api/v1/ask`

Ask startup-related questions and get intelligent AI responses.

```json
{
  "question": "How do I validate my startup idea?",
  "context": "I'm building a SaaS platform",
  "startup_type": "tech"
}
```

### 2. Explain Clause
**POST** `/api/v1/explain`

Get explanations for legal and business clauses.

```json
{
  "clause": "liquidation preference clause",
  "document_type": "legal",
  "detail_level": "medium"
}
```

### 3. Generate Document
**POST** `/api/v1/generate-doc`

Generate startup documents using AI.

```json
{
  "doc_type": "business_plan",
  "template": "tech_startup",
  "parameters": {
    "company_name": "MyStartup",
    "industry": "FinTech"
  }
}
```

### 4. Knowledge Base Status
**GET** `/api/v1/knowledge-base/status`

Get the current status of the knowledge base.

### 5. Refresh Knowledge Base
**POST** `/api/v1/knowledge-base/refresh`

Refresh the knowledge base with latest documents.

## Installation & Setup

### Prerequisites

- Python 3.11+
- Google Gemini API key

### Quick Start (Windows)

1. Clone the repository
2. Navigate to the service directory
3. Copy `.env.example` to `.env` and set your Gemini API key
4. Run the startup script:

```cmd
start.bat
```

### Manual Setup

1. **Create virtual environment:**
```cmd
python -m venv venv
venv\Scripts\activate
```

2. **Install dependencies:**
```cmd
pip install -r requirements.txt
```

3. **Set environment variables:**
```cmd
set GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run the application:**
```cmd
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Docker Setup

1. **Build the image:**
```cmd
docker build -t foundx-genai .
```

2. **Run the container:**
```cmd
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key_here foundx-genai
```

## Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `DEBUG`: Debug mode (default: True)
- `MAX_FILE_SIZE_MB`: Maximum file upload size (default: 50)
- `ALLOWED_FILE_TYPES`: Allowed file extensions (default: .pdf,.docx,.txt)

### Knowledge Base

The service uses a RAG approach with a knowledge base that includes:
- FoundX Product Requirements Document (FoundX-2.pdf)
- Startup fundamentals and best practices
- Legal clauses and terms
- Funding and investment information

## API Documentation

Once the service is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Usage Examples

### Python Client Example

```python
import requests

# Ask a question
response = requests.post("http://localhost:8000/api/v1/ask", json={
    "question": "What are the key steps to validate a startup idea?",
    "startup_type": "tech"
})

print(response.json()["answer"])
```

### cURL Example

```bash
curl -X POST "http://localhost:8000/api/v1/ask" \
     -H "Content-Type: application/json" \
     -d '{"question": "How do I protect my intellectual property?"}'
```

## Development

### Adding New Features

1. **New API endpoints**: Add to `routers/chatbot.py`
2. **Business logic**: Implement in `services/chatbot_rag.py`
3. **Utilities**: Add to `utils/` directory

### Testing

```cmd
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Deployment

### Production Considerations

- Set up proper environment variables
- Configure CORS for your frontend domain
- Use a production WSGI server like Gunicorn
- Set up logging and monitoring
- Secure your API keys

### Health Checks

The service provides health check endpoints:
- `/`: Basic status
- `/health`: Detailed health information

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure you're in the service directory and virtual environment is activated
2. **Gemini API errors**: Check your API key and internet connection
3. **PDF processing errors**: Ensure PyPDF2 is properly installed
4. **Port conflicts**: Change the port in environment variables

### Logs

Check the application logs for detailed error information. Set `LOG_LEVEL=DEBUG` for more verbose logging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.
