
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Home, 
  ShoppingCart, 
  Headphones, 
  User, 
  Zap,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Gift,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, setLanguage, t } = useTranslation();

  const languages = [
    { value: 'en', label: 'English', flag: '/lovable-uploads/0b7b9768-36bf-4e9e-9dc5-813d1b30e400.png' },
    { value: 'zh', label: '中文', flag: '/lovable-uploads/ee60408c-b028-4043-ae1e-136b8daf4ef6.png' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userRole');
    toast({
      title: "已退出登录",
      description: "您已成功退出系统",
    });
    navigate('/user/login');
  };

  const menuItems = [
    { 
      icon: ArrowRight, 
      label: 'Withdraw', 
      color: 'text-gray-700',
      onClick: () => navigate('/user/withdraw')
    },
    { 
      icon: Users, 
      label: 'Team Report', 
      color: 'text-gray-700',
      onClick: () => navigate('/user/team-report')
    },
    { 
      icon: FileText, 
      label: 'Withdrawals Record', 
      color: 'text-gray-700',
      onClick: () => navigate('/user/withdrawals-record')
    },
    { 
      icon: CreditCard, 
      label: 'Recharge Record', 
      color: 'text-gray-700',
      onClick: () => navigate('/user/recharge-record')
    },
    { 
      icon: FileText, 
      label: 'Transaction Record', 
      color: 'text-gray-700',
      onClick: () => navigate('/user/transaction-record')
    },
    { 
      icon: Settings, 
      label: 'Withdrawal Information', 
      color: 'text-gray-700',
      onClick: () => navigate('/user/withdrawal-information')
    },
    { 
      icon: FileText, 
      label: 'Announcement', 
      color: 'text-gray-700',
      onClick: () => navigate('/user/announcement')
    },
    { 
      icon: Settings, 
      label: 'Manage Password', 
      color: 'text-gray-700',
      onClick: () => navigate('/user/manage-password')
    },
    { 
      icon: LogOut, 
      label: 'Sign Out', 
      color: 'text-red-500',
      onClick: handleLogout
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-white">
              <div className="text-lg font-medium">13800000000</div>
              <div className="text-sm opacity-90">Invitation Code: 613777</div>
              <div className="flex items-center gap-1 text-sm opacity-90">
                <Gift className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-auto h-8 px-2 border-0 bg-transparent focus:ring-0 gap-1">
                <div className="flex items-center gap-1">
                  <img 
                    src={languages.find(lang => lang.value === language)?.flag} 
                    alt="Selected Language" 
                    className="w-5 h-5" 
                  />
                  <ChevronDown className="w-3 h-3 text-white" />
                </div>
              </SelectTrigger>
              <SelectContent className="min-w-[120px] bg-white border border-gray-200 shadow-lg z-50">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <img src={lang.flag} alt={lang.label} className="w-4 h-4" />
                      <span className="text-sm">{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
              20
            </div>
          </div>
        </div>
      </div>

      {/* Account Balance Section */}
      <div className="p-4">
        <Card className="bg-white shadow-sm mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800">$5,186,079.00</div>
                <div className="text-sm text-gray-600">Account Balance</div>
              </div>
              <Button 
                onClick={() => navigate('/user/add-balance')}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 p-0"
              >
                <span className="text-lg">+</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-green-500 font-medium">$5,186,079.00</div>
                <div className="text-xs text-gray-600">Available Balance</div>
              </div>
              <div className="text-center">
                <div className="text-red-500 font-medium">100</div>
                <div className="text-xs text-gray-600">Credit</div>
              </div>
              <div className="text-center">
                <div className="text-gray-800 font-medium">$0.00</div>
                <div className="text-xs text-gray-600">Frozen amount</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className={`text-sm font-medium ${item.color}`}>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                {index < menuItems.length - 1 && <div className="border-b border-gray-100 mx-4" />}
              </div>
            ))}
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
            <span className="text-xs">{t.home}</span>
          </button>
          <button 
            onClick={() => navigate('/user/order')}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-blue-500"
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">{t.order}</span>
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
          <button className="flex flex-col items-center justify-center text-blue-500">
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

export default UserProfile;
