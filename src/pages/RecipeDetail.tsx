
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ProductCard from '@/components/shop/ProductCard';

const RecipeDetail = () => {
  const { id } = useParams();

  // Mock recipe data - in real app this would come from API
  const recipe = {
    id: parseInt(id || '1'),
    title: 'DIRTEA Matcha Frappé Recipe: Functional Mushroom Iced Matcha Latte',
    date: 'June 18, 2025',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop',
    description: 'A refreshing and energizing iced matcha latte infused with functional mushrooms for the perfect afternoon pick-me-up.',
    ingredients: [
      '1 tsp DIRTEA Matcha Powder',
      '1/2 tsp Lion\'s Mane Mushroom Powder',
      '1 cup coconut milk',
      '2 tbsp maple syrup',
      '1/2 cup ice cubes',
      '1 tsp vanilla extract'
    ],
    instructions: [
      'In a small bowl, whisk together the matcha powder and Lion\'s Mane mushroom powder with 2 tablespoons of hot water until smooth.',
      'In a blender, combine the matcha mixture, coconut milk, maple syrup, and vanilla extract.',
      'Add ice cubes and blend until smooth and frothy.',
      'Pour into a tall glass and enjoy immediately.',
      'Optional: Top with whipped coconut cream and a sprinkle of matcha powder.'
    ],
    nutritionalBenefits: [
      'Lion\'s Mane supports cognitive function and mental clarity',
      'Matcha provides sustained energy without jitters',
      'Rich in antioxidants and L-theanine for calm focus'
    ]
  };

  const relatedProducts = [
    {
      id: 1,
      name: 'focus powder',
      description: 'Focus, cognition, immunity',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'matcha powder',
      description: 'Energy, focus, antioxidants',
      price: '£25',
      primaryImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'lions mane powder',
      description: 'Cognitive support, focus',
      price: '£28',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/recipes" 
            className="inline-flex items-center text-black hover:text-gray-600 transition-colors font-medium"
          >
            ← Back to Recipes
          </Link>
        </div>

        {/* Recipe Header - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Recipe Image */}
          <div className="aspect-w-4 aspect-h-3">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Recipe Info */}
          <div className="flex flex-col justify-center">
            <div className="text-sm text-gray-500 mb-2">{recipe.date}</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{recipe.title}</h1>
            <p className="text-lg text-gray-700 mb-8">{recipe.description}</p>
            
            {/* Nutritional Benefits */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h3>
              <ul className="space-y-2">
                {recipe.nutritionalBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recipe Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Ingredients */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-black mr-3">•</span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-4 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Related Products Accordion */}
        <div className="mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="related-products">
              <AccordionTrigger className="text-xl font-semibold">
                Related Products
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-6">
                  <div className="flex items-center mb-6">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">4.9 | 18,133 reviews</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
