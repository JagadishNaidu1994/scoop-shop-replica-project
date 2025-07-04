
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Users, FileText, Settings, BookOpen, Newspaper, ShoppingBag, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'dashboard';

  const sidebarItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: BarChart3,
      tab: 'dashboard',
    },
    {
      title: 'Orders',
      path: '/admin/dashboard?tab=orders',
      icon: Package,
      tab: 'orders',
    },
    {
      title: 'Products',
      path: '/admin/dashboard?tab=products',
      icon: ShoppingBag,
      tab: 'products',
    },
    {
      title: 'Recipes',
      path: '/admin/dashboard?tab=recipes',
      icon: BookOpen,
      tab: 'recipes',
    },
    {
      title: 'Journals',
      path: '/admin/dashboard?tab=journals',
      icon: Newspaper,
      tab: 'journals',
    },
    {
      title: 'Users',
      path: '/admin/dashboard?tab=users',
      icon: Users,
      tab: 'users',
    },
    {
      title: 'Reports',
      path: '/admin/dashboard?tab=reports',
      icon: FileText,
      tab: 'reports',
    },
    {
      title: 'Settings',
      path: '/admin/dashboard?tab=settings',
      icon: Settings,
      tab: 'settings',
    },
  ];

  return (
    <div className="w-20 bg-gradient-to-b from-teal-500 to-teal-600 h-full flex flex-col items-center py-6 shadow-lg">
      {/* Logo */}
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-8 shadow-md">
        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">D</span>
        </div>
      </div>
      
      <nav className="flex flex-col space-y-4 flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === '/admin/dashboard' && currentTab === item.tab;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group",
                isActive
                  ? "bg-white text-teal-600 shadow-lg scale-110"
                  : "text-white hover:bg-white/20 hover:scale-105"
              )}
              title={item.title}
            >
              <Icon className={cn(
                "h-6 w-6 transition-all duration-300",
                isActive ? "text-teal-600" : "text-white group-hover:text-white"
              )} />
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full shadow-md" />
              )}
              
              {/* Tooltip */}
              <div className={cn(
                "absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 invisible transition-all duration-200 z-50",
                "group-hover:opacity-100 group-hover:visible group-hover:translate-x-2"
              )}>
                {item.title}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
