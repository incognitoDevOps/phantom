
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import buildingBg from '@/assets/building-background.jpg';

const UserLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!phoneNumber || !password) {
        toast({
          title: t.loginFailed,
          description: `${t.phoneNumberRequired} ${t.passwordRequired}`,
          variant: "destructive",
        });
        return;
      }

      // Clean phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        toast({
          title: t.loginFailed,
          description: "Please enter a valid phone number",
          variant: "destructive",
        });
        return;
      }

      // First authenticate with our custom function
      const { data: authResult, error: authError } = await supabase.rpc('authenticate_user', {
        phone_number: cleanPhone,
        password: password
      });

      if (authError) throw authError;

      if (!authResult?.success) {
        toast({
          title: t.loginFailed,
          description: authResult?.message || "Invalid phone number or password",
          variant: "destructive",
        });
        return;
      }

      // Now sign in with Supabase Auth using the email
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: authResult.email,
        password: password,
      });

      if (signInError) {
        console.error('Supabase sign in error:', signInError);
        toast({
          title: t.loginFailed,
          description: "Authentication failed",
          variant: "destructive",
        });
        return;
      }

      // Set user session
      localStorage.setItem('userAuthenticated', 'true');
      localStorage.setItem('userPhone', cleanPhone);
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('userId', authResult.user_id);
      
      toast({
        title: t.loginSuccess,
        description: t.welcome,
      });
      
      navigate('/user/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t.loginFailed,
        description: "System error, please try again later",
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
        backgroundSize: 'cover',
        backgroundPosition: 'center'
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
          <h1 className="text-white text-4xl font-bold mb-2">
            {t.loginTitle}
          </h1>
          <p className="text-white/90 text-lg">
            {t.loginDescription}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone Number Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Phone className="w-5 h-5" />
              </div>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.password}
                required
                className="h-14 pl-12 pr-12 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-lg shadow-lg disabled:opacity-50 transition-all duration-200 mt-6"
            >
              {loading ? t.loading : t.login}
            </Button>
          </form>


          {/* Register Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">{t.dontHaveAccount} </span>
            <button
              onClick={() => navigate('/user/signup')}
              className="text-orange-500 font-medium hover:text-orange-600 transition-colors"
            >
              {t.goToRegister}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
