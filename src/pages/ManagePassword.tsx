
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Home, ShoppingCart, Headphones, User, Zap } from 'lucide-react';

const ManagePassword = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [withdrawalForm, setWithdrawalForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
          <h1 className="text-white text-lg font-medium">Password</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white rounded-lg p-1">
            <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-red-500">Login Password</TabsTrigger>
            <TabsTrigger value="withdrawal" className="data-[state=active]:bg-white data-[state=active]:text-gray-800">Withdrawal Password</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="login">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <input
                        type="password"
                        placeholder="Old password"
                        value={loginForm.oldPassword}
                        onChange={(e) => setLoginForm({...loginForm, oldPassword: e.target.value})}
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="password"
                        placeholder="New Password"
                        value={loginForm.newPassword}
                        onChange={(e) => setLoginForm({...loginForm, newPassword: e.target.value})}
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={loginForm.confirmPassword}
                        onChange={(e) => setLoginForm({...loginForm, confirmPassword: e.target.value})}
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                      />
                    </div>

                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 mt-8">
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="withdrawal">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <input
                        type="password"
                        placeholder="Old password"
                        value={withdrawalForm.oldPassword}
                        onChange={(e) => setWithdrawalForm({...withdrawalForm, oldPassword: e.target.value})}
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="password"
                        placeholder="New Password"
                        value={withdrawalForm.newPassword}
                        onChange={(e) => setWithdrawalForm({...withdrawalForm, newPassword: e.target.value})}
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={withdrawalForm.confirmPassword}
                        onChange={(e) => setWithdrawalForm({...withdrawalForm, confirmPassword: e.target.value})}
                        className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                      />
                    </div>

                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-3 mt-8">
                      Submit
                    </Button>
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

export default ManagePassword;
