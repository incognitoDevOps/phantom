
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home, ShoppingCart, Headphones, User, Zap } from 'lucide-react';

const WithdrawalInformation = () => {
  const navigate = useNavigate();

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
          <h1 className="text-white text-lg font-medium">Withdrawal Information</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Card Number Type:</span>
                <span className="text-gray-800">BANK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Name:</span>
                <span className="text-gray-800">1111</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Account:</span>
                <span className="text-gray-800">12313132131</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reserve mobile phone number:</span>
                <span className="text-gray-800">11</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IFSC account:</span>
                <span className="text-gray-800">12121221</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3">
          Add
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
            className="flex flex-col items-center justify-center text-blue-500"
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

export default WithdrawalInformation;
