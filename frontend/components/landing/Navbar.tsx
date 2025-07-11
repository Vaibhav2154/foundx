"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { navigate } = useNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-slate-900/90 shadow-lg' 
        : 'bg-white/80 dark:bg-slate-900/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              FoundX
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {[
              { label: "Features", id: "features" },
              { label: "How it Works", id: "how-it-works" },
              { label: "Pricing", id: "pricing" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors relative group"
              >
                {item.label}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            
            <button
              onClick={() => navigate("/sign-up")}
              className="group btn-primary relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              <span className="relative z-10">Sign Up</span>
            </button>
          </div>
          
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {[
                { label: "Features", id: "features" },
                { label: "How it Works", id: "how-it-works" },
                { label: "Pricing", id: "pricing" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => navigate("/sign-up")}
                className="btn-primary w-full mt-4"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}