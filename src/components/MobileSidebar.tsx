
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Package, Heart, MapPin, CreditCard, Gift, Settings, LogOut } from 'lucide-react';

interface MobileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => void;
  profile: any;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  activeTab,
  setActiveTab,
  handleSignOut,
  profile
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'subscriptions', label: 'Subscriptions', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  const activeItem = navigationItems.find(item => item.id === activeTab);

  return (
    <div className="lg:hidden mb-6">
      <Select value={activeTab} onValueChange={setActiveTab}>
        <SelectTrigger className="w-full border-gray-300 rounded-xl">
          <SelectValue>
            <div className="flex items-center gap-2">
              {activeItem && <activeItem.icon className="h-4 w-4" />}
              {activeItem?.label || 'Select Section'}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
          {navigationItems.map((item) => (
            <SelectItem 
              key={item.id} 
              value={item.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </SelectItem>
          ))}
          <SelectItem 
            value="signout" 
            className="flex items-center gap-2 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg"
            onSelect={handleSignOut}
          >
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MobileSidebar;
