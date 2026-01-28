
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

interface OrderItem {
  id: string;
  product_id: number;
  quantity: number;
  product_price: number;
  product_name: string;
  products?: {
    name: string;
    image_url?: string;
  } | null;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address?: any;
  order_items?: OrderItem[];
  user_email?: string;
  order_number?: string;
}

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: () => void;
}

const OrderDetailsDialog = ({ order, isOpen, onClose, onOrderUpdated }: OrderDetailsDialogProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Status management states
  const [selectedStatus, setSelectedStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("FedEx");

  useEffect(() => {
    if (order && isOpen) {
      fetchOrderDetails();
      setSelectedStatus(order.status || "pending");
      setTrackingNumber("");
      setCarrier("FedEx");
    }
  }, [order, isOpen]);

  const fetchOrderDetails = async () => {
    if (!order) return;

    setLoading(true);
    try {
      // Fetch order items with product details
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          id,
          product_id,
          quantity,
          product_price,
          product_name,
          created_at,
          order_id
        `)
        .eq("order_id", order.id);

      if (itemsError) throw itemsError;

      // Transform the data to match OrderItem interface
      const transformedItems: OrderItem[] = (items || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product_price: item.product_price,
        product_name: item.product_name,
        products: null
      }));

      setOrderItems(transformedItems);

      // Fetch user email from profiles table
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", order.user_id)
        .single();

      if (userError) {
        console.error("Error fetching user profile:", userError);
        setUserEmail("N/A");
      } else {
        setUserEmail(userData?.email || "N/A");
      }

    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) {
      console.error("No order found");
      return;
    }

    console.log("Updating order:", order.id, "to status:", newStatus);
    setUpdating(true);

    try {
      // Update order status
      const { data: updateData, error: orderError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id)
        .select();

      if (orderError) {
        console.error("Order update error:", orderError);
        throw new Error(`Failed to update order: ${orderError.message}`);
      }

      console.log("Order updated successfully:", updateData);

      // Add tracking entry
      const trackingMessage = `Order status updated to ${newStatus}`;
      const { data: trackingData, error: trackingError } = await supabase
        .from("order_tracking")
        .insert({
          order_id: order.id,
          status: newStatus,
          message: trackingNumber
            ? `${trackingMessage}. Tracking: ${carrier} - ${trackingNumber}`
            : trackingMessage,
          location: trackingNumber ? `${carrier} - ${trackingNumber}` : null
        })
        .select();

      if (trackingError) {
        console.error("Error adding tracking:", trackingError);
        // Don't throw here - tracking is optional
      } else {
        console.log("Tracking added successfully:", trackingData);
      }

      toast({
        title: "Order Updated Successfully",
        description: `Order #${orderNumber} status changed to ${newStatus}`,
      });

      // Call callback to refresh parent
      if (onOrderUpdated) {
        onOrderUpdated();
      }

      // Close dialog after successful update
      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update order status. Please check console for details.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickStatusUpdate = async (status: string) => {
    setSelectedStatus(status);
    await updateOrderStatus(status);
  };

  if (!order) return null;

  const generateOrderNumber = (orderId: string, createdAt: string) => {
    const date = new Date(createdAt);
    const timestamp = Math.floor(date.getTime() / 1000);
    return String(timestamp).slice(-6);
  };

  const orderNumber = order.order_number || generateOrderNumber(order.id, order.created_at);
  const shippingAddress = order.shipping_address;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
  const discount = 5.00;
  const deliveryFee = 0.00;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 shadow-2xl bg-white">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Order #{orderNumber}
            </DialogTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Order Created</span>
              <span>
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span>
                {new Date(order.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer & Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Management */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status Management
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">Current Status:</Label>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </Badge>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {order.status === 'pending' && (
                    <Button
                      type="button"
                      onClick={() => handleQuickStatusUpdate('processing')}
                      disabled={updating}
                      className="rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white"
                      size="sm"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {updating ? "Updating..." : "Mark as Processing"}
                    </Button>
                  )}
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <Button
                      type="button"
                      onClick={() => handleQuickStatusUpdate('shipped')}
                      disabled={updating}
                      className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
                      size="sm"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      {updating ? "Updating..." : "Mark as Shipped"}
                    </Button>
                  )}
                  {order.status === 'shipped' && (
                    <Button
                      type="button"
                      onClick={() => handleQuickStatusUpdate('delivered')}
                      disabled={updating}
                      className="rounded-xl bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {updating ? "Updating..." : "Mark as Delivered"}
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Manual Status Update with Tracking */}
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="status" className="text-sm">Update Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger id="status" className="rounded-xl mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedStatus === 'shipped' && (
                    <>
                      <div>
                        <Label htmlFor="carrier" className="text-sm">Carrier</Label>
                        <Select value={carrier} onValueChange={setCarrier}>
                          <SelectTrigger id="carrier" className="rounded-xl mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FedEx">FedEx</SelectItem>
                            <SelectItem value="UPS">UPS</SelectItem>
                            <SelectItem value="USPS">USPS</SelectItem>
                            <SelectItem value="DHL">DHL</SelectItem>
                            <SelectItem value="India Post">India Post</SelectItem>
                            <SelectItem value="Delhivery">Delhivery</SelectItem>
                            <SelectItem value="BlueDart">BlueDart</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="tracking" className="text-sm">Tracking Number</Label>
                        <Input
                          id="tracking"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="Enter tracking number..."
                          className="rounded-xl mt-1"
                        />
                      </div>
                    </>
                  )}

                  <Button
                    type="button"
                    onClick={() => updateOrderStatus(selectedStatus)}
                    disabled={updating || selectedStatus === order.status}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    {updating ? "Updating..." : "Update Order Status"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📋</span> Customer Details
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="font-medium">{shippingAddress?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-blue-600">{userEmail}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="font-medium">{shippingAddress?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📍</span> Delivery Address
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Address Line</label>
                    <p className="font-medium">{shippingAddress?.address_line_1 || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Flat / Building Name</label>
                    <p className="font-medium">{shippingAddress?.address_line_2 || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">City</label>
                    <p className="font-medium">{shippingAddress?.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Postcode</label>
                    <p className="font-medium">{shippingAddress?.pincode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Item Summary</h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                  <div className="col-span-1">QTY</div>
                  <div className="col-span-1">Price</div>
                  <div className="col-span-2">Total Price</div>
                  <div className="col-span-8">Product</div>
                </div>
                {loading ? (
                  <div className="p-4 text-center">Loading items...</div>
                ) : orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center">
                      <div className="col-span-1 text-center font-medium">x{item.quantity}</div>
                      <div className="col-span-1 font-medium">₹{item.product_price}</div>
                      <div className="col-span-2 font-bold">₹{(item.product_price * item.quantity).toFixed(2)}</div>
                      <div className="col-span-8 flex items-center gap-4">
                        <img
                          src={item.products?.image_url || '/placeholder.svg'}
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded bg-gray-100"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.product_name}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No items found</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order History & Summary */}
          <div className="space-y-6">
            {/* Order History */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order History</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className={`font-medium ${order.status === 'delivered' ? 'text-black' : 'text-gray-600'}`}>Delivered</p>
                    <p className="text-xs text-gray-500">
                      {order.status === 'delivered' ? new Date(order.created_at).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className={`${['shipped', 'delivered'].includes(order.status) ? 'text-black' : 'text-gray-600'}`}>Shipped</p>
                    <p className="text-xs text-gray-500">
                      {['shipped', 'delivered'].includes(order.status) ? new Date(order.created_at).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className={`${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-black' : 'text-gray-600'}`}>Processing</p>
                    <p className="text-xs text-gray-500">
                      {['processing', 'shipped', 'delivered'].includes(order.status) ? new Date(order.created_at).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <div>
                    <p className="text-black">Order Placed</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span>Card - ****</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span>₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{order.total_amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
