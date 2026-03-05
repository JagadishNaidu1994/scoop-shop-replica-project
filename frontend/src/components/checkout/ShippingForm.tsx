import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown } from 'lucide-react';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  country: string;
  description?: string;
}

interface ShippingFormProps {
  shippingAddress: ShippingAddress;
  onInputChange: (field: keyof ShippingAddress, value: string) => void;
  onStateChange: (value: string) => void;
  states: string[];
  availableCities: string[];
}

const ShippingForm: React.FC<ShippingFormProps> = ({
  shippingAddress, onInputChange, onStateChange, states, availableCities
}) => {
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E5E7EB]">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Shipping Address</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="block text-[13px] text-[#374151] mb-1.5">First Name<span className="text-destructive">*</span></label>
          <Input
            value={shippingAddress.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
            className="h-12 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-sm focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        {/* Last Name */}
        <div>
          <label className="block text-[13px] text-[#374151] mb-1.5">Last Name<span className="text-destructive">*</span></label>
          <Input
            value={shippingAddress.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
            className="h-12 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-sm focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-[13px] text-[#374151] mb-1.5">Email<span className="text-destructive">*</span></label>
          <Input
            type="email"
            value={shippingAddress.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="you@email.com"
            className="h-12 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-sm focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        {/* Phone */}
        <div>
          <label className="block text-[13px] text-[#374151] mb-1.5">Phone Number<span className="text-destructive">*</span></label>
          <div className="flex">
            <div className="flex items-center gap-1 px-3 h-12 bg-[#F9FAFB] border border-[#E5E7EB] border-r-0 rounded-l-lg text-sm text-[#6B7280] select-none shrink-0">
              <span className="text-xs font-medium">IND</span>
              <ChevronDown className="h-3 w-3" />
              <span className="font-medium">+91</span>
            </div>
            <Input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              placeholder="9876543210"
              className="h-12 bg-[#F9FAFB] border-[#E5E7EB] rounded-l-none rounded-r-lg px-4 text-sm focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* City / State / Zip - 3 columns */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[13px] text-[#374151] mb-1.5">City<span className="text-destructive">*</span></label>
            {availableCities.length > 0 ? (
              <Select value={shippingAddress.city} onValueChange={(v) => onInputChange('city', v)}>
                <SelectTrigger className="h-12 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg text-sm focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>{availableCities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            ) : (
              <Input
                value={shippingAddress.city}
                onChange={(e) => onInputChange('city', e.target.value)}
                placeholder="Enter city"
                className="h-12 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-sm focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            )}
          </div>
          <div>
            <label className="block text-[13px] text-[#374151] mb-1.5">State<span className="text-destructive">*</span></label>
            <Select value={shippingAddress.state} onValueChange={onStateChange}>
              <SelectTrigger className="h-12 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg text-sm focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-[13px] text-[#374151] mb-1.5">Zip Code<span className="text-destructive">*</span></label>
            <Input
              value={shippingAddress.postalCode}
              onChange={(e) => onInputChange('postalCode', e.target.value)}
              placeholder="560021"
              className="h-12 bg-[#F9FAFB] border-[#E5E7EB] rounded-lg px-4 text-sm focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-[13px] text-[#374151] mb-1.5">Description</label>
          <Textarea
            value={shippingAddress.description || ''}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Enter a description..."
            className="bg-[#F9FAFB] border-[#E5E7EB] rounded-lg p-3 text-sm min-h-[120px] resize-none focus:border-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
