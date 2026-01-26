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
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paused</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.paused}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Subscriptions Management</CardTitle>
            <div className="flex gap-2">
              <Button onClick={fetchSubscriptions} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportToCSV} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order number, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Next Delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No subscriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        #{sub.order_number.slice(-4).padStart(4, '0')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{sub.user_name}</div>
                          <div className="text-sm text-gray-500">{sub.user_email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{sub.subscription_frequency}</TableCell>
                      <TableCell>₹{sub.total_amount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(sub.subscription_status)}</TableCell>
                      <TableCell>
                        {new Date(sub.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {sub.next_delivery_date ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(sub.next_delivery_date).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not set</span>
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
