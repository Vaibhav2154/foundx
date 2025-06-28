"use client";

import { useState } from 'react';

import { 
  Bot, 
  Send, 
  Lightbulb, 
  FileText, 
  Users, 
  DollarSign,
  MessageSquare,
  Clock,
  Sparkles,
  AlertCircle,
  Loader2,
  Zap,
  ArrowRight,
  Star,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import apiService from '@/config/apiservice';
import MarkdownRenderer from '@/components/MarkdownRenderer';

type ChatMessage = {
  type: string;
  content: string;
  time: string;
  sources: string[];
};

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: 'assistant',
      content: "Hi! I'm your AI assistant for startup questions. I can help you with legal matters, team building, funding, operations, and more. What would you like to know?",
      time: '10:00 AM',
      sources: []
    }
  ]);

  const quickPrompts = [
    {
      icon: FileText,
      title: 'Legal Guidance',
      description: 'What legal documents do I need for my startup?',
      prompt: 'What are the essential legal documents I need when starting a company in India?',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: Users,
      title: 'Team Building',
      description: 'How should I structure my founding team?',
      prompt: 'How should I structure my founding team and distribute equity among co-founders?',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      icon: DollarSign,
      title: 'Funding Strategy',
      description: 'When should I raise funding for my startup?',
      prompt: 'When is the right time to raise seed funding and what should I prepare for investors?',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      icon: Lightbulb,
      title: 'Business Strategy',
      description: 'How do I validate my business idea?',
      prompt: 'What are the best ways to validate my business idea before building a full product?',
      gradient: 'from-orange-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-yellow-50'
    },
    {
      icon: TrendingUp,
      title: 'Growth Strategy',
      description: 'How can I scale my startup effectively?',
      prompt: 'What are the key strategies for scaling a startup from 0 to 1000 customers?',
      gradient: 'from-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50'
    },
    {
      icon: Zap,
      title: 'Product Development',
      description: 'What should I prioritize in my MVP?',
      prompt: 'How do I prioritize features for my MVP and what should I include in the first version?',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50'
    }
  ];

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim() || isLoading) return;

    // Add user message
    const newUserMessage = {
      type: 'user',
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setMessage('');
    setIsLoading(true);
    setError('');

    try {
      // Call the actual AI service
      const response = await apiService.askQuestion({
        question: textToSend,
        startup_type: 'general'
      });

      const aiResponse = {
        type: 'assistant',
        content: response.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.sources || []
      };

      setChatHistory(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to get response from AI assistant. Please try again.');
      
      // Add error message to chat
      const errorResponse = {
        type: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again later.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: []
      };
      setChatHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Quick Start Cards */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="flex items-center mb-6 font-bold text-gray-900 dark:text-white text-lg">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Quick Start
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {quickPrompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(prompt.prompt)}
                      className={`p-4 text-left transition-all bg-gradient-to-br ${prompt.bgGradient} dark:from-slate-700 dark:to-slate-600 border border-gray-200 dark:border-slate-600 rounded-xl hover:shadow-lg hover:scale-105 group card-hover`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 mr-3 transition-all bg-gradient-to-r ${prompt.gradient} rounded-lg shadow-sm`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 leading-tight">{prompt.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">{prompt.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">1000+</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Questions Answered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Always Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              {/* Chat Header */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 border-b border-gray-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 mr-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Assistant</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Ready to help with your startup questions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">4.9/5</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-96 lg:h-[500px] p-6 space-y-6 overflow-y-auto chat-scroll bg-gradient-to-b from-gray-50/50 to-white dark:from-slate-800 dark:to-slate-800">
                {chatHistory.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} chat-message`}>
                    <div className={`max-w-2xl ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 shadow-sm'
                    } rounded-2xl p-5`}>
                      {message.type === 'assistant' && (
                        <div className="flex items-center mb-3">
                          <div className="p-1.5 mr-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">AI Assistant</span>
                        </div>
                      )}
                      {message.type === 'user' ? (
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </div>
                      ) : (
                        <MarkdownRenderer 
                          content={message.content} 
                          className="text-sm prose-sm dark:prose-invert"
                        />
                      )}
                      {message.type === 'assistant' && message.sources && message.sources.length > 0 && (
                        <div className="pt-3 mt-3 border-t border-gray-100 dark:border-slate-600">
                          <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Sources:</div>
                          <div className="flex flex-wrap gap-2">
                            {message.sources.map((source, sourceIndex) => (
                              <div key={sourceIndex} className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                                {source}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-6 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-600">
                {error && (
                  <div className="flex items-center p-4 mb-4 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-xl bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ask me anything about startups, legal matters, team building, funding strategies..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!message.trim() || isLoading}
                    className="flex items-center p-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>Press Enter to send, Shift + Enter for new line</span>
                  <span>Powered by AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
            <div className="flex items-start">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mr-4">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Be Specific</h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Include details about your industry, stage, and specific challenges for better responses.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
            <div className="flex items-start">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-4">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Ask Follow-ups</h4>
                <p className="text-sm text-purple-700 dark:text-purple-200">
                  Don't hesitate to ask for clarification or dive deeper into any topic.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6">
            <div className="flex items-start">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-4">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Rate Responses</h4>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Help improve the AI by providing feedback on the quality of responses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;