const API_BASE_URL = process.env.NEXT_PUBLIC_SERVICE_URL;

export interface MarketResearchRequest {
  market_query: string;
  location?: string;
  include_news?: boolean;
  include_images?: boolean;
}

export interface CompetitorAnalysisRequest {
  company_name: string;
  industry: string;
  location?: string;
}

export interface TrendAnalysisRequest {
  industry: string;
  time_period?: string;
  location?: string;
}

export interface MarketResearchResponse {
  success: boolean;
  data?: {
    query: string;
    location: string;
    timestamp: number;
    raw_data: {
      search_results: any;
      news_results: any;
      image_results: any;
    };
    analysis?: {
      market_overview: string;
      key_insights: string[];
      market_size: string;
      competitors: string[];
      trends: string[];
      opportunities: string[];
      challenges: string[];
      recommendations: string[];
    };
    competitor_analysis?: {
      market_overview: string;
      key_insights: string[];
      market_size: string;
      competitors: string[];
      trends: string[];
      opportunities: string[];
      challenges: string[];
      recommendations: string[];
    };
    trend_analysis?: {
      market_overview: string;
      key_insights: string[];
      market_size: string;
      competitors: string[];
      trends: string[];
      opportunities: string[];
      challenges: string[];
      recommendations: string[];
    };
    metadata: {
      search_results_count: number;
      news_results_count: number;
      image_results_count: number;
    };
  };
  error?: string;
  query: string;
  location: string;
}

export interface QuickSearchParams {
  query: string;
  location?: string;
  search_type?: 'search' | 'news' | 'images';
}

