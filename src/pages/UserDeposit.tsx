import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Copy, Menu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';

interface DepositChannel {
  id: string;
  name: string;
  icon: string;
  minAmount: number;
  maxAmount: number;
  walletAddress: string;
  network: string;
}

const UserDeposit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedChannel, setSelectedChannel] = useState<DepositChannel>();
  const [rechargeAmount, setRechargeAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getCurrentUser();
  }, []);

  const depositChannels: DepositChannel[] = [
    {
      id: 'usdt-trc20',
      name: 'USDT TRC20',
      icon: '🪙',
      minAmount: 50.00,
      maxAmount: 20000.00,
      walletAddress: 'TLctpwiidVKKTSdU7Z5xXL4yaSLNSgPbXG',
      network: 'TRC20'
    },
    {
      id: 'usdt-erc20',
      name: 'USDT ERC20',
      icon: '🪙',
      minAmount: 50.00,
      maxAmount: 20000.00,
      walletAddress: '0x8892713CfeF534f2be03808b545aC46F39D8F3DC',
      network: 'ERC20'
    },
    {
      id: 'btc',
      name: 'BTC',
      icon: '₿',
      minAmount: 0.001,
      maxAmount: 1.0,
      walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      network: 'Bitcoin'
    }
  ];

  const predefinedAmounts = [100, 500, 1000, 5000, 10000, 20000];

  useEffect(() => {
    // Set default channel to USDT ERC20 to match the image
    const defaultChannel = depositChannels.find(c => c.id === 'usdt-erc20');
    if (defaultChannel) {
      setSelectedChannel(defaultChannel);
    }
  }, []);

  const handleCopyAddress = async () => {
    if (selectedChannel) {
      try {
        await navigator.clipboard.writeText(selectedChannel.walletAddress);
        toast({
          title: "Copied!",
          description: "Wallet address copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy address",
          variant: "destructive"
        });
      }
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'BTC') {
      return `${currency} ${amount}`;
    }
    return `USDT ${amount.toFixed(2)}`;
  };

  const handleAmountSelect = (amount: number) => {
    setRechargeAmount(amount.toString());
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value) || value === '') {
      setRechargeAmount(value);
    }
  };

  const getActualPayment = () => {
    const amount = parseFloat(rechargeAmount) || 0;
    return amount;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a deposit",
        variant: "destructive"
      });
      return;
    }

    if (!selectedChannel) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid recharge amount",
        variant: "destructive"
      });
      return;
    }

    if (amount < selectedChannel.minAmount || amount > selectedChannel.maxAmount) {
      const currency = selectedChannel.id === 'btc' ? 'BTC' : 'USDT';
      toast({
        title: "Amount Out of Range",
        description: `Amount must be between ${currency} ${selectedChannel.minAmount} and ${currency} ${selectedChannel.maxAmount}`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique order number
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substr(2, 6).toUpperCase();
      const orderNumber = `DEP${timestamp}${randomSuffix}`;

      // Get user phone number from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone_number, username')
        .eq('user_id', user.id)
        .single();

      const username = profile?.phone_number || profile?.username || user.email;
      // Create recharge record
      const { error } = await supabase
        .from('recharge_records')
        .insert({
          user_id: user.id,
          username: username,
          merchant_order_number: orderNumber,
          payment_methods: selectedChannel.name,
          recharge_amount: amount,
          recharge_status: 'Pending',
          payment_information: {
            wallet_address: selectedChannel.walletAddress,
            payment_method: selectedChannel.name,
            network: selectedChannel.network,
            currency: selectedChannel.id === 'btc' ? 'BTC' : 'USDT'
          }
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Deposit Request Submitted",
        description: `Your deposit request for ${selectedChannel.id === 'btc' ? 'BTC' : 'USDT'} ${amount} has been submitted successfully. Please send the payment to the wallet address above.`,
      });

      // Reset form
      setRechargeAmount('');

    } catch (error: any) {
      console.error('Deposit submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit deposit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateQRCode = (address: string) => {
    // Simple QR code placeholder - in production, you'd use a QR code library
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(address)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Deposit</h1>
          <Button
            variant="ghost"
            className="p-2 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Payment Method Selection */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-4">
            <Select 
              value={selectedChannel?.id || ""} 
              onValueChange={(value) => {
                const channel = depositChannels.find(c => c.id === value);
                if (channel) {
                  setSelectedChannel(channel);
                  setRechargeAmount(''); // Reset amount when changing channel
                }
              }}
            >
              <SelectTrigger className="w-full h-12 border-gray-200">
                <SelectValue placeholder="Select payment method">
                  {selectedChannel && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{selectedChannel.icon}</span>
                      <span className="font-medium text-gray-900">{selectedChannel.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {depositChannels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{channel.icon}</span>
                      <span className="font-medium">{channel.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Amount Limit */}
        {selectedChannel && (
          <div className="flex justify-between items-center px-1">
            <span className="text-sm text-gray-500">Amount limit</span>
            <span className="text-sm text-orange-500 font-medium">
              {formatAmount(selectedChannel.minAmount, selectedChannel.id === 'btc' ? 'BTC' : 'USDT')} ~ {formatAmount(selectedChannel.maxAmount, selectedChannel.id === 'btc' ? 'BTC' : 'USDT')}
            </span>
          </div>
        )}

        {/* Wallet Collection Code */}
        {selectedChannel && (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Wallet collection code</h3>
                
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={generateQRCode(selectedChannel.walletAddress)}
                      alt="Wallet QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-mono text-gray-800 break-all flex-1">
                      {selectedChannel.walletAddress}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="p-2 hover:bg-gray-200 flex-shrink-0"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recharge Amount */}
        {selectedChannel && (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <span className="text-sm font-medium text-gray-700">Recharge amount</span>
                
                {/* Input Field */}
                <Input
                  type="text"
                  placeholder={`Please enter the recharge amount ${selectedChannel.id === 'btc' ? 'BTC' : 'USDT'}`}
                  value={rechargeAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="h-12 text-right border-gray-200 text-gray-900"
                />

                {/* Predefined Amount Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => handleAmountSelect(amount)}
                      className={`h-10 border ${
                        rechargeAmount === amount.toString()
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>

                {/* Actual Payment */}
                <div className="flex items-center justify-between py-3 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Actual payment</span>
                  <span className="text-lg font-bold text-red-500">
                    {selectedChannel.id === 'btc' ? 'BTC' : 'USDT'} {getActualPayment().toFixed(selectedChannel.id === 'btc' ? 6 : 2)}
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !rechargeAmount || getActualPayment() <= 0}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDeposit;