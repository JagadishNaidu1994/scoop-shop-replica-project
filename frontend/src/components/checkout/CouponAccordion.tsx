import React, { useState } from 'react';
import { ChevronDown, Tag, Gift, Clock } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  expires_at: string | null;
  description?: string;
  assigned_users?: string;
}

interface CouponAccordionProps {
  availableCoupons: Coupon[];
  subtotal: number;
  onApply: (code: string) => void;
  loading: boolean;
  userEmail?: string;
}

const CouponAccordion: React.FC<CouponAccordionProps> = ({
  availableCoupons, subtotal, onApply, loading, userEmail
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const personalCoupons = availableCoupons.filter(c => !!c.assigned_users);
  const globalCoupons = availableCoupons.filter(c => !c.assigned_users);

  const formatExpiry = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left"
        aria-expanded={isOpen}
        aria-controls="coupon-panel"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Tag className="h-4 w-4" />
          {availableCoupons.length > 0
            ? `View available coupons (${availableCoupons.length})`
            : 'View available coupons'}
        </span>
        <ChevronDown className={`h-4 w-4 text-[#6B7280] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        id="coupon-panel"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
      >
        {availableCoupons.length === 0 ? (
          <p className="text-sm text-[#9CA3AF] py-3">No coupons available right now.</p>
        ) : (
          <div className="space-y-4">
          {personalCoupons.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5" /> For Your Account
              </h4>
              <div className="space-y-2">
                {personalCoupons.map((coupon) => {
                  const isEligible = subtotal >= coupon.minimum_order_amount;
                  const savings = coupon.discount_type === 'percentage'
                    ? Math.min(subtotal * (coupon.discount_value / 100), subtotal)
                    : Math.min(coupon.discount_value, subtotal);

                  return (
                    <button
                      key={coupon.id}
                      onClick={() => isEligible && !loading && onApply(coupon.code)}
                      disabled={!isEligible || loading}
                      className={`w-full text-left border border-dashed rounded-lg p-3 transition-all ${
                        isEligible
                          ? 'border-[#D1D5DB] hover:border-foreground cursor-pointer'
                          : 'border-[#E5E7EB] opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-sm tracking-wider">{coupon.code}</code>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-foreground text-white uppercase">For You</span>
                        </div>
                        <span className="text-sm font-bold">
                          {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} OFF
                        </span>
                      </div>
                      {coupon.description && <p className="text-xs text-[#6B7280] mb-1">{coupon.description}</p>}
                      <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
                        {coupon.minimum_order_amount > 0 && <span>Min: ₹{coupon.minimum_order_amount}</span>}
                        {coupon.expires_at && <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {formatExpiry(coupon.expires_at)}</span>}
                      </div>
                      {isEligible && <p className="text-[11px] font-medium text-green-600 mt-1">Save ₹{savings.toFixed(0)}</p>}
                      {!isEligible && <p className="text-[11px] text-destructive mt-1">Add ₹{(coupon.minimum_order_amount - subtotal).toFixed(0)} more</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Global Coupons */}
          {globalCoupons.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Available for Everyone
              </h4>
              <div className="space-y-2">
                {globalCoupons.map((coupon) => {
                  const isEligible = subtotal >= coupon.minimum_order_amount;
                  const savings = coupon.discount_type === 'percentage'
                    ? Math.min(subtotal * (coupon.discount_value / 100), subtotal)
                    : Math.min(coupon.discount_value, subtotal);

                  return (
                    <button
                      key={coupon.id}
                      onClick={() => isEligible && !loading && onApply(coupon.code)}
                      disabled={!isEligible || loading}
                      className={`w-full text-left border border-dashed rounded-lg p-3 transition-all ${
                        isEligible
                          ? 'border-[#D1D5DB] hover:border-foreground cursor-pointer'
                          : 'border-[#E5E7EB] opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <code className="font-mono font-bold text-sm tracking-wider">{coupon.code}</code>
                        <span className="text-sm font-bold">
                          {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`} OFF
                        </span>
                      </div>
                      {coupon.description && <p className="text-xs text-[#6B7280] mb-1">{coupon.description}</p>}
                      <div className="flex items-center gap-3 text-[11px] text-[#9CA3AF]">
                        {coupon.minimum_order_amount > 0 && <span>Min: ₹{coupon.minimum_order_amount}</span>}
                        {coupon.expires_at && <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {formatExpiry(coupon.expires_at)}</span>}
                      </div>
                      {isEligible && <p className="text-[11px] font-medium text-green-600 mt-1">Save ₹{savings.toFixed(0)}</p>}
                      {!isEligible && <p className="text-[11px] text-destructive mt-1">Add ₹{(coupon.minimum_order_amount - subtotal).toFixed(0)} more</p>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponAccordion;
