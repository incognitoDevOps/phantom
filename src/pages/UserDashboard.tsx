
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, FileText, ShoppingCart, User, ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useTranslation();

  const languages = [
    { value: 'en', label: 'English', flag: '/lovable-uploads/0b7b9768-36bf-4e9e-9dc5-813d1b30e400.png' },
    { value: 'zh', label: '中文', flag: '/lovable-uploads/ee60408c-b028-4043-ae1e-136b8daf4ef6.png' }
  ];

  const hotels = [
    {
      nameKey: 'hilton',
      rating: 4,
      logo: 'H',
      logoColor: 'bg-blue-600'
    },
    {
      nameKey: 'ihg',
      rating: 5,
      logo: 'IHG',
      logoColor: 'bg-orange-500'
    },
    {
      nameKey: 'marriott',
      rating: 5,
      logo: 'M',
      logoColor: 'bg-gray-800'
    },
    {
      nameKey: 'accor',
      rating: 3,
      logo: 'A',
      logoColor: 'bg-yellow-600'
    },
    {
      nameKey: 'shangriLa',
      rating: 4,
      logo: 'S',
      logoColor: 'bg-yellow-500'
    },
    {
      nameKey: 'wyndham',
      rating: 4,
      logo: 'W',
      logoColor: 'bg-blue-500'
    },
    {
      nameKey: 'hyatt',
      rating: 4,
      logo: 'H',
      logoColor: 'bg-purple-600'
    },
    {
      nameKey: 'kempinski',
      rating: 4,
      logo: 'K',
      logoColor: 'bg-gray-600'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-lg font-semibold text-gray-700">{t.agoda}</span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-auto h-8 px-2 border-0 bg-transparent focus:ring-0 gap-1">
                <div className="flex items-center gap-1">
                  <img 
                    src={languages.find(lang => lang.value === language)?.flag} 
                    alt="Selected Language" 
                    className="w-5 h-5" 
                  />
                  <ChevronDown className="w-3 h-3 text-gray-500" />
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
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
              🎧
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative">
        <img 
          src="/lovable-uploads/bc8b10bb-eb5f-405f-a420-3005319f0897.png" 
          alt="Luxury Hotel Room" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
          <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="bg-blue-50 p-3 mx-4 mt-4 rounded-lg flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          🔊
        </div>
        <div className="flex-1">
          <span className="text-sm text-gray-600">{t.announcementText}</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Merchant List */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.merchantList}</h2>
        <div className="grid grid-cols-2 gap-4">
          {hotels.map((hotel, index) => (
            <Card key={index} className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 ${hotel.logoColor} rounded-full flex items-center justify-center mb-3`}>
                    <span className="text-white font-bold text-sm">{hotel.logo}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{t.hotels[hotel.nameKey as keyof typeof t.hotels].name}</h3>
                  <div className="flex gap-1 mb-3">
                    {renderStars(hotel.rating)}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t.hotels[hotel.nameKey as keyof typeof t.hotels].description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center text-orange-500">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{t.home}</span>
          </button>
          <button 
            onClick={() => navigate('/user/task')}
            className="flex flex-col items-center justify-center text-gray-400"
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs">{t.task}</span>
          </button>
          <button 
            onClick={() => navigate('/user/order')}
            className="flex flex-col items-center justify-center text-gray-400"
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">{t.order}</span>
          </button>
          <button 
            onClick={() => navigate('/user/profile')}
            className="flex flex-col items-center justify-center text-gray-400"
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

export default UserDashboard;
