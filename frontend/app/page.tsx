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
    <div className="min-h-screen overflow-hidden bg-black dark:bg-black">
      <div 
        className="fixed inset-0 bg-black dark:bg-black"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      <div className="relative z-10 text-white">
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
