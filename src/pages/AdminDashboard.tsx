
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import DashboardOverview from "@/components/admin/DashboardOverview";
import OrdersTab from "@/components/admin/OrdersTab";
import UsersTab from "@/components/admin/UsersTab";
import ReviewsTab from "@/components/admin/ReviewsTab";
import ContactSubmissionsTab from "@/components/admin/ContactSubmissionsTab";
import ShippingTab from "@/components/admin/ShippingTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import CLVAnalyticsTab from "@/components/admin/CLVAnalyticsTab";
import ExpensesTab from "@/components/admin/ExpensesTab";
import { CouponsTab } from "@/components/admin/CouponsTab";
import { UserCouponsTab } from "@/components/admin/UserCouponsTab";
import ContentTab from "@/components/admin/ContentTab";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdminCheck();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "orders":
        return <OrdersTab />;
      case "users":
        return <UsersTab />;
      case "coupons":
        return <CouponsTab />;
      case "user-coupons":
        return <UserCouponsTab />;
      case "reviews":
        return <ReviewsTab />;
      case "contact":
        return <ContactSubmissionsTab />;
      case "shipping":
        return <ShippingTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "clv":
        return <CLVAnalyticsTab />;
      case "expenses":
        return <ExpensesTab />;
      case "content":
        return <ContentTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
