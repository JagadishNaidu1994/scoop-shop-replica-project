
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Users, FileText, Settings, BookOpen, Newspaper, ShoppingBag } from 'lucide-react';
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
      icon: Settings,
      tab: 'dashboard',
    },
    {
      title: 'Orders',
      path: '/admin/dashboard?tab=orders',
      icon: Package,
      tab: 'orders',
    },
    {
      title: 'Products Admin',
      path: '/admin/dashboard?tab=products',
      icon: ShoppingBag,
      tab: 'products',
    },
    {
      title: 'Recipe Admin',
      path: '/admin/dashboard?tab=recipes',
      icon: BookOpen,
      tab: 'recipes',
    },
    {
      title: 'Journal Admin',
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
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-black">Admin Panel</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your store</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === '/admin/dashboard' && currentTab === item.tab;
            
            return (
              <li key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out transform relative overflow-hidden",
                    isActive
                      ? "bg-black text-white shadow-lg scale-105"
                      : "text-gray-700 hover:bg-gray-100 hover:scale-102 hover:shadow-md"
                  )}
                >
                  {/* Active indicator */}
                  <div 
                    className={cn(
                      "absolute left-0 top-0 h-full w-1 bg-black transition-all duration-300 ease-in-out",
                      isActive ? "opacity-100 transform translate-x-0" : "opacity-0 transform -translate-x-full"
                    )}
                  />
                  
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-300 ease-in-out",
                    isActive ? "scale-110" : "scale-100"
                  )} />
                  
                  <span className={cn(
                    "font-medium transition-all duration-300 ease-in-out",
                    isActive ? "translate-x-1" : "translate-x-0"
                  )}>
                    {item.title}
                  </span>
                  
                  {/* Hover effect background */}
                  <div 
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent transition-all duration-300 ease-in-out",
                      isActive ? "opacity-0" : "opacity-0 hover:opacity-100"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
