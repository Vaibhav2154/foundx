"use client";

import { FileText, CheckCircle, Users, Target, Bot, Shield, Zap, ArrowUpRight } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

export default function Features(){
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => [...prev, cardIndex]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = sectionRef.current?.querySelectorAll('.feature-card');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Legal Document Generator",
      description: "Generate NDAs, founder agreements, and freelance contracts with plain-English explanations for every clause.",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:border-blue-300 dark:hover:border-blue-600",
      benefits: [
        "Customizable templates",
        "Export as PDF/DOCX", 
        "Legal clause explanations"
      ]
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Add team members, assign roles, and maintain decision logs to keep everyone aligned and accountable.",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:border-purple-300 dark:hover:border-purple-600",
      benefits: [
        "Role-based permissions",
        "Decision tracking",
        "Email invitations"
      ]
    },
    {
      icon: Target,
      title: "Project & Task Tracker",
      description: "Organize projects into sprints, track tasks with Kanban boards, and never miss important deadlines.",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:border-green-300 dark:hover:border-green-600",
      benefits: [
        "Kanban & list views",
        "Priority & status tags",
        "Due date tracking"
      ]
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get instant answers to legal, operational, and funding questions with our specialized startup AI assistant.",
      color: "from-orange-500 to-orange-600",
      hoverColor: "hover:border-orange-300 dark:hover:border-orange-600",
      benefits: [
        "Startup-focused knowledge",
        "24/7 availability",
        "Context-aware responses"
      ]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with encrypted data storage and compliance tracking for peace of mind.",
      color: "from-red-500 to-red-600",
      hoverColor: "hover:border-red-300 dark:hover:border-red-600",
      benefits: [
        "End-to-end encryption",
        "Compliance tracking",
        "Regular backups"
      ]
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get up and running in minutes with our guided onboarding process designed for non-technical founders.",
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "hover:border-indigo-300 dark:hover:border-indigo-600",
      benefits: [
        "Guided onboarding",
        "Template library",
        "Mobile-friendly"
      ]
    }
  ];

  return (
    <section ref={sectionRef} id="features" className="py-20 px-4 sm:px-8 lg:px-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
      <div className="max-w-[95%] 2xl:max-w-[1536px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Launch
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Built specifically for early-stage founders who need to move fast without getting bogged down by complex tools.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const isVisible = visibleCards.includes(index);
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                data-index={index}
                className={`feature-card group relative p-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm ${feature.hoverColor} hover:shadow-xl transition-all duration-500 cursor-pointer transform ${
                  isVisible 
                    ? 'translate-y-0 opacity-100 scale-100' 
                    : 'translate-y-10 opacity-0 scale-95'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li 
                        key={benefitIndex}
                        className="flex items-center text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
                        style={{
                          transitionDelay: `${(index * 100) + (benefitIndex * 50)}ms`
                        }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 group-hover:scale-110 transition-transform" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`absolute -inset-px bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}
