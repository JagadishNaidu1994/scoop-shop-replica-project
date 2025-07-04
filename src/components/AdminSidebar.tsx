
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Users, FileText, Settings, BookOpen, Newspaper, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const sidebarItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: Settings,
    },
    {
      title: 'Orders',
      path: '/admin/dashboard?tab=orders',
      icon: Package,
    },
    {
      title: 'Products Admin',
      path: '/admin/products',
      icon: ShoppingBag,
    },
    {
      title: 'Recipe Admin',
      path: '/admin/recipes',
      icon: BookOpen,
    },
    {
      title: 'Journal Admin',
      path: '/admin/journals',
      icon: Newspaper,
    },
    {
      title: 'Users',
      path: '/admin/dashboard?tab=users',
      icon: Users,
    },
    {
      title: 'Reports',
      path: '/admin/dashboard?tab=reports',
      icon: FileText,
    },
    {
      title: 'Settings',
      path: '/admin/dashboard?tab=settings',
      icon: Settings,
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
            const isActive = item.path === '/admin/dashboard' 
              ? currentPath === '/admin/dashboard' && !window.location.search
              : currentPath.includes(item.path.split('?')[0]) && 
                (item.path.includes('tab=') ? window.location.search.includes(item.path.split('tab=')[1]) : true);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200",
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
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
