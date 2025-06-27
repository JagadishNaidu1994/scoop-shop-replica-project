
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    primaryImage: string;
    hoverImage: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleBuyNow = () => {
    const priceNumber = parseFloat(product.price.replace('£', ''));
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_price: priceNumber,
      product_image: product.primaryImage,
      quantity: 1
    });
  };

  return (
    <div 
      className="group cursor-pointer relative overflow-hidden bg-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative h-80 overflow-hidden">
        {/* Primary Image */}
        <img 
          src={product.primaryImage}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Hover Image */}
        <img 
          src={product.hoverImage}
          alt={`${product.name} lifestyle`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Product Name - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className={`text-lg font-bold transition-colors duration-300 ${
            isHovered ? 'text-white' : 'text-black'
          }`}>
            {product.name}
          </h3>
        </div>

        {/* Price - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <span className={`text-lg font-bold transition-colors duration-300 ${
            isHovered ? 'text-white' : 'text-black'
          }`}>
            {product.price}
          </span>
        </div>

        {/* Buy Now Button - Slides up from bottom */}
        <div className={`absolute bottom-0 left-0 right-0 transform transition-transform duration-500 ease-out ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="p-6">
            <Button 
              onClick={handleBuyNow}
              className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-full"
            >
              BUY NOW
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
