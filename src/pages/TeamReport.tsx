
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Home, ShoppingCart, Headphones, User, Zap, Calendar } from 'lucide-react';

const TeamReport = () => {
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
          <h1 className="text-white text-lg font-medium">Team Report</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-purple-600 rounded-lg p-1">
            <TabsTrigger value="all" className="text-white data-[state=active]:bg-purple-700 data-[state=active]:text-white">All</TabsTrigger>
            <TabsTrigger value="today" className="text-white data-[state=active]:bg-purple-700 data-[state=active]:text-white">Today</TabsTrigger>
            <TabsTrigger value="yesterday" className="text-white data-[state=active]:bg-purple-700 data-[state=active]:text-white">Yesterday</TabsTrigger>
            <TabsTrigger value="week" className="text-white data-[state=active]:bg-purple-700 data-[state=active]:text-white">This week</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>

            <TabsContent value="all">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">All</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Number of team</span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Commission</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cumulative recharge</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cumulative withdrawal</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="today">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    No team data for today
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="yesterday">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    No team data for yesterday
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="week">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    No team data for this week
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

export default TeamReport;
