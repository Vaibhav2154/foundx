"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Lightbulb,
  Target,
  FileText,
  DollarSign,
  Users,
  Code,
  Megaphone,
  Rocket,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function BuildStartupPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const steps = [
    {
      title: "Idea Generation and Validation",
      icon: Lightbulb,
      description: "Transform your innovative ideas into viable business concepts",
      details: [
        "Brainstorm and identify market problems",
        "Validate ideas through customer interviews",
        "Analyze problem-solution fit",
        "Create initial value proposition",
      ],
      tips: "Talk to at least 20 potential customers before moving forward",
    },
    {
      title: "Market Research and Analysis",
      icon: Target,
      description: "Deep dive into your target market and competitive landscape",
      details: [
        "Define target audience and personas",
        "Analyze competitor strategies and pricing",
        "Assess market size and growth potential",
        "Identify market gaps and opportunities",
      ],
      tips: "Use both primary research (surveys, interviews) and secondary research (reports, data)",
    },
    {
      title: "Business Plan Development",
      icon: FileText,
      description: "Create a comprehensive roadmap for your startup's success",
      details: [
        "Develop business model canvas",
        "Create financial projections and budgets",
        "Define revenue streams and pricing strategy",
        "Outline operational and organizational structure",
      ],
      tips: "Keep it concise but comprehensive - investors prefer clear, actionable plans",
    },
    {
      title: "Securing Funding",
      icon: DollarSign,
      description: "Raise capital to fuel your startup's growth and operations",
      details: [
        "Determine funding requirements and timeline",
        "Explore funding options (bootstrapping, angels, VCs)",
        "Prepare pitch deck and financial documents",
        "Network with investors and pitch your startup",
      ],
      tips: "Start building investor relationships early, even before you need funding",
    },
    {
      title: "Building a Team",
      icon: Users,
      description: "Assemble a talented team that shares your vision and values",
      details: [
        "Define key roles and responsibilities",
        "Recruit co-founders and early employees",
        "Establish company culture and values",
        "Create compensation and equity structures",
      ],
      tips: "Hire slowly and fire quickly - team chemistry is crucial for startup success",
    },
    {
      title: "Product Development",
      icon: Code,
      description: "Build your minimum viable product (MVP) and iterate based on feedback",
      details: [
        "Design user experience and interface",
        "Develop MVP with core features",
        "Conduct user testing and gather feedback",
        "Iterate and improve based on insights",
      ],
      tips: "Focus on solving one problem really well rather than building everything at once",
    },
    {
      title: "Marketing and Sales Strategy",
      icon: Megaphone,
      description: "Create awareness and drive customer acquisition",
      details: [
        "Develop brand identity and messaging",
        "Create content marketing strategy",
        "Build digital presence and social media",
        "Implement customer acquisition channels",
      ],
      tips: "Start marketing before your product is ready - build an audience early",
    },
    {
      title: "Launching Your Startup",
      icon: Rocket,
      description: "Execute your go-to-market strategy and scale operations",
      details: [
        "Plan and execute product launch",
        "Monitor key metrics and KPIs",
        "Gather customer feedback and testimonials",
        "Scale operations and prepare for growth",
      ],
      tips: "Launch early and often - perfect is the enemy of good in startup world",
    },
  ];

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  const toggleComplete = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const progressPercentage = (completedSteps.size / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Build Your Startup
          </h1>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto">
            Follow these steps to bring your startup vision to life.
          </p>
          {completedSteps.size > 0 && (
            <div className="max-w-md mx-auto mt-8">
              <div className="flex justify-between mb-1 text-sm text-gray-300">
                <span>Your Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="space-y-6 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isExpanded = expandedStep === index;
            const isCompleted = completedSteps.has(index);

            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group bg-gray-800/50 backdrop-blur-md rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${
                  isExpanded
                    ? "border-blue-500/50 ring-2 ring-blue-500/20 shadow-blue-500/25"
                    : "border-gray-700/50 hover:border-blue-500/30"
                } ${isCompleted ? "bg-green-500/10 border-green-500/30" : ""}`}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleStep(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 group-hover:shadow-lg"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          Step {index + 1}: {step.title}
                        </h3>
                        <p className="text-gray-300 text-sm">{step.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => toggleComplete(index, e)}
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400 hover:border-green-400"
                      }`}
                    >
                      {isCompleted && (
                        <CheckCircle className="w-4 h-4 text-white mx-auto" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.4 }}
                    className="px-6 pb-6"
                  >
                    <div className="ml-6 mt-2 space-y-4">
                      <h4 className="font-semibold text-blue-400">Activities</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
                        {step.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                      <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                        <h5 className="text-purple-400 font-medium mb-2">Pro Tip</h5>
                        <p className="text-gray-300 text-sm italic">{step.tips}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
           <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link 
                  href="/sign-in" 
                  className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Continue to Auth
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
        </motion.div>
      </div>
    </div>
  );
}
