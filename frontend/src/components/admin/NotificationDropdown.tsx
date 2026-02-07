
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Package, ShoppingCart, Users, AlertCircle, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Notification {
  id: string;
  type: 'order' | 'user' | 'product' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

const NotificationDropdown: React.FC = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'New Order',
      message: 'Order #1234 has been placed',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'user',
      title: 'New User Registration',
      message: 'John Smith has registered',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'product',
      title: 'Low Stock Alert',
      message: 'Matcha Green Tea is running low',
      timestamp: '2024-01-15T08:00:00Z',
      isRead: true,
      priority: 'high'
    },
    {
      id: '4',
      type: 'system',
      title: 'System Update',
      message: 'Database backup completed successfully',
      timestamp: '2024-01-15T06:00:00Z',
      isRead: true,
      priority: 'low'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'product':
        return <Package className="w-4 h-4" />;
      case 'system':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-500';
    if (priority === 'medium') return 'text-yellow-500';
    switch (type) {
      case 'order':
        return 'text-green-500';
      case 'user':
        return 'text-blue-500';
      case 'product':
        return 'text-purple-500';
      case 'system':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-gray-600">You have {unreadCount} unread notifications</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={getIconColor(notification.type, notification.priority)}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                      {notification.title}
                    </p>
                    <div className="flex items-center space-x-1">
                      {notification.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">!</Badge>
                      )}
                      {notification.isRead && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            Mark All as Read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
