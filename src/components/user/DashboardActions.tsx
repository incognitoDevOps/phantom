
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, ArrowDownLeft, Share, Headphones } from 'lucide-react';

const DashboardActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Recharge',
      icon: CreditCard,
      bgColor: 'bg-gradient-to-r from-[#409EFF] to-[#66b1ff]',
      onClick: () => navigate('/user/add-balance')
    },
    {
      title: 'Withdraw',
      icon: ArrowDownLeft,
      bgColor: 'bg-gradient-to-r from-orange-400 to-orange-500',
      onClick: () => navigate('/user/withdraw')
    },
    {
      title: 'Share',
      icon: Share,
      bgColor: 'bg-gradient-to-r from-green-400 to-green-500',
      onClick: () => {
        // Implement share functionality
        navigator.share?.({
          title: 'Join our platform',
          text: 'Check out this amazing platform!',
          url: window.location.origin
        }).catch(() => {
          // Fallback for browsers that don't support native sharing
          navigator.clipboard.writeText(window.location.origin);
        });
      }
    },
    {
      title: 'Service',
      icon: Headphones,
      bgColor: 'bg-gradient-to-r from-cyan-400 to-cyan-500',
      onClick: () => navigate('/user/service')
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {actions.map((action, index) => (
        <Card key={index} className="overflow-hidden shadow-md border border-gray-200">
          <CardContent className="p-0">
            <button
              onClick={action.onClick}
              className={`w-full h-24 ${action.bgColor} text-white flex items-center justify-start pl-6 hover:opacity-90 transition-all duration-200 active:scale-95`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">{action.title}</span>
              </div>
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardActions;
