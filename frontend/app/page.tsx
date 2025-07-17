"use client";

import { useState, useEffect } from "react";
import Intro from "@/components/landing/Intro";
import Navbar from "@/components/landing/Navbar";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonial from "@/components/landing/Testimonial";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import Features from "@/components/landing/Fetures";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/startup');
    }
  }, [isAuthenticated, isLoading, router]);

  
  if (isLoading) return null;

  return (
    <div className="min-h-screen overflow-hidden">
      <div 
        className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-purple-100 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20 opacity-50" />
      
      <div className="relative z-10 text-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="relative z-20 pt-16 px-0">
          <Intro />
          <Features />
          <HowItWorks />
          <Testimonial />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
