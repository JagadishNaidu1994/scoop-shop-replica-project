
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: string;
  primaryImage: string;
  benefits?: string[];
}

interface MobileProductCardProps {
  product: Product;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  // Get first 2-3 benefits
  const displayBenefits = product.benefits?.slice(0, 3) || [];

  return (
    <div 
      className="bg-white rounded-lg p-4 cursor-pointer shadow-sm"
      onClick={handleClick}
    >
      <div className="aspect-square mb-4 overflow-hidden rounded-lg">
        <img
          src={product.primaryImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="text-center">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-black text-left">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-black">
            {product.price}
          </span>
        </div>
        
        {/* Benefits */}
        {displayBenefits.length > 0 && (
          <p className="text-sm text-gray-600 mb-4 text-left">
            {displayBenefits.join(', ')}
          </p>
        )}
        
        <button
          onClick={handleBuyNow}
          className="w-full bg-black text-white py-2 px-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default MobileProductCard;
