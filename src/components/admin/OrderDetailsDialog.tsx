
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, CreditCard, Calendar, Truck } from 'lucide-react';

interface OrderDetailsDialogProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({ order, open, onOpenChange }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Order #{order.order_number}
            <Badge 
              variant={order.status === 'delivered' ? 'default' : order.status === 'shipped' ? 'secondary' : 'outline'}
            >
              {order.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Order details and tracking information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Order Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span>Order Total:</span>
                <span className="font-semibold">£{order.total_amount}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Shipping:</span>
                <span>£{order.shipping_cost || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Payment Method:</span>
                <span>{order.payment_method || 'Card'}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Shipping Address
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {order.shipping_address ? (
                <div>
                  <p>{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.address_line1}</p>
                  {order.shipping_address.address_line2 && (
                    <p>{order.shipping_address.address_line2}</p>
                  )}
                  <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                  <p>{order.shipping_address.pincode}</p>
                  <p>{order.shipping_address.phone}</p>
                </div>
              ) : (
                <p>No shipping address provided</p>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Order Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              {order.shipped_at && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Shipped</p>
                    <p className="text-xs text-gray-500">{new Date(order.shipped_at).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {order.delivered_at && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Delivered</p>
                    <p className="text-xs text-gray-500">{new Date(order.delivered_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tracking Information */}
          {order.tracking_number && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Tracking Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">Tracking Number: {order.tracking_number}</p>
                {order.estimated_delivery_date && (
                  <p className="text-sm text-gray-600 mt-1">
                    Estimated Delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1">
              Update Status
            </Button>
            <Button variant="outline" className="flex-1">
              Add Tracking
            </Button>
            <Button variant="outline" className="flex-1">
              Print Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
