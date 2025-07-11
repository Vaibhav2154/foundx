"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function BuildStartupPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState(new Set<number>());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      title: "Idea Generation and Validation",
      icon: Lightbulb,
      description: "Transform your innovative ideas into viable business concepts",
      duration: "2-4 weeks",
      difficulty: "Easy",
      details: [
        "Brainstorm and identify market problems",
        "Validate ideas through customer interviews",
        "Analyze problem-solution fit",
        "Create initial value proposition",
      ],
      tips: "Talk to at least 20 potential customers before moving forward",
      resources: ["Customer interview templates", "Problem validation framework", "Market research tools"],
    },
    {
      title: "Market Research and Analysis",
      icon: Target,
      description: "Deep dive into your target market and competitive landscape",
      duration: "3-5 weeks",
      difficulty: "Medium",
      details: [
        "Define target audience and personas",
        "Analyze competitor strategies and pricing",
        "Assess market size and growth potential",
        "Identify market gaps and opportunities",
      ],
      tips: "Use both primary research (surveys, interviews) and secondary research (reports, data)",
      resources: ["Market analysis templates", "Competitor research tools", "Survey platforms"],
    },
    {
      title: "Business Plan Development",
      icon: FileText,
      description: "Create a comprehensive roadmap for your startup's success",
      duration: "4-6 weeks",
      difficulty: "Hard",
      details: [
        "Develop business model canvas",
        "Create financial projections and budgets",
        "Define revenue streams and pricing strategy",
        "Outline operational and organizational structure",
      ],
      tips: "Keep it concise but comprehensive - investors prefer clear, actionable plans",
      resources: ["Business model canvas", "Financial projection templates", "Pitch deck templates"],
    },
    {
      title: "Securing Funding",
      icon: DollarSign,
      description: "Raise capital to fuel your startup's growth and operations",
      duration: "8-12 weeks",
      difficulty: "Hard",
      details: [
        "Determine funding requirements and timeline",
        "Explore funding options (bootstrapping, angels, VCs)",
        "Prepare pitch deck and financial documents",
        "Network with investors and pitch your startup",
      ],
      tips: "Start building investor relationships early, even before you need funding",
      resources: ["Investor database", "Pitch deck templates", "Legal documentation"],
    },
    {
      title: "Building a Team",
      icon: Users,
      description: "Assemble a talented team that shares your vision and values",
      duration: "6-10 weeks",
      difficulty: "Medium",
      details: [
        "Define key roles and responsibilities",
        "Recruit co-founders and early employees",
        "Establish company culture and values",
        "Create compensation and equity structures",
      ],
      tips: "Hire slowly and fire quickly - team chemistry is crucial for startup success",
      resources: ["Hiring frameworks", "Equity calculator", "Culture building guides"],
    },
    {
      title: "Product Development",
      icon: Code,
      description: "Build your minimum viable product (MVP) and iterate based on feedback",
      duration: "8-16 weeks",
      difficulty: "Hard",
      details: [
        "Design user experience and interface",
        "Develop MVP with core features",
        "Conduct user testing and gather feedback",
        "Iterate and improve based on insights",
      ],
      tips: "Focus on solving one problem really well rather than building everything at once",
      resources: ["Design tools", "Development frameworks", "User testing platforms"],
    },
    {
      title: "Marketing and Sales Strategy",
      icon: Megaphone,
      description: "Create awareness and drive customer acquisition",
      duration: "4-8 weeks",
      difficulty: "Medium",
      details: [
        "Develop brand identity and messaging",
        "Create content marketing strategy",
        "Build digital presence and social media",
        "Implement customer acquisition channels",
      ],
      tips: "Start marketing before your product is ready - build an audience early",
      resources: ["Marketing automation tools", "Social media templates", "Content calendar"],
    },
    {
      title: "Launching Your Startup",
      icon: Rocket,
      description: "Execute your go-to-market strategy and scale operations",
      duration: "2-4 weeks",
      difficulty: "Medium",
      details: [
        "Plan and execute product launch",
        "Monitor key metrics and KPIs",
        "Gather customer feedback and testimonials",
        "Scale operations and prepare for growth",
      ],
      tips: "Launch early and often - perfect is the enemy of good in startup world",
      resources: ["Launch checklists", "Analytics tools", "Customer feedback systems"],
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-400 bg-green-400/10";
      case "Medium": return "text-yellow-400 bg-yellow-400/10";
      case "Hard": return "text-red-400 bg-red-400/10";
      default: return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl mb-6 shadow-lg">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Build Your Startup
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Follow our comprehensive step-by-step guide to transform your idea into a successful startup. 
            Each step includes detailed activities, expert tips, and valuable resources.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{steps.length}</div>
              <div className="text-gray-400 text-sm">Total Steps</div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl mb-4 mx-auto">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">12-24</div>
              <div className="text-gray-400 text-sm">Weeks Timeline</div>
            </div>
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl mb-4 mx-auto">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">90%</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
          </div>

          {completedSteps.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto mt-8"
            >
              <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-2" />
                    <span className="text-white font-medium">Your Progress</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                  ></motion.div>
                </div>
                <div className="text-gray-400 text-sm">
                  {completedSteps.size} of {steps.length} steps completed
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="space-y-6 max-w-6xl mx-auto">
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
                className={`group bg-gray-800/50 backdrop-blur-lg rounded-3xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${
                  isExpanded
                    ? "border-blue-500/50 ring-2 ring-blue-500/20 shadow-blue-500/25"
                    : "border-gray-700/50 hover:border-blue-500/30"
                } ${isCompleted ? "bg-green-500/10 border-green-500/30" : ""}`}
              >
                <div
                  className="p-8 cursor-pointer"
                  onClick={() => toggleStep(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6 flex-1">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 group-hover:shadow-lg"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-8 h-8 text-white" />
                        ) : (
                          <Icon className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-2xl font-bold text-white">
                            Step {index + 1}: {step.title}
                          </h3>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(step.difficulty)}`}>
                              {step.difficulty}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium text-blue-400 bg-blue-400/10">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {step.duration}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-base leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => toggleComplete(index, e)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                          isCompleted
                            ? "bg-green-500 border-green-500"
                            : "border-gray-400 hover:border-green-400"
                        }`}
                      >
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </button>
                      <ChevronRight
                        className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="px-8 pb-8"
                    >
                      <div className="ml-6 grid md:grid-cols-2 gap-8">
                        {/* Activities */}
                        <div>
                          <h4 className="font-semibold text-blue-400 mb-4 flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            Key Activities
                          </h4>
                          <ul className="space-y-3 text-gray-300">
                            {step.details.map((detail, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-purple-400 mb-4 flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Helpful Resources
                          </h4>
                          <ul className="space-y-3 text-gray-300">
                            {step.resources.map((resource, i) => (
                              <li key={i} className="flex items-start">
                                <ArrowRight className="w-4 h-4 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{resource}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="ml-6 mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6 rounded-2xl border border-purple-500/20">
                        <h5 className="text-purple-400 font-medium mb-3 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Pro Tip
                        </h5>
                        <p className="text-gray-300 text-sm italic leading-relaxed">{step.tips}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-500/20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of entrepreneurs who have successfully built their startups using our proven methodology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link 
                href="/sign-up" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/sign-in" 
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 inline-flex items-center border border-white/20"
              >
                Continue Journey
                <Rocket className="w-5 h-5 ml-2 group-hover:translate-y-[-2px] transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
