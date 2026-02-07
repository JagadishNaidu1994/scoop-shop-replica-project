
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, Gift } from 'lucide-react';
import { useShippingCalculator } from '@/hooks/useShippingCalculator';

interface ShippingCalculatorProps {
  orderTotal: number;
  onShippingSelect?: (method: any) => void;
}

const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({ 
  orderTotal, 
  onShippingSelect 
}) => {
  const [pincode, setPincode] = useState('');
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const { calculateShipping, loading } = useShippingCalculator();

  const handleCalculate = () => {
    if (pincode.length >= 6) {
      const result = calculateShipping(pincode, orderTotal);
      setShippingInfo(result);
      setSelectedMethod(null);
    }
  };

  const handleMethodSelect = (method: any) => {
    setSelectedMethod(method);
    onShippingSelect?.(method);
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 rounded-lg"></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter pincode (e.g., 500001)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            maxLength={6}
          />
          <Button onClick={handleCalculate} disabled={pincode.length < 6}>
            Calculate
          </Button>
        </div>

        {shippingInfo && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Shipping to: {shippingInfo.zone || 'Remote Area'}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery: {shippingInfo.deliveryDays}</span>
            </div>

            {shippingInfo.isFreeShipping && (
              <div className="flex items-center gap-2 text-green-600">
                <Gift className="h-4 w-4" />
                <span className="font-medium">Free shipping available!</span>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">Available shipping methods:</h4>
              {shippingInfo.availableMethods.map((method: any) => (
                <div
                  key={method.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod?.id === method.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleMethodSelect(method)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                      <div className="text-sm text-gray-500">
                        Estimated: {method.estimated_days}
                      </div>
                    </div>
                    <div className="text-right">
                      {method.total_cost === 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          FREE
                        </Badge>
                      ) : (
                        <div className="font-semibold">₹{method.total_cost}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingCalculator;
