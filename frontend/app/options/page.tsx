"use client";
import { useState, useEffect } from 'react';
import { Rocket, Users, TrendingUp, Lightbulb, ArrowRight, CheckCircle, Star, Zap, Target, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OptionsPage() {
  const [, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const pathOptions = [
    {
      id: 'experienced',
      title: 'I\'m an Experienced Founder',
      description: 'You\'ve been through the startup journey before and are looking for advanced tools and insights to scale your current venture.',
      icon: TrendingUp,
      color: 'bg-blue-600',
      hoverColor: 'bg-blue-700',
      borderColor: 'border-blue-500/50',
      shadowColor: 'shadow-blue-500/25',
      href: '/sign-in',
      badge: 'Advanced',
      features: [
        'Access advanced analytics and metrics',
        'Connect with investor networks',
        'Scale-focused resources and tools',
        'Mentorship opportunities',
        'Enterprise-grade security features'
      ]
    },
    {
      id: 'beginner',
      title: 'I\'m Starting My First Startup',
      description: 'You\'re new to the startup world and need comprehensive guidance to turn your idea into a successful business.',
      icon: Lightbulb,
      color: 'bg-green-600',
      hoverColor: 'bg-green-700',
      borderColor: 'border-green-500/50',
      shadowColor: 'shadow-green-500/25',
      href: '/build-startup',
      badge: 'Beginner Friendly',
      features: [
        'Step-by-step startup building guide',
        'Beginner-friendly resources and templates',
        'Idea validation and market research tools',
        'Community support and networking',
        '24/7 expert guidance and tutorials'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-blue-600 leading-tight">
            Choose Your Path
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed mb-4">
            Tell us about your startup experience so we can provide the most relevant guidance for your entrepreneurial journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl w-full">
          {pathOptions.map((option, index) => {
            const Icon = option.icon;
            const isHovered = hoveredCard === index;
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative bg-white dark:bg-slate-800 backdrop-blur-lg rounded-3xl border ${option.borderColor} p-8 hover:${option.shadowColor} hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-opacity-100`}
              >
                <div className="absolute -top-3 left-8">
                  <span className={`${option.color} text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg`}>
                    {option.badge}
                  </span>
                </div>

                <div className="text-center mb-8 pt-4">
                  <motion.div 
                    animate={{ 
                      scale: isHovered ? 1.1 : 1,
                      rotate: isHovered ? 5 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-24 h-24 ${option.color} rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
                  >
                    <Icon className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white leading-tight">
                    {option.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                    {option.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {option.features.map((feature, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + i * 0.1 }}
                      className="flex items-start text-sm text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-slate-100 dark:bg-gray-700/30 rounded-2xl p-4 mb-8 border border-gray-300 dark:border-gray-600/30">
                  <div className="flex items-center mb-2">
                    <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium text-sm">Most Popular Features</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      AI-Powered Insights
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Expert Mentorship
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      Template Library
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                      Community Access
                    </div>
                  </div>
                </div>

                <motion.a 
                  href={option.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group/btn w-full ${option.hoverColor} text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl relative overflow-hidden`}
                >
                  <span className="relative z-10 flex items-center">
                    {option.id === 'experienced' ? 'Continue as Experienced Founder' : 'Start Building My First Startup'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-600"></div>
                </motion.a>

                <div className="absolute top-4 right-4 opacity-20">
                  {option.id === 'experienced' ? 
                    <Crown className="w-6 h-6 text-blue-500" /> : 
                    <Rocket className="w-6 h-6 text-green-500" />
                  }
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-300 dark:border-gray-700/50 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full border-2 border-white dark:border-gray-800"></div>
                <div className="w-8 h-8 bg-green-600 rounded-full border-2 border-white dark:border-gray-800"></div>
                <div className="w-8 h-8 bg-purple-600 rounded-full border-2 border-white dark:border-gray-800"></div>
                <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Join a community of successful entrepreneurs who started exactly where you are today.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}