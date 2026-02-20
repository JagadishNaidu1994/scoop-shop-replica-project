// Delhivery API Integration Service
// Documentation: https://www.delhivery.com/api-docs/

export interface DelhiveryOrder {
  name: string;
  company_name?: string;
  address: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  email?: string;
  order_type: string;
  payment_mode: string;
  order_amount: number;
  order_date: string;
  waybill?: string;
  shipping_charges: number;
  cod_charges?: number;
  discount?: number;
  total_amount: number;
  product_details: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  seller_name?: string;
  seller_address?: string;
  seller_city?: string;
  seller_state?: string;
  seller_pincode?: string;
  seller_country?: string;
}

export interface DelhiveryResponse {
  success: boolean;
  packages?: {
    waybill: string;
    order_id: string;
    reference_number: string;
    status: string;
    shipment_status: string;
    tracking_url?: string;
  }[];
  error?: string;
}

class DelhiveryService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = '4f2d9b317b5f3e808bbc435500d087c120ae48fe';
    this.baseUrl = 'https://track.delhivery.com/api';
  }

  /**
   * Create a new shipment order in Delhivery
   */
  async createShipment(orderData: DelhiveryOrder): Promise<DelhiveryResponse> {
    try {
      console.log('Creating Delhivery shipment:', orderData);

      const response = await fetch(`${this.baseUrl}/c/create-in-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.apiKey}`,
        },
        body: JSON.stringify({
          format: 'json',
          data: {
            shipments: [orderData]
          }
        }),
      });

      const result = await response.json();
      console.log('Delhivery response:', result);

      if (result.success) {
        return {
          success: true,
          packages: result.packages || []
        };
      } else {
        return {
          success: false,
          packages: [],
          error: result.error || 'Failed to create shipment'
        };
      }
    } catch (error) {
      console.error('Delhivery API Error:', error);
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * Track shipment status
   */
  async trackShipment(waybill: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/track/packages/waybill/${waybill}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Delhivery tracking error:', error);
      return null;
    }
  }

  /**
   * Get service availability for a pincode
   */
  async checkServiceability(pincode: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/kinko/v1/pincodes/${pincode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Delhivery serviceability check error:', error);
      return null;
    }
  }

  /**
   * Format order data for Delhivery
   */
  formatOrderData(orderData: any, shippingAddress: any, items: any[]): DelhiveryOrder {
    const productDetails = items.map(item => ({
      sku: `product_${item.product_id}`,
      name: item.product_name,
      quantity: item.quantity,
      price: item.product_price
    }));

    return {
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      company_name: 'NASTEA',
      address: shippingAddress.address,
      address_line2: shippingAddress.addressLine2 || '',
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.postalCode,
      country: shippingAddress.country || 'India',
      phone: shippingAddress.phone,
      email: orderData.user_email || '',
      order_type: 'delivery',
      payment_mode: orderData.payment_method === 'card' ? 'Prepaid' : 'COD',
      order_amount: orderData.total_amount,
      order_date: new Date().toISOString().split('T')[0],
      waybill: '',
      shipping_charges: orderData.shipping_cost || 0,
      cod_charges: 0,
      discount: 0,
      total_amount: orderData.total_amount,
      product_details: productDetails,
      seller_name: 'NASTEA',
      seller_address: 'Your Business Address',
      seller_city: 'Your City',
      seller_state: 'Your State',
      seller_pincode: 'Your Pincode',
      seller_country: 'India'
    };
  }
}

export const delhiveryService = new DelhiveryService();
