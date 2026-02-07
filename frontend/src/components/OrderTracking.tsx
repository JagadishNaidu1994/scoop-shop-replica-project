
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

interface OrderTrackingProps {
  orderId: string;
}

interface TrackingEvent {
  id: string;
  status: string;
  message: string;
  location: string;
  created_at: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackingData();
  }, [orderId]);

  const fetchTrackingData = async () => {
    try {
      const { data, error } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrackingEvents(data || []);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order_placed':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'out_for_delivery':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'order_placed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trackingEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No tracking information available yet.
          </p>
        ) : (
          <div className="space-y-4">
            {trackingEvents.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(event.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(event.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {event.message && (
                    <p className="text-sm text-gray-700 mb-1">{event.message}</p>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                {index < trackingEvents.length - 1 && (
                  <div className="absolute left-5 mt-8 w-px h-6 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTracking;
