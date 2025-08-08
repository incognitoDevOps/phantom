
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Home, ShoppingCart, Headphones, User, Zap, CreditCard, Wallet, Building2, Smartphone, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddBalance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const paymentMethods = [
    { id: 'credit-card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: Wallet },
    { id: 'bank-transfer', name: 'Bank Transfer', icon: Building2 },
    { id: 'mobile-payment', name: 'Mobile Payment', icon: Smartphone },
    { id: 'crypto', name: 'Cryptocurrency', icon: Globe },
  ];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleRecharge = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to recharge",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
    toast({
      title: "Recharge Initiated",
      description: `Recharge of $${amount} via ${selectedMethod?.name} has been initiated`,
    });
    
    // Here you would typically integrate with a payment gateway
    setTimeout(() => {
      navigate('/user/profile');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/user/profile')}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-white text-lg font-medium">Add Balance</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Current Balance */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Current Balance</div>
              <div className="text-2xl font-bold text-gray-800">$5,186,079.00</div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 text-lg"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      onClick={() => handleQuickAmount(value)}
                      className="text-sm"
                    >
                      ${value}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Payment Method</h3>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Select payment method">
                    {selectedPaymentMethod && (
                      <div className="flex items-center gap-3">
                        {(() => {
                          const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
                          const IconComponent = selectedMethod?.icon;
                          return (
                            <>
                              {IconComponent && <IconComponent className="w-5 h-5 text-blue-500" />}
                              <span className="text-sm">{selectedMethod?.name}</span>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-3">
                        <method.icon className="w-5 h-5 text-blue-500" />
                        <span>{method.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Recharge Button */}
        <Button 
          onClick={handleRecharge}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 text-lg"
        >
          Recharge Now
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          <button 
            onClick={() => navigate('/user/dashboard')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => navigate('/user/order')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">Order</span>
          </button>
          <button className="flex flex-col items-center justify-center">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-1">
              <Zap className="w-6 h-6" />
            </div>
          </button>
          <button 
            onClick={() => navigate('/user/service')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <Headphones className="w-5 h-5 mb-1" />
            <span className="text-xs">Service</span>
          </button>
          <button 
            onClick={() => navigate('/user/profile')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Mine</span>
          </button>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-16"></div>
    </div>
  );
};

export default AddBalance;
