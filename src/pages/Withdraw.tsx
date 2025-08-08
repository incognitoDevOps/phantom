
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home, ShoppingCart, Headphones, User, Zap } from 'lucide-react';

const Withdraw = () => {
  const navigate = useNavigate();
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalPassword, setWithdrawalPassword] = useState('');

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
          <h1 className="text-white text-lg font-medium">Withdraw</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Account Balance */}
        <Card className="bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-2">$5,186,079.00</div>
            <div className="text-sm opacity-90">Account Balance</div>
          </CardContent>
        </Card>

        {/* Phone Number */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">cellphone number</span>
              <span className="text-gray-800">13800000000</span>
            </div>
          </CardContent>
        </Card>

        {/* Bank Account Selection */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="mb-3">
              <span className="text-gray-800 font-medium">Please select a bank account</span>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="bank-account" 
                name="bank-account" 
                defaultChecked 
                className="text-blue-500"
              />
              <label htmlFor="bank-account" className="text-gray-700">
                Card Number Type: BANK - 12313132131
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">WITHDRAWAL AMOUNT</h3>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Withdrawal amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Withdrawal Password"
                  value={withdrawalPassword}
                  onChange={(e) => setWithdrawalPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fee Information */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">HANDLING FEE:</span>
                <span>$0.00 (0%)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ACTUALLY ARRIVED:</span>
                <span>USDT 0.00</span>
              </div>
            </div>
          </CardContent>
        </Card>
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

export default Withdraw;
