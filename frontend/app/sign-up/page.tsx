"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/utils/toast";
import { API_BASE_URL } from "@/config/constants";
import { useNavigation } from "@/contexts/NavigationContext";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, UserPlus, Sparkles, Check } from "lucide-react";

export default function SignUpPage() {
  const [form, setForm] = useState({
    fullName:"",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const router = useRouter();
  const { navigate } = useNavigation();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (form.password.length >= 6) strength += 1;
    if (form.password.match(/[a-z]/)) strength += 1;
    if (form.password.match(/[A-Z]/)) strength += 1;
    if (form.password.match(/[0-9]/)) strength += 1;
    if (form.password.match(/[^a-zA-Z0-9]/)) strength += 1;
    setPasswordStrength(strength);
  }, [form.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.fullName || !form.username || !form.email || !form.password || !form.confirmPassword) {
      showError("Please fill in all fields.");  
      return;
    }
    if (form.password !== form.confirmPassword) {
      showError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
        showError("Password must be at least 6 characters long.");
        return;
      }

    setIsLoading(true);
    try{
      const response = await fetch(`${API_BASE_URL}/users/register`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register. Please try again.");
      }
      
      const data = await response.json();
      console.log("Registration response:", data);
      showSuccess("Registration successful!");
      navigate("/sign-in");
    } catch (error) {
      console.error("Error during registration:", error);
      showError("An error occurred while creating your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-yellow-500";
    if (passwordStrength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className={`w-full max-w-md transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Join FoundX
            </h1>
            <p className="text-gray-300">Create your account and start building</p>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Password strength</span>
                      <span className={`font-medium ${passwordStrength >= 4 ? 'text-green-400' : passwordStrength >= 3 ? 'text-blue-400' : passwordStrength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.confirmPassword && (
                  <div className="flex items-center text-xs">
                    {form.password === form.confirmPassword ? (
                      <div className="flex items-center text-green-400">
                        <Check className="w-3 h-3 mr-1" />
                        Passwords match
                      </div>
                    ) : (
                      <div className="text-red-400">Passwords don't match</div>
                    )}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-400">
                By creating an account, you agree to our{" "}
                <Link href="#" className="text-green-400 hover:text-green-300 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-green-400 hover:text-green-300 transition-colors">
                  Privacy Policy
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-sm text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-green-400 hover:text-green-300 font-medium transition-colors inline-flex items-center"
              >
                Sign in
                <Sparkles className="w-4 h-4 ml-1" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
           
}
