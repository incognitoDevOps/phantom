import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, FileText, ShoppingCart, User, ChevronRight, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import slide1 from '@/assets/slide1-lobby.jpg';
import slide2 from '@/assets/slide2-city.jpg';
import slide3 from '@/assets/slide3-ocean.jpg';
import slide4 from '@/assets/slide4-bigben.jpg';
import slide5 from '@/assets/slide5-suite.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  const languages = [
    { value: 'en', label: 'English', flag: '/lovable-uploads/0b7b9768-36bf-4e9e-9dc5-813d1b30e400.png' },
    { value: 'zh', label: '中文', flag: '/lovable-uploads/ee60408c-b028-4043-ae1e-136b8daf4ef6.png' }
  ];

  const slides = [slide1, slide2, slide3, slide4, slide5];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data: billRecords } = await supabase
        .from('bill_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: paymentRecords } = await supabase
        .from('payment_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const combinedTransactions = [
        ...(billRecords || []).map(record => ({
          id: record.id,
          type: 'commission',
          amount: record.operation_amount,
          username: record.username.replace(/(.{3}).*(.{4})/, '$1****$2'),
          date: new Date(record.created_at).toLocaleDateString(),
          time: new Date(record.created_at).toLocaleTimeString()
        })),
        ...(paymentRecords || []).map(record => ({
          id: record.id,
          type: 'payment',
          amount: record.payment_amount,
          username: record.username.replace(/(.{3}).*(.{4})/, '$1****$2'),
          date: new Date(record.created_at).toLocaleDateString(),
          time: new Date(record.created_at).toLocaleTimeString()
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20);

      setTransactions(combinedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

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
            <span className="text-lg font-semibold text-gray-700">{t.agoda}</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
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

      {/* Hero Image Slider */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <img 
              key={index}
              src={slide}
              alt={`Luxury Hotel ${index + 1}`} 
              className="w-full h-64 object-cover flex-shrink-0"
            />
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-opacity ${
                index === currentSlide ? 'bg-white' : 'bg-white opacity-50'
              }`}
            />
          ))}
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
            onClick={() => navigate('/user/login')}
            className="flex flex-col items-center justify-center text-gray-400"
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs">{t.task}</span>
          </button>
          <button 
            onClick={() => navigate('/user/login')}
            className="flex flex-col items-center justify-center text-gray-400"
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span className="text-xs">{t.order}</span>
          </button>
          <button 
            onClick={() => navigate('/user/login')}
            className="flex flex-col items-center justify-center text-gray-400"
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">{t.mine}</span>
          </button>
        </div>
      </div>

      {/* Transaction Record */}
      <div className="p-4 pb-20">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.transactionRecord}</h2>
        <div className="bg-white rounded-lg shadow-sm max-h-64 overflow-hidden relative">
          <div className="animate-[scrollUp_20s_linear_infinite] space-y-3 p-4">
            {transactions.concat(transactions).map((transaction, index) => (
              <div key={`${transaction.id}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {t.getUSDT} {transaction.amount} {transaction.type === 'commission' ? t.commission : t.payment}
                  </div>
                  <div className="text-xs text-gray-500">{transaction.username}</div>
                </div>
                <div className="text-xs text-gray-400">{transaction.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-16"></div>
    </div>
  );
};

export default LandingPage;