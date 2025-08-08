
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      title: 'To-do List',
      icon: '📋',
      path: '/dashboard'
    },
    {
      title: 'Statistics',
      icon: '📊',
      path: '/statistics'
    },
    {
      title: 'Order management',
      icon: '❄️',
      path: '/orders'
    },
    {
      title: 'Solution Groups',
      icon: '🔧',
      path: '/solution-groups'
    },
    {
      title: 'Marketing Center',
      icon: '❄️',
      children: [
        { title: 'User List', icon: '', path: '/users' },
        { title: 'Bill List', icon: '', path: '/orders' },
        { title: 'Withdrawal List', icon: '', path: '/withdrawal-record' },
        { title: 'Recharge List', icon: '', path: '/deposit-record' },
        { title: 'Payment List', icon: '', path: '/orders' },
        { title: 'Level Management', icon: '', path: '/users' },
        { title: 'Danger value record', icon: '', path: '/orders' },
        { title: 'Login List', icon: '', path: '/users' },
        { title: 'Navy Address', icon: '', path: '/users' },
      ]
    },
    {
      title: 'Financial Management',
      icon: '🏆',
      path: '/products'
    },
    {
      title: 'User Management',
      icon: '👤',
      path: '/users'
    },
  ];

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.title);
    const isActive = item.path && location.pathname === item.path;
    
    return (
      <div key={item.title}>
        {item.path && !hasChildren ? (
          <Link
            to={item.path}
            className={cn(
              "flex items-center justify-between px-4 py-3 text-white hover:bg-blue-600 cursor-pointer transition-colors",
              depth > 0 && "pl-8 text-sm bg-blue-800",
              isActive && "bg-blue-600"
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {isOpen && <span>{item.title}</span>}
            </div>
          </Link>
        ) : (
          <div
            className={cn(
              "flex items-center justify-between px-4 py-3 text-white hover:bg-blue-600 cursor-pointer transition-colors",
              depth > 0 && "pl-8 text-sm bg-blue-800"
            )}
            onClick={() => hasChildren && toggleExpanded(item.title)}
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {isOpen && <span>{item.title}</span>}
            </div>
            {hasChildren && isOpen && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            )}
          </div>
        )}
        
        {hasChildren && isExpanded && isOpen && (
          <div className="bg-blue-800">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-blue-500 transition-all duration-300 z-50",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="overflow-y-auto h-full">
        <div className="py-4">
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </div>
    </div>
  );
};
