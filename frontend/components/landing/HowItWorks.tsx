"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Sign Up & Set Goals",
      description: "Tell us about your startup and what you want to accomplish. Our onboarding process takes just 2 minutes.",
      color: "blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      number: 2,
      title: "Generate & Organize",
      description: "Create legal documents, invite team members, and set up your first projects using our intuitive tools.",
      color: "purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      number: 3,
      title: "Scale & Succeed",
      description: "Track progress, get AI guidance, and focus on building your product while we handle the operational complexity.",
      color: "pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-8 lg:px-12 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
      
      <div className="max-w-[95%] 2xl:max-w-[1536px] mx-auto relative">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            How{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FoundX
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Three simple steps to transform your startup operations from chaotic to organized.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative text-center group transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div className={`absolute inset-0 ${step.bgColor} rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-300 opacity-50`} />
              
              <div className="relative p-8">
                <div className={`w-16 h-16 bg-${step.color} rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 ${
                  activeStep === index ? 'scale-110 shadow-2xl' : 'scale-100'
                }`}>
                  <span className="text-white font-bold text-xl">{step.number}</span>
                  <div className={`absolute inset-0 bg-${step.color} rounded-full blur-lg opacity-30 animate-pulse ${
                    activeStep === index ? 'scale-150' : 'scale-100'
                  } transition-transform duration-300`} />
                </div>
                
                <h3 className={`text-xl font-semibold text-slate-900 dark:text-white mb-4 transition-colors duration-300 ${
                  activeStep === index ? 'text-blue-600 dark:text-blue-400' : ''
                }`}>
                  {step.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className={`w-8 h-8 text-slate-300 dark:text-slate-600 transition-all duration-300 ${
                    activeStep === index ? 'text-blue-500 scale-125' : ''
                  }`} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12 space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeStep === index 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
