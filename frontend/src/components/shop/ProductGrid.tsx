
import React, { useState, useEffect, memo } from 'react';
import ProductCard from './ProductCard';
import MobileProductCard from './MobileProductCard';

interface Product {
  id: number;
  name: string;
  price: string; 
  primary_image: string | null;
  hover_image: string | null;
  description: string | null;
  category: string | null;
  benefits: string[] | null;
}

interface ProductGridProps {
  products: (Product | null)[];
}

const ProductGridComponent: React.FC<ProductGridProps> = ({ products }) => {
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
        let primaryImage = product.primary_image || '/placeholder.svg';
        let hoverImage = product.hover_image || '/placeholder.svg';
        let benefits = product.benefits || [];

        // Add fallback images for specific products
        if (product.name && product.name.toLowerCase().includes('organic ceremonial') && !product.primary_image) {
          primaryImage = '/lovable-uploads/NDN00607-Edit.jpg';
          hoverImage = '/lovable-uploads/NDN00607-Edit.jpg';
        }

        // Override benefits with custom packaging taglines
        if (product.name && product.name.toLowerCase().includes('organic ceremonial')) {
          benefits = ['Rich Umami', 'Creamy texture', 'Handpicked'];
        } else if (product.name && product.name.toLowerCase().includes('japanese classic')) {
          benefits = ['Strong Aroma', 'Vibrant Green', 'Smooth texture'];
        }

        const productData = {
          id: product.id,
          name: product.name,
          price: `₹${product.price}`, // Remove toFixed since price is already a number
          primaryImage,
          hoverImage,
          benefits
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

const ProductGrid = memo(ProductGridComponent);
ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
