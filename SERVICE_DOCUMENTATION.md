# FoundX AI Service Documentation

## 🤖 What is the AI Service?

The AI Service is the "intelligent brain" of FoundX - it's a specialized Python-based service that provides artificial intelligence capabilities to help entrepreneurs build their startups. Think of it as having a knowledgeable business consultant and legal advisor available 24/7 to answer questions and generate professional documents.

## 🛠️ Technology Stack (The Tools We Use)

### **FastAPI** - The Web Framework

- **What it is**: A modern, fast web framework for building APIs with Python
- **Why we use it**: Provides automatic documentation, fast performance, and easy integration
- **Think of it as**: The communication hub that handles requests from the frontend

### **Google Gemini AI 2.5-Flash** - The AI Brain

- **What it is**: Google's advanced large language model for generating human-like text
- **Why we use it**: Provides intelligent, context-aware responses and content generation
- **Think of it as**: A super-smart assistant that understands business and legal concepts

### **Python 3.12** - The Programming Language

- **What it is**: A powerful, easy-to-read programming language
- **Why we use it**: Perfect for AI/ML applications and rapid development
- **Think of it as**: The language our AI service speaks

### **ChromaDB** - Vector Database

- **What it is**: A database designed for storing and searching through AI embeddings
- **Why we use it**: Enables advanced search and retrieval of relevant information
- **Think of it as**: A super-powered search engine for startup knowledge

### **RAG (Retrieval-Augmented Generation)** - AI Enhancement

- **What it is**: A technique that combines AI generation with knowledge base search
- **Why we use it**: Provides more accurate, relevant responses based on actual data
- **Think of it as**: Giving the AI access to a specialized library of startup knowledge

## 📁 Project Structure

```
service/
├── app.py                          # Main FastAPI application entry point
├── config.py                       # Configuration and settings
├── requirements.txt                # Python dependencies
├── Dockerfile                      # Container deployment configuration
├── start.bat                       # Windows startup script
├── routers/                        # API endpoint definitions
│   ├── __init__.py                    # Router package initialization
│   ├── chatbot.py                     # Q&A and content generation endpoints
│   └── legal.py                       # Legal document generation endpoints
├── services/                       # Core business logic
│   ├── __init__.py                    # Services package initialization
│   ├── chatbot_rag.py                 # RAG-powered Q&A service
│   ├── content_generator.py           # AI content generation service
│   ├── content_generator_fixed.py     # Enhanced content generator
│   └── legal_service.py               # Legal document processing
├── utils/                          # Helper functions and utilities
│   ├── file_utils.py                  # File handling operations
│   └── legal_generator.py             # Legal document formatting
├── knowledge_base/                 # Startup and business knowledge
├── generated_docs/                 # Output folder for created documents
│   ├── legal/                         # Generated legal documents
│   └── presentations/                 # Generated pitch decks
└── __pycache__/                   # Python compiled files (auto-generated)
```

## 🌟 Key Features

### **Intelligent Q&A System**

- **Purpose**: Answer startup-related questions with AI
- **How it works**: Uses RAG to search knowledge base and generate accurate responses
- **Examples**: "How do I validate my startup idea?", "What legal documents do I need?"

### **Legal Document Generation**

- **Document Types**:
  - **NDAs (Non-Disclosure Agreements)**: Protect confidential information
  - **CDAs (Confidentiality Disclosure Agreements)**: Similar to NDAs
  - **Employment Agreements**: Contracts for hiring employees
  - **Founder Agreements**: Agreements between startup co-founders
  - **Terms of Service**: Legal terms for using your product/service
  - **Privacy Policies**: How you handle user data

### **Pitch Deck Content Generation**

- **What it creates**: Complete pitch deck content for investor presentations
- **Sections included**:
  - Title slide with company branding
  - Problem statement and market need
  - Solution and value proposition
  - Market opportunity and size
  - Business model and revenue streams
  - Competition analysis
  - Team introduction
  - Financial projections
  - Funding requirements
  - Contact information

### **RAG-Powered Knowledge Base**

- **Knowledge Sources**: Startup guides, legal templates, business frameworks
- **Search Capability**: Find relevant information instantly
- **Context Awareness**: Understands your specific startup context

## 🔗 API Endpoints

### **Chatbot Services** (`/api/v1`)

#### **Ask Questions** - `POST /ask`

- **Purpose**: Get AI-powered answers to startup questions
- **Input**: Question, context, startup type
- **Output**: Intelligent, contextual response

```json
{
  "question": "How do I validate my startup idea?",
  "context": "I'm building a SaaS platform for small businesses",
  "startup_type": "tech"
}
```

#### **Explain Clauses** - `POST /explain`

- **Purpose**: Get simple explanations of complex business/legal terms
- **Input**: Clause text, context
- **Output**: Easy-to-understand explanation

#### **Generate Content** - `POST /generate-content`

- **Purpose**: Create pitch deck content automatically
- **Input**: Business information (name, industry, description, etc.)
- **Output**: Complete pitch deck structure with professional content

### **Legal Document Services** (`/api/v1/legal`)

#### **Create NDA** - `POST /create-nda`

- **Purpose**: Generate Non-Disclosure Agreements
- **Input**: Company details, receiving party info, purpose
- **Output**: Professional NDA document

