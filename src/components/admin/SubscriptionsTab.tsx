import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RefreshCw, Download, Search, Calendar, User, Package } from 'lucide-react';

interface Subscription {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  subscription_frequency: string;
  created_at: string;
  next_delivery_date: string | null;
  status: string;
  subscription_status: string;
  user_email: string;
  user_name: string;
  paused_until: string | null;
  cancelled_at: string | null;
  cancel_reason: string | null;
}

const SubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);

      // Fetch all subscription orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          user_id,
          total_amount,
          subscription_frequency,
          created_at,
          next_delivery_date,
          status
        `)
        .eq('is_subscription', true)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch subscription statuses
      const { data: statusData, error: statusError } = await supabase
        .from('subscription_status')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusError) console.error('Error fetching statuses:', statusError);

      // Fetch user details
      const userIds = [...new Set(ordersData?.map(o => o.user_id) || [])];
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      if (usersError) console.error('Error fetching users:', usersError);

      // Map everything together
      const statusMap = new Map();
      statusData?.forEach(status => {
        if (!statusMap.has(status.order_id)) {
          statusMap.set(status.order_id, status);
        }
      });

      const usersMap = new Map();
      usersData?.forEach(user => {
        usersMap.set(user.id, user);
      });

      const subscriptionsWithDetails = ordersData?.map(order => {
        const statusInfo = statusMap.get(order.id);
        const userInfo = usersMap.get(order.user_id);

        return {
          ...order,
          subscription_status: statusInfo?.status || 'active',
          paused_until: statusInfo?.paused_until || null,
          cancelled_at: statusInfo?.status === 'cancelled' ? statusInfo.created_at : null,
          cancel_reason: statusInfo?.reason || null,
          user_email: userInfo?.email || 'N/A',
          user_name: userInfo?.full_name || 'N/A'
        };
      }) || [];

      setSubscriptions(subscriptionsWithDetails);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscriptions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const filtered = getFilteredSubscriptions();

    // CSV Headers
    const headers = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Frequency',
      'Total Amount',
      'Status',
      'Subscription Status',
      'Created Date',
      'Next Delivery',
      'Paused Until',
      'Cancelled At',
      'Cancel Reason'
    ];

    // CSV Rows
    const rows = filtered.map(sub => [
      sub.order_number,
      sub.user_name,
      sub.user_email,
      sub.subscription_frequency,
      sub.total_amount.toFixed(2),
      sub.status,
      sub.subscription_status,
      new Date(sub.created_at).toLocaleDateString(),
      sub.next_delivery_date ? new Date(sub.next_delivery_date).toLocaleDateString() : 'N/A',
      sub.paused_until ? new Date(sub.paused_until).toLocaleDateString() : 'N/A',
      sub.cancelled_at ? new Date(sub.cancelled_at).toLocaleDateString() : 'N/A',
      sub.cancel_reason || 'N/A'
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Export Complete',
      description: `${filtered.length} subscriptions exported to CSV`
    });
  };

  const getFilteredSubscriptions = () => {
    return subscriptions.filter(sub => {
      // Status filter
      if (statusFilter !== 'all' && sub.subscription_status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          sub.order_number.toLowerCase().includes(query) ||
          sub.user_name.toLowerCase().includes(query) ||
          sub.user_email.toLowerCase().includes(query)
        );
      }

      return true;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-3 py-1 shadow-sm">Active</Badge>;
      case 'paused':
        return <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl px-3 py-1 shadow-sm">Paused</Badge>;
      case 'cancelled':
        return <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl px-3 py-1 shadow-sm">Cancelled</Badge>;
      default:
        return <Badge className="bg-gradient-to-r from-slate-500 to-slate-700 text-white rounded-xl px-3 py-1 shadow-sm">{status}</Badge>;
    }
  };

  const filteredSubscriptions = getFilteredSubscriptions();

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.subscription_status === 'active').length,
    paused: subscriptions.filter(s => s.subscription_status === 'paused').length,
    cancelled: subscriptions.filter(s => s.subscription_status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Stats Cards with Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Subscriptions */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-2">Total Subscriptions</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700 mb-2">Active</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paused */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-700 mb-2">Paused</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">{stats.paused}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancelled */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-red-50 to-rose-100 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-red-700 mb-2">Cancelled</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">{stats.cancelled}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Filters and Actions Card */}
      <Card className="border-none shadow-xl rounded-3xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="border-b border-slate-100 pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Subscriptions Management
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">Monitor and manage all subscription orders</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchSubscriptions}
                variant="outline"
                size="sm"
                className="rounded-2xl border-slate-200 hover:bg-slate-50 transition-all duration-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={exportToCSV}
                size="sm"
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search by order number, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-slate-50 hover:bg-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-56 py-6 rounded-2xl border-slate-200 bg-slate-50 hover:bg-white transition-all">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="all" className="rounded-xl">All Status</SelectItem>
                <SelectItem value="active" className="rounded-xl">Active</SelectItem>
                <SelectItem value="paused" className="rounded-xl">Paused</SelectItem>
                <SelectItem value="cancelled" className="rounded-xl">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Modern Table */}
          <div className="border border-slate-200 rounded-3xl overflow-hidden overflow-x-auto bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 border-b-2 border-slate-200">
                  <TableHead className="font-bold text-slate-700 py-4">Order #</TableHead>
                  <TableHead className="font-bold text-slate-700">Customer</TableHead>
                  <TableHead className="font-bold text-slate-700">Frequency</TableHead>
                  <TableHead className="font-bold text-slate-700">Amount</TableHead>
                  <TableHead className="font-bold text-slate-700">Status</TableHead>
                  <TableHead className="font-bold text-slate-700">Created</TableHead>
                  <TableHead className="font-bold text-slate-700">Next Delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Package className="h-12 w-12 text-slate-300" />
                        <p className="font-medium">No subscriptions found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions.map((sub, index) => (
                    <TableRow
                      key={sub.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        index !== filteredSubscriptions.length - 1 ? 'border-b border-slate-100' : ''
                      }`}
                    >
                      <TableCell className="font-bold text-slate-900 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {sub.order_number.slice(-2)}
                            </span>
                          </div>
                          #{sub.order_number.slice(-4).padStart(4, '0')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-slate-900">{sub.user_name}</div>
                          <div className="text-sm text-slate-500">{sub.user_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="capitalize bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl px-3 py-1">
                          {sub.subscription_frequency}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-slate-900">₹{sub.total_amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(sub.subscription_status)}</TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {sub.next_delivery_date ? (
                          <div className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl w-fit">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(sub.next_delivery_date).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">Not set</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsTab;
