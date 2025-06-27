import Link from 'next/link';

export default function OptionsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Choose Your Path</h1>
      <div className="flex space-x-4">
        <Link href="/sign-in" className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700">
          Already have a running startup
        </Link>
        <Link href="/build-startup" className="px-6 py-3 bg-green-600 rounded-md hover:bg-green-700">
          Planning to create new startup
        </Link>
      </div>
    </div>
  );
}
