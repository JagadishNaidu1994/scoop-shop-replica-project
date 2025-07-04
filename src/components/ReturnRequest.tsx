
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, Package } from 'lucide-react';

interface ReturnRequestProps {
  order: any;
  onReturnRequested?: () => void;
}

const ReturnRequest: React.FC<ReturnRequestProps> = ({ order, onReturnRequested }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const calculateRefundAmount = () => {
    if (!order.order_items) return 0;
    
    return order.order_items
      .filter((item: any) => selectedItems.includes(item.id))
      .reduce((total: number, item: any) => total + (item.product_price * item.quantity), 0);
  };

  const handleSubmitReturn = async () => {
    if (!user || selectedItems.length === 0 || !reason) {
      toast({
        title: "Missing information",
        description: "Please select items and provide a reason for return",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const refundAmount = calculateRefundAmount();
      
      // Create return request
      const { data: returnData, error: returnError } = await supabase
        .from('returns')
        .insert({
          order_id: order.id,
          user_id: user.id,
          reason: `${reason}${details ? ` - ${details}` : ''}`,
          refund_amount: refundAmount,
          status: 'requested'
        })
        .select()
        .single();

      if (returnError) throw returnError;

      // Create return items
      const returnItems = selectedItems.map(itemId => ({
        return_id: returnData.id,
        order_item_id: itemId,
        quantity: 1, // For simplicity, assuming full quantity return
        reason: reason
      }));

      const { error: itemsError } = await supabase
        .from('return_items')
        .insert(returnItems);

      if (itemsError) throw itemsError;

      toast({
        title: "Return request submitted",
        description: "Your return request has been submitted and will be reviewed shortly."
      });

      onReturnRequested?.();
    } catch (error) {
      console.error('Error submitting return:', error);
      toast({
        title: "Error",
        description: "Failed to submit return request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Request Return/Refund
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Select items to return:</Label>
          <div className="mt-2 space-y-2">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={item.id}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => handleItemSelect(item.id)}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.product_name}</div>
                  <div className="text-sm text-gray-600">
                    Quantity: {item.quantity} × ₹{item.product_price}
                  </div>
                </div>
                <div className="font-medium">
                  ₹{(item.product_price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="reason">Reason for return</Label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          >
            <option value="">Select a reason</option>
            <option value="Defective product">Defective product</option>
            <option value="Wrong item received">Wrong item received</option>
            <option value="Item not as described">Item not as described</option>
            <option value="Changed mind">Changed mind</option>
            <option value="Product damaged during shipping">Product damaged during shipping</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <Label htmlFor="details">Additional details (optional)</Label>
          <Textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Please provide any additional details about the return..."
            className="mt-1"
          />
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center font-medium">
              <span>Estimated refund amount:</span>
              <span>₹{calculateRefundAmount().toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Final refund amount will be calculated after inspection
            </p>
          </div>
        )}

        <Button
          onClick={handleSubmitReturn}
          disabled={loading || selectedItems.length === 0 || !reason}
          className="w-full bg-black text-white hover:bg-gray-800"
        >
          {loading ? 'Submitting...' : 'Submit Return Request'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReturnRequest;
