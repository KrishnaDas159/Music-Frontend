import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Get form data manually OR use useState to track input
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
  
    try {
      const response = await fetch("https://music-backend-final.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Login failed");
      }
  
      const data = await response.json();
  
      // Example: Save token or user data
      localStorage.setItem("token", data.token);
  
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen watercolor-secondary-bg relative overflow-hidden flex items-center justify-center p-6">
      {/* Ambient background effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-yellow-400/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-radial from-blue-400/25 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="glass-panel rounded-3xl p-8 w-full max-w-md glow-golden float relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your music platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="email"
                type="email"
                placeholder="Email address"
                className={`pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                  focusedField === "email" 
                    ? "border-yellow-500 glow-golden" 
                    : "border-gray-200 hover:border-yellow-300"
                }`}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
                  focusedField === "password" 
                    ? "border-yellow-500 glow-golden" 
                    : "border-gray-200 hover:border-yellow-300"
                }`}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-lg bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white shadow-xl glow-golden liquid-glow"
          >
            Login
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            New here?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-yellow-600 hover:text-yellow-700 font-medium liquid-glow"
            >
              Sign up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;