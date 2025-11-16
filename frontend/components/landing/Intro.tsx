"use client";

import { ArrowRight, CheckCircle, Zap, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Intro() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section 
      className="relative py-20 px-4 sm:px-8 lg:px-12 overflow-hidden min-h-screen flex items-center bg-black"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-black" />
      
      <div className="relative max-w-[95%] 2xl:max-w-[1536px] mx-auto w-full">
        <div className="text-center max-w-4xl mx-auto">
          <div 
            className={`inline-flex items-center px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
            Simplify Your Startup Journey
            <div className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          
          <h1 
            className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            From Idea to{" "}
            <span className="relative">
              Launch
            </span>
          </h1>
          
          <p 
            className={`text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            The all-in-one platform for early-stage startup founders. Generate legal documents, manage teams, 
            track projects, and get AI-powered guidance - all in one place.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transform transition-all duration-1000 delay-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <Link href="/options">
              <button className="group relative btn-secondary overflow-hidden">
                <div className="absolute inset-0 bg-black dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <span className="relative z-10 flex items-center">
                  Start Building Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            
            <button className="group border-2 border-white text-white px-8 py-4 rounded-xl hover:border-white hover:bg-white/10 transition-all duration-200 font-semibold text-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <span className="relative z-10 flex items-center">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </span>
            </button>
          </div>
          
          <div 
            className={`flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 transform transition-all duration-1000 delay-800 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {[
              { icon: CheckCircle, text: "Free to start" },
              { icon: CheckCircle, text: "No credit card required" },
              { icon: CheckCircle, text: "Setup in minutes" }
            ].map((item, index) => (
              <div key={index} className="flex items-center group">
                <item.icon className="w-4 h-4 text-white mr-2 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}