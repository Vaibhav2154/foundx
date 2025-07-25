const API_BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;

export interface ChatMessage {
  question: string;
  context?: string;
  startup_type?: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
  confidence?: number;
}

export interface LegalDocumentRequest {
  parties_info?: any;
  employment_info?: any;
  founders_info?: any;
  company_info?: any;
  use_ai?: boolean;
  content_structure?: any;
  company_logo?: string;  // Base64 encoded logo image
}

export interface LegalDocumentResponse {
  filename: string;
  file_type: string;
  status: string;
  ai_generated: boolean;
  message?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async askQuestion(request: ChatMessage): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/ask', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async explainClause(clause: string, documentType?: string): Promise<ChatResponse> {
    return this.makeRequest<ChatResponse>('/explain', {
      method: 'POST',
      body: JSON.stringify({
        clause,
        document_type: documentType || 'legal',
        detail_level: 'medium'
      }),
    });
  }

  async createNDA(request: LegalDocumentRequest): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/legal/create-nda`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  }

  async createFounderAgreement(request: LegalDocumentRequest): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/legal/create-founder-agreement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  }

  async createEmploymentContract(request: LegalDocumentRequest): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/legal/create-employment-agreement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  }

  async createCDA(request: LegalDocumentRequest): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/legal/create-cda`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  }

  async createTermsOfService(request: LegalDocumentRequest): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/legal/create-terms-of-service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  }

  async createPrivacyPolicy(request: LegalDocumentRequest): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/legal/create-privacy-policy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  }

  // File download method
  async downloadDocument(filename: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/legal/download/${filename}`);
    if (!response.ok) {
      throw new Error(`Download failed! status: ${response.status}`);
    }
    return await response.blob();
  }

  // Health check
  async healthCheck(): Promise<{ status: string; version: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  }
}

export const apiService = new ApiService();
export default apiService;
