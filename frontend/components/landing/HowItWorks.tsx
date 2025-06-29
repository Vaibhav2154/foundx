const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">How FoundX Works</h2>
                  <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                    Three simple steps to transform your startup operations from chaotic to organized.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Sign Up & Set Goals</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Tell us about your startup and what you want to accomplish. Our onboarding process takes just 2 minutes.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Generate & Organize</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Create legal documents, invite team members, and set up your first projects using our intuitive tools.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Scale & Succeed</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Track progress, get AI guidance, and focus on building your product while we handle the operational complexity.
                    </p>
                  </div>
                </div>
              </div>
            </section>
  );
};

export default HowItWorks;
