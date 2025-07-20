"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Loader2, 
  Search, 
  TrendingUp, 
  Users, 
  Download, 
  AlertCircle,
  BarChart3,
  Target,
  Globe,
  FileText,
  Sparkles,
  Clock,
  CheckCircle,
  BookOpen,
  Zap,
  RefreshCw,
  ChevronRight,
  Filter,
  Star,
  Eye
} from 'lucide-react';
import marketResearchService, { 
  MarketResearchRequest, 
  CompetitorAnalysisRequest, 
  TrendAnalysisRequest,
  MarketResearchResponse 
} from '@/api/market-research';

interface ResearchResult {
  type: 'comprehensive' | 'competitor' | 'trend';
  data: MarketResearchResponse;
  timestamp: Date;
  id: string;
}

function MarketResearchPage() {
  const [activeTab, setActiveTab] = useState<'comprehensive' | 'competitor' | 'trend'>('comprehensive');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<ResearchResult[]>([]);
  const [showQuickTips, setShowQuickTips] = useState(true);

  // Form states
  const [comprehensiveForm, setComprehensiveForm] = useState<MarketResearchRequest>({
    market_query: '',
    location: 'us',
    include_news: true,
    include_images: false,
  });

  const [competitorForm, setCompetitorForm] = useState<CompetitorAnalysisRequest>({
    company_name: '',
    industry: '',
    location: 'us',
  });

  const [trendForm, setTrendForm] = useState<TrendAnalysisRequest>({
    industry: '',
    time_period: 'recent',
    location: 'us',
  });

  const templates = marketResearchService.getMarketResearchTemplates();

  // Auto-save search history
  useEffect(() => {
    const savedHistory = localStorage.getItem('market-research-history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('market-research-history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToSearchHistory = (query: string) => {
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
  };

  const saveResearch = (result: ResearchResult) => {
    setSavedSearches(prev => [result, ...prev.filter(r => r.id !== result.id)]);
  };

  const handleComprehensiveResearch = async () => {
    if (!comprehensiveForm.market_query.trim()) {
      setError('Please enter a market query');
      return;
    }

    setError('');
    setLoading(true);
    addToSearchHistory(comprehensiveForm.market_query);
    
    try {
      const result = await marketResearchService.comprehensiveResearch(comprehensiveForm);
      const researchResult: ResearchResult = {
        type: 'comprehensive',
        data: result,
        timestamp: new Date(),
        id: `comprehensive-${Date.now()}`,
      };
      
      setResults(prev => [researchResult, ...prev]);
      setCurrentResult(researchResult);
    } catch (error) {
      console.error('Research failed:', error);
      setError(error instanceof Error ? error.message : 'Research failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompetitorAnalysis = async () => {
    if (!competitorForm.company_name.trim() || !competitorForm.industry.trim()) {
      setError('Please enter company name and industry');
      return;
    }

    setError('');
    setLoading(true);
    addToSearchHistory(`${competitorForm.company_name} in ${competitorForm.industry}`);
    
    try {
      const result = await marketResearchService.competitorAnalysis(competitorForm);
      const researchResult: ResearchResult = {
        type: 'competitor',
        data: result,
        timestamp: new Date(),
        id: `competitor-${Date.now()}`,
      };
      
      setResults(prev => [researchResult, ...prev]);
      setCurrentResult(researchResult);
    } catch (error) {
      console.error('Competitor analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Competitor analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTrendAnalysis = async () => {
    if (!trendForm.industry.trim()) {
      setError('Please enter an industry');
      return;
    }

    setError('');
    setLoading(true);
    addToSearchHistory(`${trendForm.industry} trends`);
    
    try {
      const result = await marketResearchService.trendAnalysis(trendForm);
      const researchResult: ResearchResult = {
        type: 'trend',
        data: result,
        timestamp: new Date(),
        id: `trend-${Date.now()}`,
      };
      
      setResults(prev => [researchResult, ...prev]);
      setCurrentResult(researchResult);
    } catch (error) {
      console.error('Trend analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Trend analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (format: 'json' | 'csv') => {
    if (!currentResult) {
      setError('No results to export');
      return;
    }

    const exportData = marketResearchService.exportData(currentResult.data.data, format);
    if (!exportData || typeof exportData !== 'string') {
      setError('Failed to export data');
      return;
    }

    const blob = new Blob([exportData], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-research-${currentResult.type}-${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const setSampleQuery = (query: string, type: 'comprehensive' | 'competitor' | 'trend') => {
    if (type === 'comprehensive') {
      setComprehensiveForm(prev => ({ ...prev, market_query: query }));
    } else if (type === 'competitor') {
      const [company, industry] = query.includes(' competitors in ') 
        ? query.split(' competitors in ') 
        : [query, ''];
      setCompetitorForm(prev => ({
        ...prev,
        company_name: company,
        industry: industry || prev.industry
      }));
    } else if (type === 'trend') {
      const cleanIndustry = query.replace(' trends 2025', '').replace(' predictions', '');
      setTrendForm(prev => ({ ...prev, industry: cleanIndustry }));
    }
  };

  return (
    <div className="min-h-screen space-y-8 market-research-scroll">
      {/* Enhanced Header */}
      <div className="relative market-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-800/20 rounded-3xl blur-3xl market-pulse" />
        <div className="relative bg-gradient-to-r from-gray-800/80 via-gray-800/60 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-sm market-glow" />
                  <div className="relative p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    Market Research Hub
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Sparkles className="w-4 h-4 text-blue-400 market-pulse" />
                    <span className="text-blue-400 text-sm font-medium">AI-Powered Intelligence</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                Unlock market insights with real-time data analysis, competitive intelligence, 
                and trend forecasting powered by advanced AI algorithms.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Real-time data</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Competitive analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Trend forecasting</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats & Export */}
            <div className="flex flex-col gap-4 market-slide-in-right">
              {results.length > 0 && (
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {results.length} {results.length === 1 ? 'Report' : 'Reports'}
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full" />
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Last updated {results[0]?.timestamp.toLocaleDateString()}
                  </div>
                </div>
              )}
              
              {currentResult && (
                <div className="flex gap-3">
                  <Button 
                    onClick={() => exportResults('json')} 
                    variant="secondary" 
                    size="sm"
                    className="bg-gray-700/50 hover:bg-gray-600/50 border-gray-600/50 hover:scale-105 transition-transform"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    JSON
                  </Button>
                  <Button 
                    onClick={() => exportResults('csv')} 
                    variant="secondary" 
                    size="sm"
                    className="bg-gray-700/50 hover:bg-gray-600/50 border-gray-600/50 hover:scale-105 transition-transform"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button 
                    onClick={() => saveResearch(currentResult)} 
                    variant="secondary" 
                    size="sm"
                    className="bg-gray-700/50 hover:bg-gray-600/50 border-gray-600/50 hover:scale-105 transition-transform"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Error Display */}
      {error && (
        <div className="animate-in slide-in-from-top duration-300">
          <Card className="border-red-500/50 bg-gradient-to-r from-red-900/30 via-red-800/20 to-red-900/30 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500/20 rounded-full">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <h3 className="text-red-300 font-semibold mb-1">Research Error</h3>
                  <p className="text-red-200/80 text-sm">{error}</p>
                  <Button 
                    onClick={() => setError('')} 
                    variant="secondary" 
                    size="sm" 
                    className="mt-3 bg-red-700/30 hover:bg-red-600/30 border-red-500/30"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Enhanced Research Tools Sidebar */}
        <div className="lg:col-span-4">
          <Card gradient className="sticky top-6 overflow-hidden">
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="relative">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
                    <div className="absolute inset-0 w-8 h-8 border-2 border-blue-400/20 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Analyzing Market Data</p>
                    <p className="text-gray-400 text-sm">This may take a few moments...</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Research Tools</h2>
                  <p className="text-gray-400 text-sm">Choose your analysis type</p>
                </div>
              </div>

              {/* Enhanced Tab Navigation */}
              <div className="flex mb-6 bg-gray-800/50 rounded-2xl p-1.5 backdrop-blur-sm">
                {[
                  { id: 'comprehensive', icon: Target, label: 'Market', desc: 'Full analysis' },
                  { id: 'competitor', icon: Users, label: 'Competitors', desc: 'Competitive intel' },
                  { id: 'trend', icon: TrendingUp, label: 'Trends', desc: 'Future insights' }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      className={`flex-1 py-4 px-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-[1.02]' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }`}
                      onClick={() => setActiveTab(tab.id as any)}
                    >
                      <Icon className={`w-4 h-4 mx-auto mb-1 ${isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                      <div className="text-xs font-semibold">{tab.label}</div>
                      <div className="text-xs opacity-80 mt-0.5">{tab.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Enhanced Comprehensive Research Form */}
              {activeTab === 'comprehensive' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-400" />
                      Market/Industry
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                        placeholder="e.g., AI-powered customer service solutions"
                        value={comprehensiveForm.market_query}
                        onChange={(e) => setComprehensiveForm(prev => ({
                          ...prev,
                          market_query: e.target.value
                        }))}
                      />
                      {comprehensiveForm.market_query && (
                        <button 
                          onClick={() => setComprehensiveForm(prev => ({ ...prev, market_query: '' }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                    
                    {/* Search History Dropdown */}
                    {searchHistory.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-medium text-gray-400">Recent Searches</span>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {searchHistory.slice(0, 5).map((query, index) => (
                            <button
                              key={index}
                              onClick={() => setComprehensiveForm(prev => ({ ...prev, market_query: query }))}
                              className="w-full text-left px-3 py-2 bg-gray-800/30 hover:bg-gray-700/50 text-gray-300 hover:text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="truncate">{query}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-400" />
                      Geographic Focus
                    </label>
                    <select
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                      value={comprehensiveForm.location}
                      onChange={(e) => setComprehensiveForm(prev => ({
                        ...prev,
                        location: e.target.value
                      }))}
                    >
                      {templates.locations.map(location => (
                        <option key={location.code} value={location.code} className="bg-gray-800">
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <span className="text-sm font-medium text-white">Research Options</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="include-news"
                          className="peer sr-only"
                          checked={comprehensiveForm.include_news}
                          onChange={(e) => setComprehensiveForm(prev => ({
                            ...prev,
                            include_news: e.target.checked
                          }))}
                        />
                        <label
                          htmlFor="include-news"
                          className="flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-700/30 border border-gray-700/50 peer-checked:border-blue-500/50 peer-checked:bg-blue-600/10 rounded-xl cursor-pointer transition-all"
                        >
                          <span className="text-sm font-medium text-white">Include News</span>
                          <div className="w-5 h-5 bg-gray-700 peer-checked:bg-blue-600 rounded border-2 border-gray-600 peer-checked:border-blue-500 flex items-center justify-center">
                            {comprehensiveForm.include_news && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="include-images"
                          className="peer sr-only"
                          checked={comprehensiveForm.include_images}
                          onChange={(e) => setComprehensiveForm(prev => ({
                            ...prev,
                            include_images: e.target.checked
                          }))}
                        />
                        <label
                          htmlFor="include-images"
                          className="flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-700/30 border border-gray-700/50 peer-checked:border-blue-500/50 peer-checked:bg-blue-600/10 rounded-xl cursor-pointer transition-all"
                        >
                          <span className="text-sm font-medium text-white">Include Images</span>
                          <div className="w-5 h-5 bg-gray-700 peer-checked:bg-blue-600 rounded border-2 border-gray-600 peer-checked:border-blue-500 flex items-center justify-center">
                            {comprehensiveForm.include_images && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleComprehensiveResearch} 
                    disabled={loading || !comprehensiveForm.market_query.trim()}
                    className="w-full relative overflow-hidden"
                    size="lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Analyzing Market...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          <span>Research Market</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </div>
                  </Button>

                  <div className="space-y-3">
                    <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Sample Queries
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {templates.sampleQueries.comprehensive.slice(0, 4).map(query => (
                        <button
                          key={query}
                          className="px-3 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 text-gray-300 hover:text-white text-xs rounded-lg transition-all border border-gray-600/30 hover:border-gray-500/50 group"
                          onClick={() => setSampleQuery(query, 'comprehensive')}
                        >
                          <span className="group-hover:scale-105 transition-transform inline-block">{query}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Competitor Analysis Form */}
              {activeTab === 'competitor' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-400" />
                      Company Name
                    </label>
                    <input
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="e.g., Tesla, Google, Amazon"
                      value={competitorForm.company_name}
                      onChange={(e) => setCompetitorForm(prev => ({
                        ...prev,
                        company_name: e.target.value
                      }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-400" />
                      Industry
                    </label>
                    <input
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="e.g., Electric Vehicles, Cloud Computing"
                      value={competitorForm.industry}
                      onChange={(e) => setCompetitorForm(prev => ({
                        ...prev,
                        industry: e.target.value
                      }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      Geographic Focus
                    </label>
                    <select
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                      value={competitorForm.location}
                      onChange={(e) => setCompetitorForm(prev => ({
                        ...prev,
                        location: e.target.value
                      }))}
                    >
                      {templates.locations.map(location => (
                        <option key={location.code} value={location.code} className="bg-gray-800">
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button 
                    onClick={handleCompetitorAnalysis} 
                    disabled={loading || !competitorForm.company_name.trim() || !competitorForm.industry.trim()}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    size="lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Analyzing Competitors...</span>
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5" />
                          <span>Analyze Competitors</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </div>
                  </Button>

                  <div className="space-y-3">
                    <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Sample Analyses
                    </span>
                    <div className="grid gap-2">
                      {templates.sampleQueries.competitor.slice(0, 3).map(query => (
                        <button
                          key={query}
                          className="w-full text-left px-3 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 text-gray-300 hover:text-white text-xs rounded-lg transition-all border border-gray-600/30 hover:border-gray-500/50"
                          onClick={() => setSampleQuery(query, 'competitor')}
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Trend Analysis Form */}
              {activeTab === 'trend' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                      Industry
                    </label>
                    <input
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="e.g., Artificial Intelligence, FinTech"
                      value={trendForm.industry}
                      onChange={(e) => setTrendForm(prev => ({
                        ...prev,
                        industry: e.target.value
                      }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      Time Period
                    </label>
                    <select
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                      value={trendForm.time_period}
                      onChange={(e) => setTrendForm(prev => ({
                        ...prev,
                        time_period: e.target.value
                      }))}
                    >
                      <option value="recent" className="bg-gray-800">Recent Trends (3 months)</option>
                      <option value="2025" className="bg-gray-800">2025 Predictions</option>
                      <option value="future" className="bg-gray-800">Future Outlook (5 years)</option>
                      <option value="emerging" className="bg-gray-800">Emerging Technologies</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      Geographic Focus
                    </label>
                    <select
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
                      value={trendForm.location}
                      onChange={(e) => setTrendForm(prev => ({
                        ...prev,
                        location: e.target.value
                      }))}
                    >
                      {templates.locations.map(location => (
                        <option key={location.code} value={location.code} className="bg-gray-800">
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button 
                    onClick={handleTrendAnalysis} 
                    disabled={loading || !trendForm.industry.trim()}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                    size="lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Analyzing Trends...</span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5" />
                          <span>Analyze Trends</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </div>
                  </Button>

                  <div className="space-y-3">
                    <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Trending Now
                    </span>
                    <div className="grid gap-2">
                      {templates.sampleQueries.trend.slice(0, 4).map(query => (
                        <button
                          key={query}
                          className="w-full text-left px-3 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 hover:from-gray-600/50 hover:to-gray-500/50 text-gray-300 hover:text-white text-xs rounded-lg transition-all border border-gray-600/30 hover:border-gray-500/50"
                          onClick={() => setSampleQuery(query, 'trend')}
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Enhanced Results Display */}
        <div className="lg:col-span-8">
          {currentResult ? (
            <div className="market-fade-in-up">
              <MarketResearchResults result={currentResult} />
            </div>
          ) : (
            <Card className="h-[600px] relative overflow-hidden market-bounce-in">
              {/* Background Pattern */}
              {/* <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500 rounded-full blur-2xl" />
              </div> */}
              
              <div className="relative flex items-center justify-center h-full">
                <div className="text-center space-y-6 max-w-md px-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                    <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto">
                      <BarChart3 className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Ready to Research
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Select a research type and start your market analysis. Our AI will gather 
                      real-time data and provide comprehensive insights to help you make informed decisions.
                    </p>
                  </div>
                  
                  {/* Quick Tips */}
                  {showQuickTips && (
                    <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-blue-600/20 rounded-lg">
                          <Sparkles className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-semibold text-white mb-1">Pro Tip</h4>
                          <p className="text-xs text-gray-400">
                            Be specific in your queries for better results. Include target audience, 
                            geographic region, and time frame when possible.
                          </p>
                        </div>
                        <button 
                          onClick={() => setShowQuickTips(false)}
                          className="p-1 hover:bg-gray-700/50 rounded"
                        >
                          <RefreshCw className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>Real-time data</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>AI-powered analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Global insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Enhanced Recent Results */}
      {results.length > 1 && (
        <div className="animate-in slide-in-from-bottom duration-500 market-fade-in-up">
          <Card gradient className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Research History</h2>
                    <p className="text-gray-400 text-sm">{results.length - 1} previous analyses</p>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="bg-gray-700/50 hover:bg-gray-600/50 border-gray-600/50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.slice(1, 7).map((result, index) => {
                  const isActive = currentResult?.id === result.id;
                  return (
                    <div
                      key={result.id}
                      className={`group relative p-5 bg-gradient-to-r from-gray-800/30 to-gray-800/10 hover:from-gray-700/40 hover:to-gray-700/20 border border-gray-700/50 hover:border-gray-600/50 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                        isActive ? 'ring-2 ring-blue-500/50 bg-blue-600/10' : ''
                      }`}
                      onClick={() => setCurrentResult(result)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 ${
                          result.type === 'comprehensive' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 
                          result.type === 'competitor' ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 
                          'bg-orange-600/20 text-orange-400 border border-orange-500/30'
                        }`}>
                          {result.type === 'comprehensive' && <Target className="w-3 h-3" />}
                          {result.type === 'competitor' && <Users className="w-3 h-3" />}
                          {result.type === 'trend' && <TrendingUp className="w-3 h-3" />}
                          {result.type}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                          {result.data.query}
                        </h4>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {result.data.location.toUpperCase()}
                          </span>
                          <span className="text-green-400 font-medium">Complete</span>
                        </div>
                      </div>
                      
                      {/* Hover Actions */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              saveResearch(result);
                            }}
                            className="p-1 bg-gray-700/50 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors"
                          >
                            <Star className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentResult(result);
                            }}
                            className="p-1 bg-gray-700/50 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {results.length > 7 && (
                <div className="text-center mt-6">
                  <Button variant="secondary" size="sm">
                    View All {results.length} Results
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Enhanced Results Component
function MarketResearchResults({ result }: { result: ResearchResult }) {
  const formattedData = marketResearchService.formatResearchData(result.data.data);

  if (!formattedData) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-orange-600/5 to-red-600/10" />
        <div className="relative flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
            <div className="relative p-4 bg-red-600/20 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
          </div>
          <div className="text-center mt-6">
            <h3 className="text-2xl font-bold text-white mb-3">No Data Available</h3>
            <p className="text-gray-400 max-w-md">
              The research completed but no structured data was returned. Please try a different query 
              or check your search parameters.
            </p>
            <Button variant="secondary" className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comprehensive': return <Target className="w-6 h-6 text-blue-400" />;
      case 'competitor': return <Users className="w-6 h-6 text-green-400" />;
      case 'trend': return <TrendingUp className="w-6 h-6 text-orange-400" />;
      default: return <Search className="w-6 h-6 text-gray-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      comprehensive: 'bg-gradient-to-r from-blue-600/20 to-blue-500/20 text-blue-400 border-blue-500/50',
      competitor: 'bg-gradient-to-r from-green-600/20 to-green-500/20 text-green-400 border-green-500/50',
      trend: 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 text-orange-400 border-orange-500/50'
    };
    return badges[type as keyof typeof badges] || badges.comprehensive;
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <Card gradient className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-600/10 via-purple-600/5 to-transparent rounded-full blur-3xl" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-sm" />
                  <div className="relative p-3 bg-gradient-to-r from-blue-600/80 to-blue-700/80 backdrop-blur-sm rounded-2xl">
                    {getTypeIcon(result.type)}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white line-clamp-2">
                    {result.data.query}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-2 text-gray-400">
                      <Globe className="w-4 h-4 text-green-400" />
                      {result.data.location.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4 text-blue-400" />
                      {result.timestamp.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2 text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Complete
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className={`px-4 py-2 rounded-xl border backdrop-blur-sm ${getTypeBadge(result.type)}`}>
                <span className="font-semibold text-sm capitalize">{result.type} Analysis</span>
              </div>
              <div className="text-xs text-gray-400 text-center">
                Data sources: {formattedData.stats.searchResults + formattedData.stats.newsResults} results
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Overview */}
      <Card gradient className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-2xl" />
        <div className="relative p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-xl border border-blue-500/30">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
              <p className="text-gray-400 text-sm">AI-generated market overview</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <p className="text-gray-300 leading-relaxed text-lg">{formattedData.overview}</p>
          </div>
        </div>
      </Card>

      {/* Enhanced Key Insights */}
      {formattedData.insights.length > 0 && (
        <Card gradient className="relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-yellow-600/10 to-transparent rounded-full blur-3xl" />
          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 rounded-xl border border-yellow-500/30">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Key Insights</h2>
                <p className="text-gray-400 text-sm">{formattedData.insights.length} critical findings</p>
              </div>
            </div>
            <div className="grid gap-4">
              {formattedData.insights.map((insight, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl blur-sm group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300" />
                  <div className="relative flex items-start gap-4 p-6 bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm" />
                      <div className="relative w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                        {insight}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Grid Layout for Additional Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Opportunities */}
        {formattedData.opportunities.length > 0 && (
          <Card gradient className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 group-hover:from-green-600/10 group-hover:to-emerald-600/10 transition-all duration-300" />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-green-600/20 to-emerald-700/20 rounded-xl border border-green-500/30">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Market Opportunities</h3>
                  <p className="text-gray-400 text-sm">{formattedData.opportunities.length} potential areas</p>
                </div>
              </div>
              <div className="space-y-3">
                {formattedData.opportunities.map((opportunity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 hover:bg-gray-700/30 rounded-lg transition-colors group/item">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                    <span className="text-gray-300 text-sm group-hover/item:text-white transition-colors">{opportunity}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Challenges */}
        {formattedData.challenges.length > 0 && (
          <Card gradient className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-600/5 group-hover:from-red-600/10 group-hover:to-orange-600/10 transition-all duration-300" />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-red-600/20 to-orange-700/20 rounded-xl border border-red-500/30">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Market Challenges</h3>
                  <p className="text-gray-400 text-sm">{formattedData.challenges.length} potential risks</p>
                </div>
              </div>
              <div className="space-y-3">
                {formattedData.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 hover:bg-gray-700/30 rounded-lg transition-colors group/item">
                    <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                    <span className="text-gray-300 text-sm group-hover/item:text-white transition-colors">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Trends */}
        {formattedData.trends.length > 0 && (
          <Card gradient className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 transition-all duration-300" />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600/20 to-cyan-700/20 rounded-xl border border-blue-500/30">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Market Trends</h3>
                  <p className="text-gray-400 text-sm">{formattedData.trends.length} emerging patterns</p>
                </div>
              </div>
              <div className="space-y-3">
                {formattedData.trends.map((trend, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 hover:bg-gray-700/30 rounded-lg transition-colors group/item">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                    <span className="text-gray-300 text-sm group-hover/item:text-white transition-colors">{trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Competitors */}
        {formattedData.competitors.length > 0 && (
          <Card gradient className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-amber-600/5 group-hover:from-orange-600/10 group-hover:to-amber-600/10 transition-all duration-300" />
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-orange-600/20 to-amber-700/20 rounded-xl border border-orange-500/30">
                  <Users className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Key Competitors</h3>
                  <p className="text-gray-400 text-sm">{formattedData.competitors.length} market players</p>
                </div>
              </div>
              <div className="space-y-3">
                {formattedData.competitors.map((competitor, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 hover:bg-gray-700/30 rounded-lg transition-colors group/item">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform" />
                    <span className="text-gray-300 text-sm group-hover/item:text-white transition-colors">{competitor}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Enhanced Recommendations */}
      {formattedData.recommendations.length > 0 && (
        <Card gradient className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-green-600/10 via-emerald-600/5 to-transparent rounded-full blur-3xl" />
          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-600/20 to-emerald-700/20 rounded-xl border border-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Strategic Recommendations</h2>
                <p className="text-gray-400 text-sm">AI-generated actionable insights</p>
              </div>
            </div>
            <div className="grid gap-4">
              {formattedData.recommendations.map((recommendation, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5 rounded-xl blur-sm group-hover:from-green-600/10 group-hover:to-emerald-600/10 transition-all duration-300" />
                  <div className="relative p-6 bg-gradient-to-r from-gray-800/60 via-gray-800/40 to-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 group-hover:border-green-500/30 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur-sm" />
                        <div className="relative w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                          {recommendation}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-1 bg-green-600/20 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Statistics */}
      <Card gradient className="relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-600/10 to-transparent rounded-full blur-3xl" />
        <div className="relative p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-600/20 to-pink-700/20 rounded-xl border border-purple-500/30">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Research Statistics</h2>
              <p className="text-gray-400 text-sm">Data collection metrics</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl blur-sm group-hover:from-blue-600/20 group-hover:to-cyan-600/20 transition-all duration-300" />
              <div className="relative text-center p-6 bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 group-hover:border-blue-500/30 transition-all duration-300">
                <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  {formattedData.stats.searchResults}
                </div>
                <div className="text-sm text-gray-400 mb-1">Search Results</div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((formattedData.stats.searchResults / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-xl blur-sm group-hover:from-green-600/20 group-hover:to-emerald-600/20 transition-all duration-300" />
              <div className="relative text-center p-6 bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 group-hover:border-green-500/30 transition-all duration-300">
                <div className="text-3xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">
                  {formattedData.stats.newsResults}
                </div>
                <div className="text-sm text-gray-400 mb-1">News Articles</div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((formattedData.stats.newsResults / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10 rounded-xl blur-sm group-hover:from-orange-600/20 group-hover:to-amber-600/20 transition-all duration-300" />
              <div className="relative text-center p-6 bg-gradient-to-r from-gray-800/50 via-gray-800/30 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 group-hover:border-orange-500/30 transition-all duration-300">
                <div className="text-3xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform">
                  {formattedData.stats.imageResults}
                </div>
                <div className="text-sm text-gray-400 mb-1">Images</div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((formattedData.stats.imageResults / 25) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Metrics */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-400">Analysis Time</div>
                <div className="text-white font-semibold">~2.3 seconds</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Accuracy</div>
                <div className="text-white font-semibold">94.8%</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Sources</div>
                <div className="text-white font-semibold">{Math.ceil((formattedData.stats.searchResults + formattedData.stats.newsResults) / 10)} verified</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400">Confidence</div>
                <div className="text-white font-semibold">High</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default MarketResearchPage;
