import React from 'react';

interface ShippingMethodsProps {
  selectedShipping: 'free' | 'express';
  onSelect: (method: 'free' | 'express') => void;
}

const ShippingMethods: React.FC<ShippingMethodsProps> = ({ selectedShipping, onSelect }) => {
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E5E7EB]">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Shipping Method</h2>
      <div className="flex gap-4">
        {/* Free Shipping */}
        <button
          onClick={() => onSelect('free')}
          className={`flex-1 flex items-center justify-between p-4 rounded-[10px] cursor-pointer transition-all ${
            selectedShipping === 'free'
              ? 'border-2 border-foreground'
              : 'border border-[#E5E7EB] hover:border-[#9CA3AF]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selectedShipping === 'free' ? 'border-foreground' : 'border-[#D1D5DB]'
            }`}>
              {selectedShipping === 'free' && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
            </div>
            <div className="text-left">
              <p className="font-medium text-sm text-foreground">Free Shipping</p>
              <p className="text-xs text-[#6B7280]">7-20 Days</p>
            </div>
          </div>
          <span className="font-semibold text-foreground">₹0</span>
        </button>

        {/* Express Shipping */}
        <button
          onClick={() => onSelect('express')}
          className={`flex-1 flex items-center justify-between p-4 rounded-[10px] cursor-pointer transition-all ${
            selectedShipping === 'express'
              ? 'border-2 border-foreground'
              : 'border border-[#E5E7EB] hover:border-[#9CA3AF]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selectedShipping === 'express' ? 'border-foreground' : 'border-[#D1D5DB]'
            }`}>
              {selectedShipping === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
            </div>
            <div className="text-left">
              <p className="font-medium text-sm text-foreground">Express Shipping</p>
              <p className="text-xs text-[#6B7280]">1-3 Days</p>
            </div>
          </div>
          <span className="font-semibold text-foreground">₹99</span>
        </button>
      </div>
    </div>
  );
};

export default ShippingMethods;
