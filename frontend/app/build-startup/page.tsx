import Link from 'next/link';

export default function BuildStartupPage() {
  const steps = [
    "Step 1: Idea Generation and Validation",
    "Step 2: Market Research and Analysis",
    "Step 3: Business Plan Development",
    "Step 4: Securing Funding",
    "Step 5: Building a Team",
    "Step 6: Product Development",
    "Step 7: Marketing and Sales Strategy",
    "Step 8: Launching Your Startup",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Steps to Build Your Startup</h1>
      <div className="flex flex-col space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="p-4 bg-gray-800 rounded-md">
            {step}
          </div>
        ))}
      </div>
      <Link href="/sign-in" className="mt-8 px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700">
          Continue to Auth
      </Link>
    </div>
  );
}
