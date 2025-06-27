
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, Filter } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

const FilterSidebar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  priceRange, 
  setPriceRange 
}: FilterSidebarProps) => {
  const categories = [
    { id: 'all', name: 'All Products', count: 24 },
    { id: 'bestsellers', name: 'Best Sellers', count: 8 },
    { id: 'pints', name: 'Pint Collection', count: 12 },
    { id: 'seasonal', name: 'Seasonal', count: 4 },
    { id: 'bundles', name: 'Bundles', count: 6 }
  ];

  const flavors = [
    'Vanilla Bean',
    'Chocolate',
    'Strawberry',
    'Mint Chip',
    'Cookies & Cream',
    'Salted Caramel'
  ];

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Filter Header */}
      <div className="flex items-center gap-2 pb-4 border-b">
        <Filter className="w-5 h-5" />
        <h2 className="text-lg font-semibold">FILTER BY</h2>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between cursor-pointer">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Product Type</h3>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="space-y-2 pl-4">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => setSelectedCategory(category.id)}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
              <span className="text-sm text-gray-400">({category.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Flavor Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between cursor-pointer">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Flavor</h3>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="space-y-2 pl-4">
          {flavors.map((flavor) => (
            <label key={flavor} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{flavor}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex items-center justify-between cursor-pointer">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Price</h3>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="space-y-4 pl-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <div className="flex items-center justify-between cursor-pointer">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Availability</h3>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="space-y-2 pl-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">In stock</span>
            <span className="text-sm text-gray-400">(24)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Out of stock</span>
            <span className="text-sm text-gray-400">(0)</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
