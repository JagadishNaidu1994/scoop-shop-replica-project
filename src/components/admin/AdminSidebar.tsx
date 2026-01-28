
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
  Tag,
  BookOpen,
  ChefHat,
  Mail,
  RefreshCw,
  Warehouse
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
    { id: "subscriptions", label: "Subscriptions", icon: RefreshCw },
    { id: "users", label: "Users", icon: Users },
    { id: "products", label: "Products", icon: Package },
    { id: "inventory", label: "Inventory", icon: Warehouse },
    { id: "recipes", label: "Recipes", icon: ChefHat },
    { id: "journals", label: "Journals", icon: BookOpen },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "contact", label: "Contact", icon: MessageSquare },
    { id: "enquiries", label: "Enquiries", icon: Mail },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "clv", label: "CLV Analytics", icon: TrendingUp },
  ];

  return (
    <div className="w-64 sm:w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col h-screen">
      {/* Logo Section - Fixed */}
      <div className="p-4 sm:p-8 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">NASTEA</h1>
            <p className="text-xs text-slate-400">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto mt-6 px-4 pb-6 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center px-4 py-3.5 text-left rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              )}
            >
              {/* Glow effect on hover */}
              <div className={cn(
                "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity",
                !isActive && "bg-gradient-to-r from-blue-500/10 to-purple-600/10"
              )} />

              {/* Icon */}
              <div className={cn(
                "relative z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                isActive
                  ? "bg-white/20"
                  : "bg-slate-700/50 group-hover:bg-slate-700"
              )}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Label */}
              <span className="relative z-10 ml-4 font-medium">
                {item.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute right-4 w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section - Fixed at bottom */}
      <div className="p-4 sm:p-6 border-t border-slate-700/50 flex-shrink-0 mt-auto">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};
