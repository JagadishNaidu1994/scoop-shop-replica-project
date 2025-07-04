
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
    <div className="w-64 bg-gradient-to-b from-teal-500 to-teal-600 h-full flex flex-col py-6 shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
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
                "relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive
                  ? "bg-white text-teal-600 shadow-lg font-medium"
                  : "text-white hover:bg-white/10 hover:translate-x-1"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 mr-3 transition-all duration-300",
                isActive ? "text-teal-600" : "text-white"
              )} />
              
              <span className={cn(
                "text-sm font-medium transition-all duration-300",
                isActive ? "text-teal-600" : "text-white"
              )}>
                {item.title}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full shadow-md" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