#### **Create Employment Agreement** - `POST /create-employment-agreement`

- **Purpose**: Generate employment contracts
- **Input**: Company details, employee info, position, salary
- **Output**: Complete employment agreement

#### **Create Founder Agreement** - `POST /create-founder-agreement`

- **Purpose**: Generate agreements between co-founders
- **Input**: Company details, founder information, equity distribution
- **Output**: Comprehensive founder agreement

#### **Create Terms of Service** - `POST /create-terms-of-service`

- **Purpose**: Generate terms of service for websites/apps
- **Input**: Company details, service description
- **Output**: Legal terms of service document

#### **Create Privacy Policy** - `POST /create-privacy-policy`

- **Purpose**: Generate privacy policies
- **Input**: Company details, data collection practices
- **Output**: Compliant privacy policy document

## 🧠 How the AI Works

### **Content Generation Process**

1. **Receive Request**: User asks question or requests document
2. **Context Analysis**: AI understands the specific context and requirements
3. **Knowledge Retrieval**: RAG searches relevant information from knowledge base
4. **AI Generation**: Gemini AI creates intelligent, customized response
5. **Quality Check**: Response is validated and formatted
6. **Return Result**: Professional output delivered to user

### **RAG (Retrieval-Augmented Generation)**

1. **Knowledge Storage**: Business and legal knowledge stored in vector database
2. **Query Processing**: User question converted to searchable format
3. **Relevance Search**: Find most relevant information from knowledge base
4. **Context Combination**: Merge user question with relevant knowledge
5. **AI Response**: Generate answer using both question and retrieved context

### **Document Generation**

1. **Template Selection**: Choose appropriate document template
2. **Information Extraction**: Pull relevant details from user input
3. **AI Customization**: Use AI to customize template with user's specific information
4. **Legal Compliance**: Ensure generated documents follow legal standards
5. **Format Output**: Create professional PDF document

## 🛡️ Security and Quality Features

### **API Security**

- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Ensure all inputs are safe and properly formatted
- **Error Handling**: Graceful handling of errors and edge cases

### **AI Quality Control**

- **Response Validation**: Check AI responses for quality and relevance
- **Fallback Content**: Provide backup responses if AI generation fails
- **Content Filtering**: Ensure generated content is appropriate and professional

### **Document Security**

- **Temporary Storage**: Generated documents are temporarily stored
- **Access Control**: Only authorized users can access their documents
- **Data Privacy**: Personal information is handled securely

## 📊 Service Configuration

### **Environment Variables**

- **GEMINI_API_KEY**: API key for Google Gemini AI
- **DATABASE_URL**: Connection to vector database
- **CORS_ORIGINS**: Allowed frontend domains
- **LOG_LEVEL**: Logging configuration

### **AI Model Settings**

- **Model**: gemini-2.5-flash (optimized for speed and quality)
- **Temperature**: Controlled for consistent, professional output
- **Token Limits**: Optimized for comprehensive responses

## 🚀 Performance Features

### **Fast Response Times**

- **Async Processing**: Handle multiple requests simultaneously
- **Efficient AI Calls**: Optimized prompts for quick responses
- **Caching**: Store frequently requested information

### **Scalability**

- **Docker Support**: Easy deployment and scaling
- **Stateless Design**: Can handle multiple users simultaneously
- **Resource Optimization**: Efficient use of AI and computing resources

## 🔄 Integration Flow

### **With Frontend**

1. User interacts with frontend interface
2. Frontend sends request to AI service
3. AI service processes request with Gemini AI
4. Response sent back to frontend
5. User sees intelligent, helpful result

### **With Backend**

1. AI service receives user context from backend
2. Personalizes responses based on user's startup information
3. Can trigger backend actions (save documents, update user data)

## 💡 Benefits for Users

### **For Entrepreneurs**

- **24/7 Expert Advice**: Get startup guidance anytime
- **Professional Documents**: Generate legal documents without lawyers
- **Time Saving**: Instant content creation and advice
- **Cost Effective**: Reduce consulting and legal fees

### **For Startups**

- **Faster Launch**: Accelerate business setup process
- **Professional Presentation**: High-quality pitch decks and documents
- **Legal Compliance**: Properly formatted legal documents
- **Informed Decisions**: Access to relevant business knowledge

### **For Teams**

- **Consistent Guidance**: Same high-quality advice for all team members
- **Document Standards**: Professional, consistent document formatting
- **Knowledge Sharing**: Access to comprehensive startup knowledge base

## 🎯 Use Cases

### **New Entrepreneurs**

- Ask basic questions about starting a business
- Generate initial legal documents
- Create first pitch deck
- Understand legal and business terminology

### **Growing Startups**

- Get advice on scaling challenges
- Generate employment contracts for new hires
- Create updated pitch decks for funding rounds
- Handle complex legal document needs

### **Experienced Founders**

- Quick document generation for efficiency
- Validate business decisions with AI insights
- Generate standardized agreements quickly
- Access specialized knowledge on demand

This AI service transforms FoundX into an intelligent platform that provides expert-level guidance and document generation, making professional startup development accessible to entrepreneurs at any level of experience.
