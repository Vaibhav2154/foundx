// import Features from "@/components/landing/Features";
import Intro from "@/components/landing/Intro";
import Navbar from "@/components/landing/Navbar";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonial from "@/components/landing/Testimonial";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import { ArrowRight, Shield, Users, CheckCircle, Zap, FileText, MessageSquare, Target, Star, Bot, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="relative">
        <Intro />
        {/* <Features /> */}
        <HowItWorks />
        <Testimonial />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
