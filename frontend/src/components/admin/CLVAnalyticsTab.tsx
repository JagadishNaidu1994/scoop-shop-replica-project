
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaDownload, FaTrophy, FaUser, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface CustomerCLV {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  total_spent: number;
  total_orders: number;
  avg_order_value: number;
  first_order_date: string | null;
  last_order_date: string | null;
  customer_lifetime_days: number | null;
}

const CLVAnalyticsTab = () => {
  const [customers, setCustomers] = useState<CustomerCLV[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    avgCLV: 0,
    topCustomerValue: 0,
    totalRevenue: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCLVData();
  }, []);

  const fetchCLVData = async () => {
    setLoading(true);
    try {
      // Since customer_lifetime_value view doesn't exist, let's calculate CLV from existing tables
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total_amount, created_at');

      if (ordersError) throw ordersError;

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name');

      if (profilesError) throw profilesError;

      // Calculate CLV from orders
      const customerData: { [key: string]: CustomerCLV } = {};

      orders?.forEach(order => {
        if (!order.user_id) return;

        if (!customerData[order.user_id]) {
          const profile = profiles?.find(p => p.id === order.user_id);
          customerData[order.user_id] = {
            user_id: order.user_id,
            email: profile?.email || '',
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
            total_spent: 0,
            total_orders: 0,
            avg_order_value: 0,
            first_order_date: order.created_at,
            last_order_date: order.created_at,
            customer_lifetime_days: null
          };
        }

        const customer = customerData[order.user_id];
        customer.total_spent += Number(order.total_amount);
        customer.total_orders += 1;

        // Update date ranges
        if (new Date(order.created_at) < new Date(customer.first_order_date!)) {
          customer.first_order_date = order.created_at;
        }
        if (new Date(order.created_at) > new Date(customer.last_order_date!)) {
          customer.last_order_date = order.created_at;
        }

        // Calculate lifetime days
        if (customer.first_order_date && customer.last_order_date) {
          const firstDate = new Date(customer.first_order_date);
          const lastDate = new Date(customer.last_order_date);
          customer.customer_lifetime_days = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
        }

        // Calculate average order value
        customer.avg_order_value = customer.total_spent / customer.total_orders;
      });

      const customerArray = Object.values(customerData).sort((a, b) => b.total_spent - a.total_spent);
      setCustomers(customerArray);

      // Calculate statistics
      const totalCustomers = customerArray.length;
      const totalRevenue = customerArray.reduce((sum, customer) => sum + customer.total_spent, 0);
      const avgCLV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
      const topCustomerValue = customerArray.length > 0 ? customerArray[0].total_spent : 0;

      setStats({
        totalCustomers,
        avgCLV,
        topCustomerValue,
        totalRevenue
      });

    } catch (error) {
      console.error('Error fetching CLV data:', error);
      toast({
        title: "Error",
        description: "Failed to load customer analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Rank',
      'Customer Email',
      'Customer Name',
      'Total Spent',
      'Total Orders',
      'Average Order Value',
      'First Order',
      'Last Order',
      'Customer Lifetime (Days)'
    ];

    const csvContent = [
      headers.join(','),
      ...customers.map((customer, index) => [
        index + 1,
        customer.email,
        `"${customer.first_name || ''} ${customer.last_name || ''}".trim()`,
        customer.total_spent,
        customer.total_orders,
        customer.avg_order_value.toFixed(2),
        customer.first_order_date ? new Date(customer.first_order_date).toLocaleDateString() : '',
        customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : '',
        customer.customer_lifetime_days || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer_clv_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "CLV data exported successfully",
    });
  };

  const getCustomerTier = (totalSpent: number) => {
    if (totalSpent >= 10000) return { tier: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (totalSpent >= 5000) return { tier: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    if (totalSpent >= 2000) return { tier: 'Silver', color: 'bg-gray-100 text-gray-800' };
    return { tier: 'Bronze', color: 'bg-orange-100 text-orange-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Customer Lifetime Value Analysis</h2>
        <Button onClick={exportToCSV} variant="outline" className="rounded-2xl">
          <FaDownload className="mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <FaUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FaDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CLV</CardTitle>
            <FaShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.avgCLV.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Customer Value</CardTitle>
            <FaTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.topCustomerValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer CLV Table */}
      <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Customer Rankings by Lifetime Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl shadow-xl border border-slate-200 overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Avg Order Value</TableHead>
                  <TableHead>First Order</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Lifetime (Days)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Loading customer data...
                    </TableCell>
                  </TableRow>
                ) : customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No customer data found
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer, index) => {
                    const tier = getCustomerTier(customer.total_spent);
                    return (
                      <TableRow key={customer.user_id}>
                        <TableCell>
                          <div className="flex items-center">
                            {index < 3 && <FaTrophy className={`mr-2 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} />}
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.email}</p>
                            {(customer.first_name || customer.last_name) && (
                              <p className="text-sm text-muted-foreground">
                                {customer.first_name} {customer.last_name}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${tier.color} rounded-2xl`}>
                            {tier.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{customer.total_spent.toFixed(2)}
                        </TableCell>
                        <TableCell>{customer.total_orders}</TableCell>
                        <TableCell>₹{customer.avg_order_value.toFixed(2)}</TableCell>
                        <TableCell>
                          {customer.first_order_date 
                            ? new Date(customer.first_order_date).toLocaleDateString()
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          {customer.last_order_date 
                            ? new Date(customer.last_order_date).toLocaleDateString()
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          {customer.customer_lifetime_days || 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CLVAnalyticsTab;
