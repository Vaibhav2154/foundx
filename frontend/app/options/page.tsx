"use client";
import { useState, useEffect } from 'react';
import { Rocket, Users, TrendingUp, Lightbulb, ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function OptionsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Hero Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Choose Your Path
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Tell us about your startup experience so we can provide the most relevant guidance for your entrepreneurial journey.
          </p>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Experienced Founder Option */}
          <div className="group bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02]">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                I'm an Experienced Founder
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                You've been through the startup journey before and are looking for advanced tools and insights to scale your current venture.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span>Access advanced analytics and metrics</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span>Connect with investor networks</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span>Scale-focused resources and tools</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span>Mentorship opportunities</span>
              </div>
            </div>

            <a 
              href="/sign-in" 
              className="group/btn w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continue as Experienced Founder
              <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* First-time Entrepreneur Option */}
          <div className="group bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-[1.02]">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                I'm Starting My First Startup
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                You're new to the startup world and need comprehensive guidance to turn your idea into a successful business.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span>Step-by-step startup building guide</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span>Beginner-friendly resources and templates</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span>Idea validation and market research tools</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                <span>Community support and networking</span>
              </div>
            </div>

            <a 
              href="/build-startup" 
              className="group/btn w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Building My First Startup
              <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          
        </div>
      </div>
    </div>
  );
}