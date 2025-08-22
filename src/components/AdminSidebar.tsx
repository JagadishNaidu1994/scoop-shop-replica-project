
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
    <div className="w-64 bg-black h-full flex flex-col py-6 shadow-2xl border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-col space-y-2 flex-1 px-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === '/admin/dashboard' && currentTab === item.tab;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex items-center px-4 py-3 rounded-xl transition-all duration-500 group overflow-hidden",
                isActive
                  ? "bg-white text-black shadow-lg font-medium transform scale-105"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"
              )}
            >
              {/* Animated background */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transition-all duration-500 transform",
                isActive 
                  ? "translate-x-0 opacity-100" 
                  : "-translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              )} />
              
              {/* Sliding border effect */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 bg-white transition-all duration-300 transform",
                isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
              )} />
              
              <Icon className={cn(
                "h-5 w-5 mr-3 transition-all duration-300 relative z-10",
                isActive ? "text-black transform rotate-12" : "text-gray-300 group-hover:text-white group-hover:scale-110"
              )} />
              
              <span className={cn(
                "text-sm font-medium transition-all duration-300 relative z-10",
                isActive 
                  ? "text-black transform translate-x-1" 
                  : "text-gray-300 group-hover:text-white group-hover:translate-x-1"
              )}>
                {item.title}
              </span>
              
              {/* Active indicator with pulse */}
              {isActive && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-black rounded-full shadow-md animate-pulse" />
              )}
              
              {/* Hover glow effect */}
              <div className={cn(
                "absolute inset-0 rounded-xl bg-white/5 transition-all duration-300 opacity-0",
                "group-hover:opacity-100 group-hover:shadow-lg"
              )} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
