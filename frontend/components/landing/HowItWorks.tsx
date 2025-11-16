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
      color: "slate-900",
      bgColor: "bg-white/10"
    },
    {
      number: 2,
      title: "Generate & Organize",
      description: "Create legal documents, invite team members, and set up your first projects using our intuitive tools.",
      color: "slate-900",
      bgColor: "bg-white/10"
    },
    {
      number: 3,
      title: "Scale & Succeed",
      description: "Track progress, get AI guidance, and focus on building your product while we handle the operational complexity.",
      color: "slate-900",
      bgColor: "bg-white/10"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-8 lg:px-12 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      
      <div className="max-w-[95%] 2xl:max-w-[1536px] mx-auto relative">
        <div className={`text-center mb-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How{" "}
            <span className="text-white">
              FoundX
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
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
                <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-300 ${
                  activeStep === index ? 'scale-110 shadow-2xl' : 'scale-100'
                }`}>
                  <span className="text-black font-bold text-xl">{step.number}</span>
                  <div className={`absolute inset-0 bg-white rounded-full blur-lg opacity-30 animate-pulse ${
                    activeStep === index ? 'scale-150' : 'scale-100'
                  } transition-transform duration-300`} />
                </div>
                
                <h3 className={`text-xl font-semibold text-white mb-4 transition-colors duration-300 ${
                  activeStep === index ? 'text-white' : ''
                }`}>
                  {step.title}
                </h3>
                
                <p className="text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ChevronRight className={`w-8 h-8 text-slate-400 transition-all duration-300 ${
                    activeStep === index ? 'text-white scale-125' : ''
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
                  ? 'bg-white scale-125' 
                  : 'bg-slate-600 hover:bg-slate-500'
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
