"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Calendar } from "lucide-react";

const CTASection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      className="relative py-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/10" />
        <div 
          className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.3s ease',
          }}
        />
        
        <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-bounce" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/30 rounded-full animate-bounce delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-white/25 rounded-full animate-bounce delay-2000" />
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-sm" />
      </div>
      
      <div className="relative max-w-[95%] 2xl:max-w-[1536px] mx-auto text-center">
        <div className={`transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
            Join 10,000+ Founders
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your{" "}
            <span className="relative">
              Startup?
              <div className="absolute -inset-1 bg-white/20 rounded-lg blur opacity-50 animate-pulse" />
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of founders who have simplified their startup operations with FoundX.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <button className="group relative bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <span className="relative z-10 flex items-center">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button className="group border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <span className="relative z-10 flex items-center">
                <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Schedule Demo
              </span>
            </button>
          </div>
          
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-blue-200 text-sm transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              14-day free trial
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              No credit card required
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;