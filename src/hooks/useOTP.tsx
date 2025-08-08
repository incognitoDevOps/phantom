import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OTPHook {
  sendOTP: (phoneNumber: string, purpose?: string) => Promise<boolean>;
  verifyOTP: (phoneNumber: string, otpCode: string, purpose?: string) => Promise<boolean>;
  createUserAfterOTP: (phoneNumber: string, password: string, inviteCode?: string) => Promise<boolean>;
  loading: boolean;
}

export const useOTP = (): OTPHook => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendOTP = async (phoneNumber: string, purpose: string = 'registration'): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('send_otp', {
        phone_number: phoneNumber,
        purpose: purpose
      });

      if (error) throw error;

      if (data?.success) {
        // In development, show the OTP code
        if (data.otp_code) {
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
      } else {
        toast({
          title: "Failed to Send OTP",
          description: data?.message || "Please try again",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, otpCode: string, purpose: string = 'registration'): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('verify_otp', {
        phone_number: phoneNumber,
        otp_code: otpCode,
        purpose: purpose
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "OTP Verified",
          description: "Phone number verified successfully",
        });
        return true;
      } else {
        toast({
          title: "Verification Failed",
          description: data?.message || "Invalid OTP code",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createUserAfterOTP = async (phoneNumber: string, password: string, inviteCode?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_user_after_otp', {
        phone_number: phoneNumber,
        password: password,
        invitation_code: inviteCode || null
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Account Created",
          description: "Your account has been created successfully",
        });
        return true;
      } else {
        toast({
          title: "Registration Failed",
          description: data?.message || "Failed to create account",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Create user error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOTP,
    verifyOTP,
    createUserAfterOTP,
    loading
  };
};