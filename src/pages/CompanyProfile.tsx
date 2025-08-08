
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CompanyProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-0 hover:bg-transparent"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <h1 className="text-lg font-semibold text-orange-500 mx-auto">Company Profile</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-orange-500 font-semibold mb-3">
              1: Introduction to Agoda:
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Agoda's accommodation network covers the world, with more than 4.5 million hotels and holiday 
              accommodations for guests to book. It also provides services such as booking air tickets and 
              activity experiences, allowing travelers to see a bigger world with less money at great value. 
              Agoda.com and Agoda App support 39 languages and provide 24-hour customer service. Agoda is 
              headquartered in Singapore and is affiliated with Booking Holdings Group (Nasdaq: BKNG). It has 
              branches in 27 countries and regions around the world and employs more than 7,000 people. Agoda 
              has always been committed to making travel more convenient through cutting-edge technology.
            </p>
          </div>

          <div>
            <h2 className="text-orange-500 font-semibold mb-3">
              2: Introduction to Agoda Mall:
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Agoda established the Agoda Mall platform in 2019 to focus on improving global hotel merchants, 
              hotel booking sales and praise rates. Merchants can pay to promote their hotel rooms to attract 
              more tourists to stay and have a better experience! After completing the room reservation service 
              provided by Agoda merchants, participating users will pay the user commission based on the order 
              amount, and the transaction will be completed. Whether you check in yourself or help merchants 
              improve their reservation services, you can get feedback commission rewards!
            </p>
          </div>

          <div>
            <h2 className="text-orange-500 font-semibold mb-3">
              3: Contact information:
            </h2>
            <p className="text-gray-700 text-sm">
              agodamall2005@gmail.com
            </p>
          </div>

          <div>
            <h2 className="text-orange-500 font-semibold mb-3">
              4: Company headquarters address:
            </h2>
            <p className="text-gray-700 text-sm">
              Agoda Company Pte. Ltd.30 Cecil Street, #19-08 Prudential Tower Singapore 049712
            </p>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-orange-500 font-semibold text-center">
              Copyright © 2005 – 2025, Agoda Company Pte. Ltd
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
