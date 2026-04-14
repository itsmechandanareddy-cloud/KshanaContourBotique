import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_869a086f-518b-43e3-a2ba-4fade532d0ef/artifacts/af1ehik2_image.png";

const AdminLogin = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("Please fill all fields");
      return;
    }
    
    setLoading(true);
    const result = await login(phone, password, true);
    setLoading(false);
    
    if (result.success) {
      toast.success("Welcome back!");
      navigate("/admin");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FDFBF7]">
      {/* Left side - Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1753162658094-86e570c6a707?w=1200')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D2420]/70 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-5xl font-light mb-4">
              Admin Portal
            </h1>
            <p className="text-lg text-white/80 max-w-md">
              Manage your boutique, track orders, and grow your business with our comprehensive dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md border-[#EFEBE4] shadow-[0_4px_24px_-8px_rgba(139,102,85,0.08)]">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#C05C3B]/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#C05C3B]" strokeWidth={1.5} />
            </div>
            <div>
              <CardTitle className="font-['Cormorant_Garamond'] text-3xl font-medium text-[#2D2420]">
                Admin Login
              </CardTitle>
              <CardDescription className="text-[#8A7D76] mt-2">
                Sign in to manage your boutique
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#5C504A] font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#F7F2EB] border-transparent focus:bg-white focus:border-[#C05C3B] focus:ring-2 focus:ring-[#C05C3B]/20 rounded-xl h-12"
                  data-testid="admin-phone-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#5C504A] font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#F7F2EB] border-transparent focus:bg-white focus:border-[#C05C3B] focus:ring-2 focus:ring-[#C05C3B]/20 rounded-xl h-12 pr-12"
                    data-testid="admin-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7D76] hover:text-[#5C504A]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C05C3B] hover:bg-[#A84C2F] text-white rounded-full h-12 text-base font-medium shadow-[0_4px_12px_rgba(192,92,59,0.25)] hover:shadow-[0_6px_16px_rgba(192,92,59,0.35)] transition-all"
                data-testid="admin-login-button"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <a
                href="/login"
                className="text-sm text-[#C05C3B] hover:text-[#A84C2F] transition-colors"
              >
                Customer Login
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile back button */}
      <button 
        onClick={() => navigate("/")}
        className="lg:hidden fixed top-4 left-4 p-2 bg-white rounded-full shadow-md"
      >
        <ArrowLeft className="w-5 h-5 text-[#2D2420]" />
      </button>
    </div>
  );
};

export default AdminLogin;
