
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: string;
  primaryImage: string;
  hoverImage: string;
  benefits?: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Get first 2-3 benefits
  const displayBenefits = product.benefits?.slice(0, 3) || [];

  return (
    <div 
      className="group cursor-pointer relative overflow-hidden rounded-lg bg-white"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={isHovered ? product.hoverImage : product.primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500"
        />
        
        {/* Product Name - Top Left */}
        <div className="absolute top-4 left-4 z-10 max-w-[60%]">
          <h3 className="text-lg font-semibold text-white drop-shadow-lg">
            {product.name}
          </h3>
        </div>

        {/* Benefits - Below name with proper spacing */}
        {displayBenefits.length > 0 && (
          <div className="absolute top-12 left-4 z-10 max-w-[60%]">
            <p className="text-sm text-white drop-shadow-lg">
              {displayBenefits.join(', ')}
            </p>
          </div>
        )}

        {/* Price - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-lg font-bold text-white drop-shadow-lg">
            {product.price}
          </span>
        </div>
        
        {/* Buy Now Button - Slides up from bottom on hover */}
        <div className={`absolute bottom-0 left-0 right-0 transform transition-transform duration-500 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="bg-white/90 backdrop-blur-sm m-4 rounded-full">
            <button className="w-full py-3 px-6 text-black font-semibold text-lg rounded-full hover:bg-white transition-colors duration-300">
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
