import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Shield, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import buildingBg from "@/assets/building-background.jpg";
import LanguageSelector from "@/components/LanguageSelector";

const UserSignup = () => {
  const [formData, setFormData] = useState({
    inviteCode: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: t.registerFailed,
          description: t.passwordMismatch,
          variant: "destructive",
        });
        return;
      }

      if (!formData.phoneNumber || !formData.password) {
        toast({
          title: t.registerFailed,
          description: `${t.phoneNumberRequired} ${t.passwordRequired}`,
          variant: "destructive",
        });
        return;
      }

      // Clean and validate phone number
      const cleanPhone = formData.phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        toast({
          title: t.registerFailed,
          description: "Please enter a valid phone number",
          variant: "destructive",
        });
        return;
      }

      // Create email from phone number for Supabase auth
      const email = `${cleanPhone}@agodamall.com`;
      
      // Check if user already exists
      const { data: existingUser } = await supabase.auth.getUser();
      if (existingUser.user) {
        toast({
          title: t.registerFailed,
          description: t.accountExists,
          variant: "destructive",
        });
        return;
      }

      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: formData.password,
        options: {
          data: {
            username: cleanPhone,
            phone_number: cleanPhone,
            invitation_code: formData.inviteCode || null,
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: t.registerFailed,
          description: error.message || "Registration failed",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t.registerSuccess,
        description: "Account created successfully! You can now login.",
      });

      navigate("/user/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: t.registerFailed,
        description: error.message || "System error, please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${buildingBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-2">{t.agoda} MALL</h1>
          <p className="text-white/90 text-lg">{t.registerDescription}</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Invitation Code Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Shield className="w-5 h-5" />
              </div>
              <Input
                type="text"
                value={formData.inviteCode}
                onChange={(e) =>
                  setFormData({ ...formData, inviteCode: e.target.value })
                }
                placeholder="Invitation code"
                className="h-14 pl-12 pr-4 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-base"
              />
            </div>

            {/* Phone Number Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Phone className="w-5 h-5" />
              </div>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                placeholder={t.phoneNumber}
                required
                className="h-14 pl-12 pr-4 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-base"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={t.password}
                required
                className="h-14 pl-12 pr-12 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder={t.confirmPassword}
                required
                className="h-14 pl-12 pr-12 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-base"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-lg shadow-lg disabled:opacity-50 transition-all duration-200 mt-6"
            >
              {loading ? t.loading : t.submit}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">{t.alreadyHaveAccount} </span>
            <button
              onClick={() => navigate("/user/login")}
              className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              {t.goToLogin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;