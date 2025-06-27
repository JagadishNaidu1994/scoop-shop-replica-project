
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: string;
  primaryImage: string;
  hoverImage: string;
  description?: string;
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

  return (
    <div 
      className="group cursor-pointer relative overflow-hidden rounded-lg"
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
        
        {/* Price - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`text-lg font-bold ${isHovered ? 'text-white' : 'text-black'} transition-colors duration-300`}>
            {product.price}
          </span>
        </div>

        {/* Product Info - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className={`text-lg font-semibold ${isHovered ? 'text-white' : 'text-black'} transition-colors duration-300 mb-1`}>
            {product.name}
          </h3>
          {product.description && (
            <p className={`text-sm ${isHovered ? 'text-white' : 'text-gray-600'} transition-colors duration-300`}>
              {product.description}
            </p>
          )}
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
