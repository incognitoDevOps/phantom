import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Calendar, ShoppingCart, User, Star, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Order {
  id: string;
  order_number: string;
  hotel_name: string;
  room_type: string;
  order_quantity: number;
  order_price: number;
  commission: number;
  timestamp: string;
  rating: number;
  status: string;
  image_url: string;
}

const UserOrder = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'to-be-completed' | 'completed'>('to-be-completed');
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(8);

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    // Mock data based on screenshots
    const mockOrders: Order[] = [
      {
        id: '1',
        order_number: 'O19110822113269526850',
        hotel_name: 'Mandarin Oriental Hyde Park, London',
        room_type: 'Deluxe family room',
        order_quantity: 2,
        order_price: 2293.73,
        commission: 22.94,
        timestamp: '2025-04-12 17:41:20',
        rating: 0,
        status: 'Submitted',
        image_url: '/lovable-uploads/44785370-6bb3-4e35-b3c9-606908465843.png'
      },
      {
        id: '2',
        order_number: 'O19105092180747722306',
        hotel_name: 'Bvlgari Hotel London',
        room_type: 'Deluxe family room',
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
        order_quantity: 6,
        order_price: 2150.49,
        commission: 21.50,
        timestamp: '2025-04-11 03:41:37',
        rating: 0,
        status: 'Submitted',
        image_url: '/lovable-uploads/c8a5e717-f6e2-40cd-b0aa-6596ff6ae0ae.png'
      },
      {
        id: '4',
        order_number: 'O19105082517112750110',
        hotel_name: 'The Berkeley Deluxe single room',
        room_type: 'Deluxe single room',
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
        order_quantity: 2,
        order_price: 2108.12,
        commission: 21.08,
        timestamp: '2025-04-10 20:13:59',
        rating: 4,
        status: 'Submitted',
        image_url: '/lovable-uploads/bc8b10bb-eb5f-405f-a420-3005319f0897.png'
      },
      {
        id: '6',
        order_number: 'O19103408720164945933',
        hotel_name: 'Chateau Denmark London',
        room_type: 'Deluxe single room',
        order_quantity: 3,
        order_price: 2087.25,
        commission: 20.87,
        timestamp: '2025-04-10 16:35:31',
        rating: 0,
        status: 'Submitted',
        image_url: '/lovable-uploads/c8a5e717-f6e2-40cd-b0aa-6596ff6ae0ae.png'
      },
      {
        id: '7',
        order_number: 'O19103221494026607618',
        hotel_name: 'Corinthia London',
        room_type: 'Deluxe single room',
        order_quantity: 6,
        order_price: 2066.58,
        commission: 20.67,
        timestamp: '2025-04-10 15:21:07',
        rating: 0,
        status: 'Submitted',
        image_url: '/lovable-uploads/44785370-6bb3-4e35-b3c9-606908465843.png'
      },
      {
        id: '8',
        order_number: 'O19103221329944903700',
        hotel_name: 'Cheval Gloucester Park at Kensington',
        room_type: 'Deluxe single room',
        order_quantity: 4,
        order_price: 2046.12,
        commission: 20.46,
        timestamp: '2025-04-10 15:21:03',
        rating: 0,
        status: 'Submitted',
        image_url: '/lovable-uploads/bc8b10bb-eb5f-405f-a420-3005319f0897.png'
      },
      {
        id: '9',
        order_number: 'O19103221119558615066',
        hotel_name: 'The Wellesley, a Luxury Collection Hotel, Knightsbridge, London',
        room_type: 'Deluxe family room',
        order_quantity: 2,
        order_price: 2025.86,
        commission: 20.26,
        timestamp: '2025-04-10 15:20:58',
        rating: 0,
        status: 'Submitted',
        image_url: '/lovable-uploads/c8a5e717-f6e2-40cd-b0aa-6596ff6ae0ae.png'
      },
      {
        id: '10',
        order_number: 'O19103220965669601299',
        hotel_name: 'Mandarin Oriental Hyde Park, London',
        room_type: 'Deluxe single room',
        order_quantity: 3,
        order_price: 2005.80,
        commission: 20.06,
        timestamp: '2025-04-10 15:20:55',
        rating: 0,
        status: 'Submitted',
        image_url: '/lovable-uploads/44785370-6bb3-4e35-b3c9-606908465843.png'
      }
    ];
    setCompletedOrders(mockOrders);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-700">agoda</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Order</h1>
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/504f948d-bbfe-4a00-b969-f11297abfa78.png" alt="US Flag" className="w-6 h-6" />
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
              🎧
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('to-be-completed')}
            className={`flex-1 py-3 rounded-full font-medium ${
              activeTab === 'to-be-completed'
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            To be completed
          </Button>
          <Button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 rounded-full font-medium ${
              activeTab === 'completed'
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Completed
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'to-be-completed' ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                <div className="space-y-1">
                  <div className="w-6 h-1 bg-gray-400 rounded"></div>
                  <div className="w-6 h-1 bg-gray-400 rounded"></div>
                  <div className="w-6 h-1 bg-gray-400 rounded"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">No more data</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedOrders.map((order) => (
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

                  <div className="space-y-2 text-sm mb-4">
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

                  <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {order.timestamp}
                  </div>

                  <div className="flex gap-1 mb-4">
                    {renderStars(order.rating)}
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium">
                    Confirm like
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
              <span>{currentPage}/{totalPages}</span>
              <Button 
                variant="ghost" 
                className="text-blue-500"
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-4 h-16">
          <button 
            onClick={() => navigate('/user/dashboard')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => navigate('/user/task')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Task</span>
          </button>
          <button className="flex flex-col items-center justify-center text-orange-500">
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Order</span>
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

export default UserOrder;