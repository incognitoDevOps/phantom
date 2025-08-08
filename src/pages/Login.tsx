
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For demo purposes with admin credentials
      if (username === 'admin' && password === '123456') {
        // Create a simple session for demo purposes
        toast({
          title: "登录成功",
          description: "欢迎使用管理系统",
        });
        
        // Set a simple flag in localStorage for demo auth
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ email: 'admin@demo.com', id: 'demo-admin' }));
        
        navigate('/dashboard');
        return;
      }

      // For other credentials, show error
      toast({
        title: "登录失败",
        description: "用户名或密码错误",
        variant: "destructive",
      });
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "登录失败",
        description: "系统错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">管理系统登录</h1>
          <p className="text-gray-600 mt-2">请输入您的登录凭据</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              className="mt-1"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>测试账号: admin</p>
          <p>测试密码: 123456</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
