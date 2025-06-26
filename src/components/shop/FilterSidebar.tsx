
import React from 'react';
import { Slider } from '@/components/ui/slider';

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
    { id: 'pints', name: 'Pint Collection', count: 12 },
    { id: 'sandwiches', name: 'Ice Cream Sandwiches', count: 6 },
    { id: 'bars', name: 'Premium Bars', count: 4 },
    { id: 'seasonal', name: 'Seasonal Flavors', count: 2 }
  ];

  return (
    <div className="w-full lg:w-64 space-y-8">
      {/* Categories Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 ${
                selectedCategory === category.id 
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-gray-500">({category.count})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-4">
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

      {/* Special Offers */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200 animate-fade-in">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">Special Offers</h3>
        <p className="text-sm text-orange-700 mb-4">Get 20% off on orders over $50!</p>
        <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
          View Deals
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
