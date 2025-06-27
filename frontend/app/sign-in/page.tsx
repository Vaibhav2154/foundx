export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Sign In</h1>
      <form className="flex flex-col space-y-4 w-full max-w-md">
        <input
          type="email"
          placeholder="Email"
          className="p-3 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 bg-gray-800 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition  duration-200"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account?{' '}
        <a href="/sign-up" className="text-blue-400 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
} 