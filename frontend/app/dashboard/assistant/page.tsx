"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic,
  MicOff, 
  FileText, 
  Users, 
  DollarSign,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Loader2,
  Zap,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Settings,
  PlusCircle,
  Clock,
  Trash2,
  Download,
  Brain,
  Target,
  Rocket,
  Shield,
  Globe,
  Search,
  Filter,
  Star,
  TrendingUp,
  Calendar,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Eye,
  Heart,
  Share,
  Bookmark,
  ChevronDown,
  ChevronUp,
  X,
  Maximize,
  Layout,
  Grid3X3,
  List,
  Wand2,
  Calculator
} from 'lucide-react';
import apiService from '@/config/apiservice';
import MarkdownRenderer from '@/components/MarkdownRenderer';

type ChatMessage = {
  id: string;
  type: string;
  content: string;
  timestamp: Date;
  sources?: string[];
  rating?: 'positive' | 'negative' | null;
  category?: string;
  complexity?: 'beginner' | 'intermediate' | 'advanced';
};

type AssistantCard = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  category: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prompt: string;
  examples: string[];
  trending: boolean;
  featured: boolean;
};

type ViewMode = 'cards' | 'chat' | 'dashboard';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedCard, setSelectedCard] = useState<AssistantCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [bookmarkedCards, setBookmarkedCards] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assistantCards: AssistantCard[] = [
    {
      id: '1',
      title: 'Legal Framework Setup',
      description: 'Get comprehensive guidance on setting up your startup\'s legal foundation, including entity formation, contracts, and compliance.',
      icon: Shield,
      color: 'emerald',
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-600',
      category: 'legal',
      complexity: 'intermediate',
      estimatedTime: '5-10 min',
      prompt: 'Help me understand the complete legal framework needed to start a tech startup in India, including entity formation, contracts, and intellectual property protection.',
      examples: ['Private Limited Company vs LLP', 'Founder agreements', 'IP protection strategies'],
      trending: true,
      featured: true
    },
    {
      id: '2',
      title: 'Funding Strategy Builder',
      description: 'Create a comprehensive funding roadmap from bootstrapping to Series A, including pitch deck optimization.',
      icon: DollarSign,
      color: 'blue',
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      category: 'funding',
      complexity: 'advanced',
      estimatedTime: '10-15 min',
      prompt: 'Create a detailed funding strategy for my tech startup, including timeline, investor types, pitch deck structure, and valuation expectations.',
      examples: ['Seed funding timeline', 'Investor pitch templates', 'Valuation models'],
      trending: true,
      featured: true
    },
    {
      id: '3',
      title: 'Team Building Guide',
      description: 'Master the art of building high-performing teams, from co-founder selection to equity distribution.',
      icon: Users,
      color: 'purple',
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      category: 'team',
      complexity: 'intermediate',
      estimatedTime: '7-12 min',
      prompt: 'Guide me through building a strong founding team, including co-founder selection criteria, equity distribution, and early hiring strategies.',
      examples: ['Co-founder vetting', 'Equity allocation', 'Culture building'],
      trending: false,
      featured: true
    },
    {
      id: '4',
      title: 'Product Strategy Lab',
      description: 'Develop winning product strategies, from MVP planning to market validation and scaling techniques.',
      icon: Rocket,
      color: 'orange',
      gradient: 'from-orange-400 via-orange-500 to-orange-600',
      category: 'product',
      complexity: 'advanced',
      estimatedTime: '8-15 min',
      prompt: 'Help me create a comprehensive product strategy including MVP features, market validation methods, and scaling roadmap.',
      examples: ['MVP feature prioritization', 'User testing frameworks', 'Product-market fit'],
      trending: true,
      featured: false
    },
    {
      id: '5',
      title: 'Market Analysis Engine',
      description: 'Conduct thorough market research, competitive analysis, and identify untapped opportunities.',
      icon: TrendingUp,
      color: 'cyan',
      gradient: 'from-cyan-400 via-cyan-500 to-cyan-600',
      category: 'market',
      complexity: 'intermediate',
      estimatedTime: '6-10 min',
      prompt: 'Conduct a comprehensive market analysis for my startup idea, including market size, competition, and growth opportunities.',
      examples: ['Market sizing techniques', 'Competitor analysis', 'Trend identification'],
      trending: false,
      featured: true
    },
    {
      id: '6',
      title: 'Business Model Designer',
      description: 'Design sustainable business models with multiple revenue streams and pricing strategies.',
      icon: Target,
      color: 'pink',
      gradient: 'from-pink-400 via-pink-500 to-pink-600',
      category: 'business',
      complexity: 'advanced',
      estimatedTime: '10-20 min',
      prompt: 'Design a robust business model for my startup with multiple revenue streams, pricing strategies, and unit economics.',
      examples: ['Revenue model options', 'Pricing psychology', 'Unit economics'],
      trending: true,
      featured: false
    },
    {
      id: '7',
      title: 'Growth Hacking Toolkit',
      description: 'Implement proven growth strategies and marketing techniques to scale your startup rapidly.',
      icon: Zap,
      color: 'yellow',
      gradient: 'from-yellow-400 via-yellow-500 to-yellow-600',
      category: 'growth',
      complexity: 'intermediate',
      estimatedTime: '5-8 min',
      prompt: 'Provide a comprehensive growth hacking strategy including marketing channels, metrics, and scaling tactics.',
      examples: ['Viral marketing', 'Growth metrics', 'Channel optimization'],
      trending: true,
      featured: false
    },
    {
      id: '8',
      title: 'Financial Planning Pro',
      description: 'Create detailed financial projections, cash flow models, and investment scenarios.',
      icon: Calculator,
      color: 'indigo',
      gradient: 'from-indigo-400 via-indigo-500 to-indigo-600',
      category: 'finance',
      complexity: 'advanced',
      estimatedTime: '12-18 min',
      prompt: 'Help me create comprehensive financial projections including revenue models, expense planning, and funding requirements.',
      examples: ['Cash flow modeling', 'Financial projections', 'Break-even analysis'],
      trending: false,
      featured: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', icon: Grid3X3 },
    { id: 'legal', name: 'Legal & Compliance', icon: Shield },
    { id: 'funding', name: 'Funding', icon: DollarSign },
    { id: 'team', name: 'Team Building', icon: Users },
    { id: 'product', name: 'Product Strategy', icon: Rocket },
    { id: 'market', name: 'Market Analysis', icon: TrendingUp },
    { id: 'business', name: 'Business Model', icon: Target },
    { id: 'growth', name: 'Growth Hacking', icon: Zap },
    { id: 'finance', name: 'Financial Planning', icon: Calculator }
  ];

  const filteredCards = assistantCards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         card.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || card.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (messageText?: string, cardData?: AssistantCard) => {
    const textToSend = messageText || message;
    if (!textToSend.trim() || isLoading) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date(),
      sources: [],
      category: cardData?.category,
      complexity: cardData?.complexity
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setMessage('');
    setIsLoading(true);
    setError('');
    setViewMode('chat');
    setIsChatExpanded(true);

    try {
      const response = await apiService.askQuestion({
        question: textToSend,
        startup_type: cardData?.category || 'general'
      });

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources || [],
        category: cardData?.category,
        complexity: cardData?.complexity
      };

      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get response from PitchPilot. Please try again.');
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again in a moment.',
        timestamp: new Date(),
        sources: []
      };
      setChatHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (card: AssistantCard) => {
    setSelectedCard(card);
    handleSendMessage(card.prompt, card);
  };

  const toggleBookmark = (cardId: string) => {
    setBookmarkedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const rateMessage = (messageId: string, rating: 'positive' | 'negative') => {
    setChatHistory(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const clearChat = () => {
    setChatHistory([]);
    setSelectedCard(null);
  };

  const startNewChat = () => {
    setChatHistory([{
      id: Date.now().toString(),
      type: 'assistant',
      content: "Welcome to your AI-powered startup consultant! 🚀\n\nI'm here to help you navigate the complex world of entrepreneurship. Whether you need guidance on legal frameworks, funding strategies, team dynamics, or product development, I've got you covered.\n\n**What can I help you with today?**",
      timestamp: new Date(),
      sources: []
    }]);
    setSelectedCard(null);
    setViewMode('chat');
  };

  const ComplexityBadge = ({ complexity }: { complexity: string }) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700 border-green-200',
      intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      advanced: 'bg-red-100 text-red-700 border-red-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[complexity as keyof typeof colors]}`}>
        {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
      </span>
    );
  };

  const renderCardsView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative px-8 pt-12 pb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Startup Assistant
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              Your Startup's
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> AI Brain</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Get expert-level guidance on legal frameworks, funding strategies, team building, and product development. 
              Choose your area of focus and let our AI guide you through complex startup challenges.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assistance areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                
                <select
                  value={selectedComplexity}
                  onChange={(e) => setSelectedComplexity(e.target.value)}
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                
                {/* General Chat Button */}
                <button
                  onClick={() => {
                    setSelectedCard(null);
                    setViewMode('chat');
                    if (chatHistory.length === 0) {
                      setChatHistory([{
                        id: '1',
                        type: 'assistant',
                        content: "Welcome to your AI-powered startup consultant! 🚀\n\nI'm here to help you navigate the complex world of entrepreneurship. Whether you need guidance on legal frameworks, funding strategies, team dynamics, or product development, I've got you covered.\n\n**What can I help you with today?**",
                        timestamp: new Date(),
                        sources: []
                      }]);
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>General Chat</span>
                </button>
                
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'cards' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('chat')}
                    className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'chat' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-3 text-indigo-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* General Chat Card */}
            <button
              onClick={() => {
                setSelectedCard(null);
                setViewMode('chat');
                if (chatHistory.length === 0) {
                  setChatHistory([{
                    id: '1',
                    type: 'assistant',
                    content: "Welcome to your AI-powered startup consultant! 🚀\n\nI'm here to help you navigate the complex world of entrepreneurship. Whether you need guidance on legal frameworks, funding strategies, team dynamics, or product development, I've got you covered.\n\n**What can I help you with today?**",
                    timestamp: new Date(),
                    sources: []
                  }]);
                }
              }}
              className="group p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border border-indigo-200 dark:border-indigo-700 rounded-2xl hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">General Chat</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Open-ended conversation</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Start a free-form conversation with our PitchPilot. Ask any startup-related question or explore multiple topics in one session.
              </p>
              <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                <span>Start chatting</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Quick Question Card */}
            <button
              onClick={() => {
                setMessage("I have a quick question about my startup: ");
                setViewMode('chat');
              }}
              className="group p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-700 rounded-2xl hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Question</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fast answers</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Have a specific question? Jump straight to asking our PitchPilot for immediate guidance and actionable advice.
              </p>
              <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <span>Ask now</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Brainstorm Session Card */}
            <button
              onClick={() => {
                setMessage("I'd like to brainstorm ideas about: ");
                setViewMode('chat');
              }}
              className="group p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4 mb-3">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Brainstorm Ideas</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Creative thinking</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Need creative input? Let's brainstorm together. Perfect for exploring new ideas, solving problems, or finding innovative solutions.
              </p>
              <div className="mt-4 flex items-center text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                <span>Start brainstorming</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Cards */}
      <div className="px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
              <Star className="w-6 h-6 mr-3 text-yellow-500" />
              Featured Assistance
            </h2>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {filteredCards.length} areas available
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((card) => {
              const Icon = card.icon;
              const isBookmarked = bookmarkedCards.includes(card.id);
              
              return (
                <div
                  key={card.id}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02]"
                  onClick={() => handleCardClick(card)}
                >
                  {/* Trending Badge */}
                  {card.trending && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {card.featured && (
                    <div className="absolute top-4 right-4 p-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${card.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(card.id);
                      }}
                      className={`p-2 rounded-lg transition-all ${
                        isBookmarked 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Card Content */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  
                  {/* Card Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <ComplexityBadge complexity={card.complexity} />
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {card.estimatedTime}
                    </div>
                  </div>
                  
                  {/* Examples */}
                  <div className="mb-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Examples:</div>
                    <div className="flex flex-wrap gap-1">
                      {card.examples.slice(0, 2).map((example, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded-md">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span>Start Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Modern Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('cards')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Cards</span>
            </button>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">PitchPilot</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {selectedCard ? `${selectedCard.title} Session` : 'General Consultation'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Chat Actions */}
            <button
              onClick={startNewChat}
              className="flex items-center space-x-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
              title="Start new chat"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
            </button>
            
            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-slate-500 dark:text-slate-400">Messages:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{chatHistory.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 overflow-y-auto">
        {/* Welcome Message for New Chat */}
        {chatHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="inline-flex p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                AI Startup Consultant
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Ask me anything about startups - from legal frameworks to funding strategies. I'm here to help!
              </p>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-6">
          {chatHistory.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom duration-300`}>
              <div className={`max-w-3xl w-full ${message.type === 'user' ? 'pl-12' : 'pr-12'}`}>
                {/* Assistant Avatar and Name */}
                {message.type === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">PitchPilot</span>
                    {message.category && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded-full">
                        {message.category}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Message Bubble */}
                <div className={`relative p-6 rounded-3xl shadow-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
                }`}>
                  {message.type === 'user' ? (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  )}

                  {/* Sources */}
                  {message.type === 'assistant' && message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Sources
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {message.sources.map((source, sourceIndex) => (
                          <span key={sourceIndex} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400 rounded-lg">
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Footer */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-xs text-slate-400">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </span>
                    
                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(message.content)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Copy message"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setChatHistory(prev => prev.map(msg => 
                              msg.id === message.id ? { ...msg, rating: msg.rating === 'positive' ? null : 'positive' } : msg
                            ));
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            message.rating === 'positive' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-600' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            setChatHistory(prev => prev.map(msg => 
                              msg.id === message.id ? { ...msg, rating: msg.rating === 'negative' ? null : 'negative' } : msg
                            ));
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            message.rating === 'negative' 
                              ? 'bg-red-100 dark:bg-red-900 text-red-600' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading Animation */}
          {isLoading && (
            <div className="flex justify-start animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center space-x-4 p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg pr-12">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Modern Input Area */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-white/20 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="flex items-center p-4 mb-4 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-2xl bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm flex-1">{error}</span>
              <button 
                onClick={() => setError('')}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask me anything about startups - legal advice, funding strategies, team building..."
                  className="w-full pl-6 pr-32 py-4 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white rounded-2xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm shadow-lg"
                  rows={1}
                  disabled={isLoading}
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                />
                
                <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                  <button
                    onClick={() => setIsListening(!isListening)}
                    className={`p-2 rounded-xl transition-colors ${
                      isListening 
                        ? 'bg-red-100 dark:bg-red-900 text-red-600' 
                        : 'hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-400'
                    }`}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  
                  <div className="text-xs text-slate-400">
                    {message.length}/1000
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!message.trim() || isLoading}
              className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:from-slate-300 disabled:to-slate-400 shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-6">
              <span>Press Enter to send • Shift + Enter for new line</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>AI Online</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Powered by Advanced AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {viewMode === 'cards' && renderCardsView()}
      {viewMode === 'chat' && renderChatView()}
    </div>
  );
};

export default AIAssistant;