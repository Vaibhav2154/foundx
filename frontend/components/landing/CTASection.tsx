import React from "react";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Startup?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of founders who have simplified their startup operations with FoundX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold text-lg">
                Schedule Demo
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-6">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </section>
        );
};

export default CTASection;