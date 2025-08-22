
import React from 'react';
import { Package, Users, FileText, Settings, BookOpen, Newspaper, ShoppingBag, BarChart3, Star, MessageSquare, Truck, TrendingUp, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: BarChart3,
      tab: 'dashboard',
    },
    {
      title: 'Orders',
      icon: Package,
      tab: 'orders',
    },
    {
      title: 'Products',
      icon: ShoppingBag,
      tab: 'products',
    },
    {
      title: 'Recipes',
      icon: BookOpen,
      tab: 'recipes',
    },
    {
      title: 'Journals',
      icon: Newspaper,
      tab: 'journals',
    },
    {
      title: 'Users',
      icon: Users,
      tab: 'users',
    },
    {
      title: 'Coupons',
      icon: Percent,
      tab: 'coupons',
    },
    {
      title: 'Reviews',
      icon: Star,
      tab: 'reviews',
    },
    {
      title: 'Contact',
      icon: MessageSquare,
      tab: 'contact',
    },
    {
      title: 'Shipping',
      icon: Truck,
      tab: 'shipping',
    },
    {
      title: 'Analytics',
      icon: TrendingUp,
      tab: 'analytics',
    },
    {
      title: 'CLV Analytics',
      icon: BarChart3,
      tab: 'clv',
    },
  ];

  return (
    <div className="w-64 bg-gray-900 h-full flex flex-col py-6 shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-col space-y-1 flex-1 px-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={cn(
                "relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group text-left w-full",
                isActive
                  ? "bg-white text-gray-900 shadow-md font-medium"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mr-3 transition-colors duration-200",
                isActive ? "text-gray-900" : "text-gray-400 group-hover:text-white"
              )} />
              
              <span className={cn(
                "text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "text-gray-900" 
                  : "text-gray-300 group-hover:text-white"
              )}>
                {item.title}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">Admin Panel v1.0</p>
      </div>
    </div>
  );
};
