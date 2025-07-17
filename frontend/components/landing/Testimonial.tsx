import React from "react";
import { Star } from "lucide-react";

const Testimonial = () => {
  return (
    <section className="py-20 px-4 sm:px-8 lg:px-12 bg-white dark:bg-slate-800">
          <div className="max-w-[95%] 2xl:max-w-[1536px] mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <blockquote className="text-2xl font-medium text-slate-900 dark:text-white mb-6">
              "FoundX saved us months of legal back-and-forth and gave us the structure we needed to scale our team from 2 to 10 people seamlessly."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="text-left">
                <div className="font-semibold text-slate-900 dark:text-white">Sarah Chen</div>
                <div className="text-slate-600 dark:text-slate-300">Co-founder, TechFlow</div>
              </div>
            </div>
          </div>
        </section>
          );
};

export default Testimonial;
