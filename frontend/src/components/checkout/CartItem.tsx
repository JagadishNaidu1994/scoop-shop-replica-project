import React from 'react';
import { RefreshCw } from 'lucide-react';

interface CartItemProps {
  productName: string;
  productImage: string | null;
  productPrice: number;
  quantity: number;
  isSubscription?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  productName, productImage, productPrice, quantity, isSubscription
}) => {
  return (
    <div className="flex items-center gap-3 mb-4 last:mb-0">
      <div className="relative w-[60px] h-[60px] bg-[#F3F4F6] rounded-lg overflow-hidden shrink-0">
        <img
          src={productImage || '/placeholder.svg'}
          alt={productName}
          className="w-full h-full object-cover"
        />
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-white text-[11px] font-bold flex items-center justify-center">
          {quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground leading-snug truncate">{productName}</h4>
        {isSubscription && (
          <span className="text-[11px] text-[#6B7280] flex items-center gap-1 mt-0.5">
            <RefreshCw className="h-3 w-3" /> Subscription
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-foreground whitespace-nowrap">
        ₹{(productPrice * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
};

export default CartItem;
