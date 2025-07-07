
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import MobileProductCard from './MobileProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  primary_image: string | null;
  hover_image: string | null;
  description: string | null;
  category: string | null;
  benefits: string[] | null;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
        <p className="text-gray-600">Check back soon for new products!</p>
      </div>
    );
  }

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
      {products.map((product) => {
        const productData = {
          id: product.id,
          name: product.name,
          price: `£${(product.price / 100).toFixed(2)}`,
          primaryImage: product.primary_image || '/placeholder.svg',
          hoverImage: product.hover_image || '/placeholder.svg',
          description: product.description || ''
        };

        return isMobile ? (
          <MobileProductCard key={product.id} product={productData} />
        ) : (
          <ProductCard key={product.id} product={productData} />
        );
      })}
    </div>
  );
};

export default ProductGrid;
