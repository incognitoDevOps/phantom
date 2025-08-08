
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const UserService = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Withdrawal funds have not arrived?",
      answer: "Since withdrawals need to be manually reviewed and executed, and there will be delays in the case of congestion in the chain transfer, but don't worry, the funds will normally arrive in your account within 30 minutes. Please pay attention to the wallet SMS notification!"
    },
    {
      question: "Order matching failed?",
      answer: "It is recommended that you change your network or log out and try again. This problem will occur if the network is abnormal!"
    },
    {
      question: "Can the number of tasks be increased?",
      answer: "Due to the large number of users, VIP1 currently has only 30 task orders. The increase will be notified separately!"
    },
    {
      question: "How do we make a profit?",
      answer: "Prepare sufficient funds in the Agoda account to match hotel reservation funds. After successful reservation and payment, the merchant will immediately settle the payment order commission!"
    },
    {
      question: "Why do merchants pay commissions?",
      answer: "Because merchants need to improve the hotel's ranking on the Agoda booking website, as well as good reviews, and increase the merchant's hotel room bookings, the merchant will pay commissions for everyone to complete the booking task and earn profits"
    },
    {
      question: "The above questions can't help me?",
      answer: "The above questions can't help you, you can return to the homepage, click the upper right corner, and contact our online customer service staff!"
    },
    {
      question: "Deposit not arrived?",
      answer: "Please contact customer service if your deposit has not arrived within the expected timeframe."
    }
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/user/dashboard')}
            className="p-0 hover:bg-transparent"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-800 mx-auto">FAQ</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="p-4">
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <Card key={index} className="bg-white shadow-sm">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{item.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-orange-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserService;
