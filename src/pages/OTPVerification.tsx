import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import buildingBg from '@/assets/building-background.jpg';
import LanguageSelector from '@/components/LanguageSelector';

interface LocationState {
  phoneNumber: string;
  password: string;
  inviteCode?: string;
  purpose: 'registration' | 'login';
}

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.phoneNumber) {
      navigate('/user/login');
      return;
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const sendOTP = async (phoneNumber: string, purpose: string) => {
    try {
      const { data, error } = await supabase.rpc('send_otp', {
        phone_number: phoneNumber,
        purpose: purpose
      });

      if (error) throw error;

      // In development, show the OTP code
      if (data?.otp_code) {
        toast({
          title: "OTP Sent (Development)",
          description: `Your OTP code is: ${data.otp_code}`,
          duration: 10000,
        });
      } else {
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${phoneNumber}`,
        });
      }

      return true;
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    const success = await sendOTP(state.phoneNumber, state.purpose);
    
    if (success) {
      setCountdown(60);
      setCanResend(false);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    setResendLoading(false);
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Verify OTP
      const { data: verifyResult, error: verifyError } = await supabase.rpc('verify_otp', {
        phone_number: state.phoneNumber,
        otp_code: otpCode,
        purpose: state.purpose
      });

      if (verifyError) throw verifyError;

      if (!verifyResult?.success) {
        toast({
          title: "Verification Failed",
          description: verifyResult?.message || "Invalid OTP code",
          variant: "destructive",
        });
        return;
      }

      if (state.purpose === 'registration') {
        // Create user after successful OTP verification
        const { data: createResult, error: createError } = await supabase.rpc('create_user_after_otp', {
          phone_number: state.phoneNumber,
          password: state.password,
          invitation_code: state.inviteCode || null
        });

        if (createError) throw createError;

        if (!createResult?.success) {
          toast({
            title: "Registration Failed",
            description: createResult?.message || "Failed to create account",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: t.registerSuccess,
          description: "Account created successfully! Please login.",
        });

        navigate('/user/login');
      } else if (state.purpose === 'login') {
        // Handle login after OTP verification
        const { data: authResult, error: authError } = await supabase.rpc('authenticate_user', {
          phone_number: state.phoneNumber,
          password: state.password
        });

        if (authError) throw authError;

        if (!authResult?.success) {
          toast({
            title: "Login Failed",
            description: authResult?.message || "Authentication failed",
            variant: "destructive",
          });
          return;
        }

        // Sign in with Supabase Auth
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: authResult.email,
          password: state.password,
        });

        if (signInError) throw signInError;

        // Set user session
        localStorage.setItem('userAuthenticated', 'true');
        localStorage.setItem('userPhone', state.phoneNumber);
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('userId', authResult.user_id);

        toast({
          title: t.loginSuccess,
          description: t.welcome,
        });

        navigate('/user/dashboard');
      }

    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
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

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/10 p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">Verify Your Phone</h1>
          <p className="text-white/90 text-lg">
            We've sent a 6-digit code to
          </p>
          <p className="text-white font-medium text-lg">
            {formatPhoneNumber(state?.phoneNumber || '')}
          </p>
        </div>

        {/* OTP Form */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0"
                />
              ))}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-lg shadow-lg disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>

            {/* Resend Section */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Didn't receive the code?
              </p>
              {canResend ? (
                <Button
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                  variant="ghost"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  {resendLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend Code'
                  )}
                </Button>
              ) : (
                <p className="text-gray-500 text-sm">
                  Resend code in {countdown}s
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm">
            Enter the 6-digit verification code sent to your phone
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;