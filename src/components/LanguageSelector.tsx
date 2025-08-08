import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = "" }) => {
  const { language, setLanguage, t } = useTranslation();
  
  const languages = [
    { value: 'en', label: 'English', flag: '/lovable-uploads/0b7b9768-36bf-4e9e-9dc5-813d1b30e400.png' },
    { value: 'zh', label: '中文', flag: '/lovable-uploads/ee60408c-b028-4043-ae1e-136b8daf4ef6.png' }
  ];

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className={`w-32 bg-white border-0 shadow-sm ${className}`}>
        <SelectValue placeholder={t.selectLanguage} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value} className="cursor-pointer">
            <div className="flex items-center gap-2">
              <img src={lang.flag} alt={lang.label} className="w-4 h-4 rounded-sm" />
              <span>{lang.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;