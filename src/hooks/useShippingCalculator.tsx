
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ShippingZone {
  id: string;
  zone_name: string;
  pincodes: string[];
  base_rate: number;
  per_kg_rate: number;
  free_shipping_threshold: number;
  delivery_days: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  base_rate: number;
  estimated_days: string;
}

export const useShippingCalculator = () => {
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShippingData();
  }, []);

  const fetchShippingData = async () => {
    try {
      const [zonesResponse, methodsResponse] = await Promise.all([
        supabase.from('shipping_zones').select('*'),
        supabase.from('shipping_methods').select('*').eq('is_active', true)
      ]);

      if (zonesResponse.data) setShippingZones(zonesResponse.data);
      if (methodsResponse.data) setShippingMethods(methodsResponse.data);
    } catch (error) {
      console.error('Error fetching shipping data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateShipping = (pincode: string, orderTotal: number = 0, weight: number = 1) => {
    const zone = shippingZones.find(zone => 
      zone.pincodes.includes(pincode)
    );

    if (!zone) {
      return {
        zone: null,
        baseRate: 300,
        finalRate: 300,
        deliveryDays: '10-15 days',
        isFreeShipping: false,
        availableMethods: shippingMethods
      };
    }

    const baseShippingCost = zone.base_rate + (zone.per_kg_rate * weight);
    const isFreeShipping = orderTotal >= zone.free_shipping_threshold;
    const finalRate = isFreeShipping ? 0 : baseShippingCost;

    return {
      zone: zone.zone_name,
      baseRate: baseShippingCost,
      finalRate,
      deliveryDays: zone.delivery_days,
      isFreeShipping,
      availableMethods: shippingMethods.map(method => ({
        ...method,
        total_cost: finalRate + method.base_rate
      }))
    };
  };

  return {
    shippingZones,
    shippingMethods,
    loading,
    calculateShipping
  };
};
