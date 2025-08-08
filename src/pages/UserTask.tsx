import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, ShoppingCart, Headphones, User, Star, Calendar, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';

interface TaskOrder {
  id: string;
  order_number: string;
  hotel_name: string;
  room_type: string;
  task_progress: string;
  order_quantity: number;
  order_price: number;
  commission: number;
  timestamp: string;
  rating: number;
  status: string;
  image_url: string;
}

const UserTask = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [accountBalance, setAccountBalance] = useState(2316.67);
  const [taskOrders, setTaskOrders] = useState<TaskOrder[]>([]);
  const [completedTasks, setCompletedTasks] = useState(24);
  const [totalTasks, setTotalTasks] = useState(30);

  useEffect(() => {
    fetchTaskOrders();
  }, []);

  const fetchTaskOrders = async () => {
    // Mock data based on screenshots
    const mockOrders: TaskOrder[] = [
      {
        id: '1',
        order_number: 'O19110822113269526850',
        hotel_name: 'Mandarin Oriental Hyde Park, London',
        room_type: 'Deluxe family room',
        task_progress: '1 / 1',
        order_quantity: 2,
        order_price: 2293.73,
        commission: 22.94,
        timestamp: '2025-04-12 17:41:20',
        rating: 5,
        status: 'Submitted',
        image_url: '/lovable-uploads/44785370-6bb3-4e35-b3c9-606908465843.png'
      },
      {
        id: '2',
        order_number: 'O19105092180747722306',
        hotel_name: 'Bvlgari Hotel London',
        room_type: 'Deluxe family room',
        task_progress: '1 / 1',
        order_quantity: 6,
        order_price: 2171.99,
        commission: 21.72,
        timestamp: '2025-04-11 03:44:28',
        rating: 4,
        status: 'Submitted',
        image_url: '/lovable-uploads/bc8b10bb-eb5f-405f-a420-3005319f0897.png'
      },
      {
        id: '3',
        order_number: 'O19105084996785274889',
        hotel_name: 'Comfotel PRPL Standard Single Room',
        room_type: 'Standard Single Room',
        task_progress: '1 / 1',
        order_quantity: 6,
        order_price: 2150.49,
        commission: 21.50,
        timestamp: '2025-04-11 03:44:28',
        rating: 4,
        status: 'Submitted',
        image_url: '/lovable-uploads/c8a5e717-f6e2-40cd-b0aa-6596ff6ae0ae.png'
      },
      {
        id: '4',
        order_number: 'O19105082517112750110',
        hotel_name: 'The Berkeley Deluxe single room',
        room_type: 'Deluxe single room',
        task_progress: '1 / 1',
        order_quantity: 8,
        order_price: 2129.20,
        commission: 21.29,
        timestamp: '2025-04-11 03:40:37',
        rating: 0,
        status: 'Submitted',
        image_url: '/lovable-uploads/44785370-6bb3-4e35-b3c9-606908465843.png'
      },
      {
        id: '5',
        order_number: 'O19103958520899829977',
        hotel_name: 'Chateau Denmark London',
        room_type: 'Deluxe single room',
        task_progress: '1 / 1',
        order_quantity: 2,
        order_price: 2108.12,
        commission: 21.08,
        timestamp: '2025-04-10 20:13:59',
        rating: 0,
        status: 'Submitted',
        image_url: '/lovable-uploads/bc8b10bb-eb5f-405f-a420-3005319f0897.png'
      }
    ];
    setTaskOrders(mockOrders);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const remainingChances = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSelector />
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border border-white rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 p-4 pb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/user/dashboard')}
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => navigate('/user/add-balance')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-full font-medium"
            >
              Top up
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Account Balance</p>
              <p className="text-white text-3xl font-bold">{accountBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* VIP Level Card */}
        <div className="relative z-10 mx-4 -mb-4">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏨</span>
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2">
                    Level
                  </Badge>
                </div>
                <div>
                  <h3 className="font-bold text-lg">VIP1</h3>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="text-red-500 font-medium">
                  You have {remainingChances} chances to accept the task
                </p>
                <div className="grid grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <span className="text-gray-500">Commission rate:</span>
                    <span className="ml-2 font-medium">1%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Minimum threshold:</span>
                    <span className="ml-2 font-medium">0</span>
                  </div>
                </div>
                <div className="text-gray-600">
                  <span className="text-gray-500">Number of tasks:</span>
                  <span className="ml-2 font-medium">{completedTasks} / {totalTasks}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium"
                onClick={() => {
                  // Handle start booking
                }}
              >
                Start booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Section */}
      <div className="p-4 pt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          History ({taskOrders.length})
        </h2>

        <div className="space-y-4">
          {taskOrders.map((order) => (
            <Card key={order.id} className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-gray-500">
                    Order number:
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {order.status}
                  </Badge>
                </div>
                <div className="text-sm font-mono text-gray-800 mb-4">
                  {order.order_number}
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={order.image_url} 
                      alt={order.hotel_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">{order.hotel_name}</h3>
                    <p className="text-sm text-gray-600">{order.room_type}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Task progress</span>
                    <span className="font-medium">{order.task_progress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order quantity</span>
                    <span className="font-medium">{order.order_quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order price</span>
                    <span className="font-medium">USDT {order.order_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commission</span>
                    <span className="font-medium text-red-500">USDT {order.commission.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {order.timestamp}
                </div>

                <div className="flex gap-1 mt-3">
                  {renderStars(order.rating)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <span>1/16</span>
          <Button variant="ghost" className="text-blue-500">
            Next
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-4 h-16">
          <button 
            onClick={() => navigate('/user/dashboard')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">{t.home}</span>
          </button>
          <button className="flex flex-col items-center justify-center text-orange-500">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{t.task}</span>
          </button>
          <button 
            onClick={() => navigate('/user/order')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">{t.order}</span>
          </button>
          <button 
            onClick={() => navigate('/user/profile')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">{t.mine}</span>
          </button>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-16"></div>
    </div>
  );
};

export default UserTask;