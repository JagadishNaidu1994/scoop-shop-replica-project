import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Package, Eye, Calendar, RefreshCw, Pause, XCircle, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SubscriptionOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  subscription_frequency: string;
  order_items: OrderItem[];
  subscription_status?: string; // active, paused, cancelled
  paused_until?: string;
  next_delivery_date?: string;
}

interface OrderItem {
  id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface SubscriptionsListProps {
  preloadedOrders?: SubscriptionOrder[];
  preloadedProducts?: { [key: number]: any };
}

const SubscriptionsList: React.FC<SubscriptionsListProps> = ({
  preloadedOrders,
  preloadedProducts
}) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionOrder[]>(preloadedOrders || []);
  const [loading, setLoading] = useState(!preloadedOrders);
  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionOrder | null>(null);
  const [pauseReason, setPauseReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [pauseDuration, setPauseDuration] = useState('30'); // days
  const [newFrequency, setNewFrequency] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Update state when preloaded data changes
    if (preloadedOrders) {
      setSubscriptions(preloadedOrders);
      setLoading(false);
    }
  }, [preloadedOrders]);

  useEffect(() => {
    // Only fetch if we don't have preloaded data
    if (user && !preloadedOrders) {
      fetchSubscriptions();
    }
  }, [user, preloadedOrders]);

  const fetchSubscriptions = async () => {
    if (!user) return;

    try {
      console.log('Fetching subscriptions for user:', user.id);
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          subscription_frequency,
          next_delivery_date,
          order_items (
            id,
            product_id,
            product_name,
            product_price,
            quantity
          )
        `)
        .eq('user_id', user.id)
        .eq('is_subscription', true)
        .order('created_at', { ascending: false});

      if (ordersError) {
        console.error('Error fetching subscriptions:', ordersError);
        throw ordersError;
      }

      // Fetch subscription statuses for each order
      const { data: statusData, error: statusError } = await supabase
        .from('subscription_status')
        .select('order_id, status, paused_until')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (statusError) {
        console.error('Error fetching subscription statuses:', statusError);
      }

      // Map status to orders
      const statusMap = new Map();
      statusData?.forEach(status => {
        if (!statusMap.has(status.order_id)) {
          statusMap.set(status.order_id, status);
        }
      });

      const subscriptionsWithStatus = ordersData?.map(order => ({
        ...order,
        subscription_status: statusMap.get(order.id)?.status || 'active',
        paused_until: statusMap.get(order.id)?.paused_until
      })) || [];

      console.log('Fetched subscriptions with status:', subscriptionsWithStatus);
      setSubscriptions(subscriptionsWithStatus);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatOrderNumber = (orderNumber: string) => {
    const match = orderNumber.match(/order_(\d+)/);
    if (match) {
      const timestamp = parseInt(match[1]);
      const incrementalId = (timestamp % 10000) + 1;
      return String(incrementalId).padStart(4, '0');
    }
    return orderNumber.slice(-4).padStart(4, '0');
  };

  const getProductImage = (productId: number) => {
    if (preloadedProducts && preloadedProducts[productId]?.primary_image) {
      return preloadedProducts[productId].primary_image;
    }
    const imageMap: { [key: number]: string } = {
      1: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop",
      2: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
      3: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    };
    return imageMap[productId] || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop";
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: { [key: string]: string } = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      biweekly: 'Bi-weekly',
      quarterly: 'Quarterly'
    };
    return labels[frequency] || frequency;
  };

  const handleViewOrder = (subscription: SubscriptionOrder) => {
    navigate(`/orders/${subscription.id}`);
  };

  const handlePauseClick = (subscription: SubscriptionOrder) => {
    setSelectedSubscription(subscription);
    setPauseDialogOpen(true);
  };

  const handleCancelClick = (subscription: SubscriptionOrder) => {
    setSelectedSubscription(subscription);
    setCancelDialogOpen(true);
  };

  const handleUpdateClick = (subscription: SubscriptionOrder) => {
    setSelectedSubscription(subscription);
    setNewFrequency(subscription.subscription_frequency);
    setUpdateDialogOpen(true);
  };

  const handlePauseSubscription = async () => {
    if (!selectedSubscription || !user) return;

    setActionLoading(true);
    try {
      const pausedUntilDate = new Date();
      pausedUntilDate.setDate(pausedUntilDate.getDate() + parseInt(pauseDuration));

      // Insert subscription status
      const { error: statusError } = await supabase
        .from('subscription_status')
        .insert({
          order_id: selectedSubscription.id,
          user_id: user.id,
          status: 'paused',
          previous_status: selectedSubscription.subscription_status || 'active',
          reason: pauseReason,
          paused_until: pausedUntilDate.toISOString()
        });

      if (statusError) throw statusError;

      toast({
        title: "Subscription Paused",
        description: `Your subscription will resume on ${pausedUntilDate.toLocaleDateString()}`
      });

      setPauseDialogOpen(false);
      setPauseReason('');
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error pausing subscription:', error);
      toast({
        title: "Error",
        description: "Failed to pause subscription",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscription || !user) return;

    setActionLoading(true);
    try {
      // Insert subscription status
      const { error: statusError } = await supabase
        .from('subscription_status')
        .insert({
          order_id: selectedSubscription.id,
          user_id: user.id,
          status: 'cancelled',
          previous_status: selectedSubscription.subscription_status || 'active',
          reason: cancelReason
        });

      if (statusError) throw statusError;

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled successfully"
      });

      setCancelDialogOpen(false);
      setCancelReason('');
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateFrequency = async () => {
    if (!selectedSubscription || !user || newFrequency === selectedSubscription.subscription_frequency) {
      setUpdateDialogOpen(false);
      return;
    }

    setActionLoading(true);
    try {
      // Update order frequency
      const { error: updateError } = await supabase
        .from('orders')
        .update({ subscription_frequency: newFrequency })
        .eq('id', selectedSubscription.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Subscription Updated",
        description: `Frequency changed to ${newFrequency}`
      });

      setUpdateDialogOpen(false);
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-gray-200 bg-white rounded-2xl shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-4 bg-gray-200 rounded-xl w-32"></div>
                  <div className="h-6 bg-gray-200 rounded-xl w-20"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded-xl w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-xl w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {subscriptions.length === 0 ? (
        <Card className="border-gray-200 bg-white rounded-2xl shadow-sm">
          <CardContent className="p-8">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No active subscriptions</p>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to products and save 20% on every order
              </p>
              <Button
                onClick={() => navigate('/shop')}
                className="bg-black text-white hover:bg-gray-800 rounded-full"
              >
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id} className="border border-gray-200 bg-white shadow-sm rounded-2xl">
              {/* Subscription Header - Clickable */}
              <div
                className="border-b border-gray-200 p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-2xl"
                onClick={() => handleViewOrder(subscription)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className="bg-purple-100 text-purple-800 rounded-full">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Subscription
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 rounded-full">
                          {getFrequencyLabel(subscription.subscription_frequency)}
                        </Badge>
                        {subscription.subscription_status === 'paused' && (
                          <Badge className="bg-yellow-100 text-yellow-800 rounded-full">
                            <Pause className="h-3 w-3 mr-1" />
                            Paused
                          </Badge>
                        )}
                        {subscription.subscription_status === 'cancelled' && (
                          <Badge className="bg-red-100 text-red-800 rounded-full">
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancelled
                          </Badge>
                        )}
                        {subscription.subscription_status === 'active' && (
                          <Badge className="bg-green-100 text-green-800 rounded-full">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Order number</p>
                      <p className="font-medium text-gray-900">SUB{formatOrderNumber(subscription.order_number)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date started</p>
                      <p className="font-medium text-gray-900">
                        {new Date(subscription.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total amount</p>
                      <p className="font-medium text-gray-900">₹{subscription.total_amount}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full"
                      onClick={() => handleViewOrder(subscription)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {subscription.subscription_status !== 'cancelled' && (
                      <>
                        {subscription.subscription_status === 'paused' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-300 text-green-700 hover:bg-green-50 rounded-full"
                            onClick={() => handlePauseClick(subscription)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 rounded-full"
                            onClick={() => handlePauseClick(subscription)}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 rounded-full"
                          onClick={() => handleUpdateClick(subscription)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50 rounded-full"
                          onClick={() => handleCancelClick(subscription)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                    {subscription.subscription_status === 'cancelled' && (
                      <Badge className="bg-red-100 text-red-800 rounded-full">
                        Cancelled
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Subscription Items */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors rounded-b-2xl"
                onClick={() => handleViewOrder(subscription)}
              >
                <div className="space-y-6">
                  {subscription.order_items && subscription.order_items.length > 0 ? (
                    subscription.order_items.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={getProductImage(item.product_id)}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded-xl border border-gray-200"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900 text-lg">{item.product_name}</h3>
                            <p className="font-semibold text-gray-900 text-lg">₹{item.product_price}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Qty: {item.quantity}</p>
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Calendar className="h-4 w-4" />
                            <span>Next delivery: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No items found for this subscription</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pause Dialog */}
      <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSubscription?.subscription_status === 'paused' ? 'Resume Subscription' : 'Pause Subscription'}
            </DialogTitle>
            <DialogDescription>
              {selectedSubscription?.subscription_status === 'paused'
                ? 'Your subscription will resume immediately.'
                : 'Your subscription will be paused and you can resume it anytime.'}
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription?.subscription_status !== 'paused' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="pause-duration">Pause Duration</Label>
                <Select value={pauseDuration} onValueChange={setPauseDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">1 Month</SelectItem>
                    <SelectItem value="60">2 Months</SelectItem>
                    <SelectItem value="90">3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pause-reason">Reason (Optional)</Label>
                <Textarea
                  id="pause-reason"
                  value={pauseReason}
                  onChange={(e) => setPauseReason(e.target.value)}
                  placeholder="Let us know why you're pausing..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPauseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePauseSubscription} disabled={actionLoading}>
              {actionLoading ? 'Processing...' : selectedSubscription?.subscription_status === 'paused' ? 'Resume' : 'Pause'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this subscription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="cancel-reason">Reason (Optional)</Label>
            <Textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Help us improve by sharing why you're cancelling..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription} disabled={actionLoading}>
              {actionLoading ? 'Processing...' : 'Cancel Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Frequency Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Subscription Frequency</DialogTitle>
            <DialogDescription>
              Change how often you receive your subscription orders.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="new-frequency">Delivery Frequency</Label>
            <Select value={newFrequency} onValueChange={setNewFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFrequency} disabled={actionLoading}>
              {actionLoading ? 'Updating...' : 'Update Frequency'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsList;
