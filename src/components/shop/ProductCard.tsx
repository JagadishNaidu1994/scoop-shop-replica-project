
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: string;
  primaryImage: string;
  hoverImage: string;
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
    <div className="group cursor-pointer" onClick={handleClick}>
      <div 
        className="relative aspect-square overflow-hidden rounded-lg mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={isHovered ? product.hoverImage : product.primaryImage}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
        <p className="text-lg font-semibold text-gray-900">{product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
