
import React from "react";
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  Star, 
  Truck,
  BarChart3,
  TrendingUp,
  Receipt,
  Tag,
  Gift,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Users", icon: Users },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "user-coupons", label: "User Coupons", icon: Gift },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "contact", label: "Contact", icon: MessageSquare },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "clv", label: "CLV Analytics", icon: TrendingUp },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "content", label: "Content", icon: FileText },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors",
                activeTab === item.id
                  ? "bg-blue-50 border-r-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
