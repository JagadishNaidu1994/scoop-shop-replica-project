
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
      className="bg-white rounded-lg overflow-hidden cursor-pointer shadow-sm"
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.primaryImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Product Name - Top Left Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-lg font-semibold text-white drop-shadow-lg">
            {product.name}
          </h3>
        </div>

        {/* Price - Top Right Overlay */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-lg font-bold text-white drop-shadow-lg">
            {product.price}
          </span>
        </div>

        {/* Benefits - Bottom Left Overlay */}
        {displayBenefits.length > 0 && (
          <div className="absolute bottom-4 left-4 z-10">
            <p className="text-sm text-white drop-shadow-lg">
              {displayBenefits.join(', ')}
            </p>
          </div>
        )}
        
        {/* Buy Now Button - Bottom Center */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleBuyNow}
            className="bg-white text-black py-2 px-6 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            BUY NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileProductCard;
