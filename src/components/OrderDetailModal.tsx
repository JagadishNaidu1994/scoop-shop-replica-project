
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, CheckCircle, Download } from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onDownloadInvoice: (order: any) => void;
  getProductImage: (productId: number) => string;
  getProductName: (item: any) => string;
  getProductDescription: (productId: number) => string;
  formatOrderNumber: (orderNumber: string) => string;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onDownloadInvoice,
  getProductImage,
  getProductName,
  getProductDescription,
  formatOrderNumber
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Order Details - WU{formatOrderNumber(order.order_number)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="font-medium text-gray-900">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="font-medium text-gray-900">₹{order.total_amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <Badge className={`${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              } rounded-full`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item: any, index: number) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 p-4 border border-gray-200 rounded-xl">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={getProductImage(item.product_id)}
                        alt={getProductName(item)}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{getProductName(item)}</h4>
                      <p className="text-sm text-gray-600 mb-2">{getProductDescription(item.product_id)}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-semibold text-gray-900">₹{item.product_price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No items found for this order</p>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Status */}
          {order.status === 'delivered' && (
            <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                Delivered on {order.delivered_at ? 
                  new Date(order.delivered_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 
                  new Date(order.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                }
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button 
              onClick={() => onDownloadInvoice(order)}
              className="bg-black text-white hover:bg-gray-800 rounded-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="border-gray-300 rounded-full"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
