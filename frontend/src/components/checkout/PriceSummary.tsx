import React from 'react';

interface PriceSummaryProps {
  subtotal: number;
  discount: number;
  shippingCost: number;
  estimatedTax: number;
  total: number;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  subtotal, discount, shippingCost, estimatedTax, total
}) => {
  return (
    <div>
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-[#6B7280]">Subtotal</span>
          <span className="text-foreground font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">−₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#6B7280]">Shipping</span>
          <span className="text-foreground font-medium">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#6B7280]">Estimated taxes</span>
          <span className="text-foreground font-medium">₹{estimatedTax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] my-4" />

      <div className="flex justify-between items-center">
        <span className="text-[22px] font-bold text-foreground">Total</span>
        <span className="text-[22px] font-bold text-foreground">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
      </div>

      {discount > 0 && (
        <p className="text-center text-[11px] font-medium text-green-600 mt-2">
          🎉 You're saving ₹{discount.toFixed(0)} on this order
        </p>
      )}
    </div>
  );
};

export default PriceSummary;
