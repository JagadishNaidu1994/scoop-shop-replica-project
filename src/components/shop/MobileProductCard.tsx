
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: string;
  primaryImage: string;
  description?: string;
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
    // Add to cart or navigate to product detail
    navigate(`/products/${product.id}`);
  };

  return (
    <div 
      className="bg-gray-100 rounded-lg p-4 cursor-pointer"
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
        <h3 className="text-lg font-semibold text-black mb-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-gray-600 mb-2">
            {product.description}
          </p>
        )}
        <p className="text-lg font-bold text-black mb-3">
          {product.price}
        </p>
        
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
