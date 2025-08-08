
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home, ShoppingCart, Headphones, User, Zap } from 'lucide-react';

const RechargeRecord = () => {
  const navigate = useNavigate();

  const rechargeRecords = [
    { amount: '$1,000.00', time: '2025-05-02 16:51:12', status: 'Paid' },
    { amount: '$3,333,333.00', time: '2025-04-26 23:04:14', status: 'Paid' },
    { amount: '$500,001.00', time: '2025-03-28 11:11:43', status: 'Paid' },
    { amount: '$500.00', time: '2025-03-27 20:18:56', status: 'Paid' },
    { amount: '$10,000.00', time: '2025-03-27 01:49:06', status: 'Paid' },
    { amount: '$10,000.00', time: '2025-03-26 22:31:13', status: 'Paid' },
    { amount: '$20,000.00', time: '2025-03-26 22:26:32', status: 'Paid' },
  ];

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
          <h1 className="text-white text-lg font-medium">Recharge Record</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {rechargeRecords.map((record, index) => (
          <Card key={index} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Amount:</span>
                  <span className="font-medium text-gray-800">{record.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Application time:</span>
                  <span className="text-gray-800 text-sm">{record.time}</span>
                </div>
                <div className="text-left">
                  <span className="text-red-500 text-sm font-medium">{record.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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

export default RechargeRecord;