class MarketResearchService {
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
      console.error('Market Research API request failed:', error);
      throw error;
    }
  }

  async comprehensiveResearch(request: MarketResearchRequest): Promise<MarketResearchResponse> {
    try {
      return await this.makeRequest<MarketResearchResponse>('/market-research/comprehensive', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Comprehensive market research failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to perform market research'
      );
    }
  }

  async competitorAnalysis(request: CompetitorAnalysisRequest): Promise<MarketResearchResponse> {
    try {
      return await this.makeRequest<MarketResearchResponse>('/market-research/competitor-analysis', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Competitor analysis failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to perform competitor analysis'
      );
    }
  }

  async trendAnalysis(request: TrendAnalysisRequest): Promise<MarketResearchResponse> {
    try {
      return await this.makeRequest<MarketResearchResponse>('/market-research/trend-analysis', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Trend analysis failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to perform trend analysis'
      );
    }
  }

  async quickSearch(params: QuickSearchParams): Promise<any> {
    try {
      const queryParams = new URLSearchParams({
        query: params.query,
        location: params.location || 'us',
        search_type: params.search_type || 'search'
      });

      return await this.makeRequest<any>(`/market-research/quick-search?${queryParams}`, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Quick search failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to perform quick search'
      );
    }
  }

  async healthCheck(): Promise<any> {
    try {
      return await this.makeRequest<any>('/market-research/health', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Market research health check failed:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Health check failed'
      );
    }
  }

  getMarketResearchTemplates() {
    return {
      industries: [
        'Technology & Software',
        'Healthcare & Pharmaceuticals',
        'Financial Services',
        'E-commerce & Retail',
        'Manufacturing',
        'Education & EdTech',
        'Food & Beverage',
        'Real Estate',
        'Transportation & Logistics',
        'Energy & Utilities',
        'Media & Entertainment',
        'Automotive',
        'Agriculture',
        'Fashion & Apparel',
        'Tourism & Hospitality'
      ],
      researchTypes: [
        {
          type: 'comprehensive',
          title: 'Comprehensive Market Research',
          description: 'Full market analysis including competitors, trends, and opportunities',
          suitable_for: 'New market entry, business planning'
        },
        {
          type: 'competitor',
          title: 'Competitor Analysis',
          description: 'Detailed analysis of competitors and competitive landscape',
          suitable_for: 'Competitive strategy, positioning'
        },
        {
          type: 'trend',
          title: 'Trend Analysis',
          description: 'Industry trends, future predictions, and emerging opportunities',
          suitable_for: 'Strategic planning, innovation roadmap'
        }
      ],
      locations: [
        { code: 'us', name: 'United States' },
        { code: 'gb', name: 'United Kingdom' },
        { code: 'ca', name: 'Canada' },
        { code: 'au', name: 'Australia' },
        { code: 'de', name: 'Germany' },
        { code: 'fr', name: 'France' },
        { code: 'jp', name: 'Japan' },
        { code: 'in', name: 'India' },
        { code: 'br', name: 'Brazil' },
        { code: 'mx', name: 'Mexico' }
      ],
      sampleQueries: {
        comprehensive: [
          'AI-powered chatbot market',
          'Sustainable fashion industry',
          'Electric vehicle charging infrastructure',
          'Telemedicine and remote healthcare',
          'Plant-based food alternatives'
        ],
        competitor: [
          'Tesla competitors in electric vehicles',
          'Shopify vs WooCommerce e-commerce platforms',
          'Netflix streaming service competitors',
          'Zoom vs Microsoft Teams video conferencing',
          'Airbnb vacation rental competitors'
        ],
        trend: [
          'Artificial Intelligence trends 2025',
          'Sustainable technology innovations',
          'Remote work technology trends',
          'Digital health and wellness trends',
          'Green energy and renewable resources'
        ]
      }
    };
  }

  formatResearchData(data: MarketResearchResponse['data']) {
    if (!data) return null;

    let analysis: any;
    let metadata: any;

    if (data.analysis) {
      analysis = data.analysis;
      metadata = data.metadata;
    } else if (data.competitor_analysis) {
      analysis = data.competitor_analysis;
      metadata = data.metadata || {};
    } else if (data.trend_analysis) {
      analysis = data.trend_analysis;
      metadata = data.metadata || {};
    } else {
      console.warn('Unknown data format:', data);
      return null;
    }

    if (!analysis) return null;

    const ensureStringArray = (arr: any[]): string[] => {
      if (!Array.isArray(arr)) return [];
      return arr.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          if (item.category && item.list) {
            if (Array.isArray(item.list)) {
              return `${item.category}: ${item.list.join(', ')}`;
            }
            return `${item.category}: ${item.list}`;
          }
          return JSON.stringify(item);
        }
        return String(item);
      });
    };

    return {
      overview: analysis.market_overview || 'No overview available',
      insights: ensureStringArray(analysis.key_insights),
      marketSize: analysis.market_size || 'Data not available',
      competitors: ensureStringArray(analysis.competitors),
      trends: ensureStringArray(analysis.trends),
      opportunities: ensureStringArray(analysis.opportunities),
      challenges: ensureStringArray(analysis.challenges),
      recommendations: ensureStringArray(analysis.recommendations),
      stats: {
        searchResults: metadata?.search_results_count || 0,
        newsResults: metadata?.news_results_count || 0,
        imageResults: metadata?.image_results_count || 0
      },
      lastUpdated: data.timestamp ? new Date(data.timestamp * 1000).toLocaleDateString() : 'Unknown'
    };
  }

  exportData(data: MarketResearchResponse['data'], format: 'json' | 'csv' | 'pdf' = 'json') {
    if (!data) return null;

    const formattedData = this.formatResearchData(data);
    
    switch (format) {
      case 'json':
        return JSON.stringify(formattedData, null, 2);
      
      case 'csv':
        const csvData = [
          ['Section', 'Content'],
          ['Query', data.query],
          ['Location', data.location],
          ['Market Overview', formattedData?.overview || ''],
          ...formattedData?.insights?.map((insight, i) => [`Key Insight ${i + 1}`, insight]) || [],
          ...formattedData?.trends?.map((trend, i) => [`Trend ${i + 1}`, trend]) || [],
          ...formattedData?.opportunities?.map((opp, i) => [`Opportunity ${i + 1}`, opp]) || [],
          ...formattedData?.recommendations?.map((rec, i) => [`Recommendation ${i + 1}`, rec]) || []
        ];
        return csvData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      
      case 'pdf':
        return {
          title: `Market Research Report: ${data.query}`,
          subtitle: `Location: ${data.location} | Date: ${new Date().toLocaleDateString()}`,
          sections: [
            { title: 'Executive Summary', content: formattedData?.overview },
            { title: 'Key Insights', content: formattedData?.insights?.join('\n\n') },
            { title: 'Market Trends', content: formattedData?.trends?.join('\n\n') },
            { title: 'Opportunities', content: formattedData?.opportunities?.join('\n\n') },
            { title: 'Challenges', content: formattedData?.challenges?.join('\n\n') },
            { title: 'Recommendations', content: formattedData?.recommendations?.join('\n\n') }
          ]
        };
      
      default:
        return formattedData;
    }
  }
}

export const marketResearchService = new MarketResearchService();
export default marketResearchService;
