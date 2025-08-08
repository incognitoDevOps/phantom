
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Home, ShoppingCart, Headphones, User, Zap } from 'lucide-react';

const TransactionRecord = () => {
  const navigate = useNavigate();

  const transactionRecords = [
    {
      type: 'Order grab commission',
      previousAmount: '$4,763,687.81',
      changeAmount: '$422,391.19',
      afterAmount: '$5,186,079.00',
      time: '2025-05-04 19:01:03'
    },
    {
      type: 'Order grab commission',
      previousAmount: '$4,732,160.99',
      changeAmount: '$31,526.82',
      afterAmount: '$4,763,687.81',
      time: '2025-05-04 19:00:56'
    },
    {
      type: 'Order grab commission',
      previousAmount: '$4,701,187.27',
      changeAmount: '$30,973.72',
      afterAmount: '$4,732,160.99',
      time: '2025-05-04 15:44:15'
    },
    {
      type: 'Order grab commission',
      previousAmount: '$4,672,979.06',
      changeAmount: '$28,208.21',
      afterAmount: '$4,701,187.27',
      time: '2025-05-04 15:43:29'
    },
    {
      type: 'Order grab commission',
      previousAmount: '$4,641,452.24',
      changeAmount: '$31,526.82',
      afterAmount: '$4,672,979.06',
      time: '2025-05-04 14:02:34'
    },
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
          <h1 className="text-white text-lg font-medium">Transaction Record</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {transactionRecords.map((record, index) => (
          <Card key={index} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account change type:</span>
                  <span className="text-red-500 font-medium">{record.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Previous amount:</span>
                  <span className="text-gray-800">{record.previousAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account change amount:</span>
                  <span className="text-red-500 font-medium">{record.changeAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount after:</span>
                  <span className="text-gray-800">{record.afterAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account change time:</span>
                  <span className="text-gray-800">{record.time}</span>
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

export default TransactionRecord;
