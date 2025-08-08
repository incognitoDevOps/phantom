
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Home, ShoppingCart, Headphones, User, Zap, Mail } from 'lucide-react';

const Announcement = () => {
  const navigate = useNavigate();

  const systemNotifications = [
    {
      id: 1,
      title: 'System notification',
      content: '订单O19189420026704691提交完成。',
      time: '2025-05-04 19:01:03'
    },
    {
      id: 2,
      title: 'System notification',
      content: '订单O19189420026704691抢单成功。',
      time: '2025-05-04 19:01:01'
    },
    {
      id: 3,
      title: 'System notification',
      content: '订单O19189416641062502抢单成功。',
      time: '2025-05-04 19:00:52'
    },
    {
      id: 4,
      title: 'System notification',
      content: '订单O19189464628914585提交完成。',
      time: '2025-05-04 15:44:14'
    },
    {
      id: 5,
      title: 'System notification',
      content: '订单O19189464628914585抢单成功。',
      time: '2025-05-04 15:44:06'
    },
    {
      id: 6,
      title: 'System notification',
      content: '订单O19189436477829120提交完成。',
      time: '2025-05-04 15:43:28'
    },
    {
      id: 7,
      title: 'System Notice',
      content: 'The system is now for maintenance...',
      time: '2025-05-04 15:43:28'
    }
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
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">🇺🇸</span>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
              29
            </div>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-500 text-xs">📱</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-blue-500 rounded-lg p-1">
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">System notification</TabsTrigger>
            <TabsTrigger value="station" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">Station letter</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="system">
              <div className="space-y-3">
                {systemNotifications.map((notification) => (
                  <Card key={notification.id} className="bg-white shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-1">{notification.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{notification.content}</p>
                          <div className="text-gray-500 text-xs">{notification.time}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="station">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    No station letters
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
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

export default Announcement;
