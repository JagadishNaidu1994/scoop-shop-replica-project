
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/shop/ProductCard';
import { supabase } from '@/integrations/supabase/client';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date_published: string;
  category: string;
  read_time: string;
  ingredients: string[];
  instructions: string[];
  nutritional_benefits: string[];
}

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        return;
      }

      setRecipe(data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const relatedProducts = [
    {
      id: 1,
      name: 'focus powder',
      price: '£30',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'matcha powder',
      price: '£25',
      primaryImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'lions mane powder',
      price: '£28',
      primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      hoverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recipe...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h1>
            <p className="text-gray-600 mb-8">The recipe you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/recipes" 
              className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Recipes
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
              src={recipe.image_url || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop'} 
              alt={recipe.title}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Recipe Info */}
          <div className="flex flex-col justify-center">
            <div className="text-sm text-gray-500 mb-2">
              {recipe.date_published ? new Date(recipe.date_published).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Recently Published'}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{recipe.title}</h1>
            <p className="text-lg text-gray-700 mb-8">{recipe.description}</p>
            
            {/* Nutritional Benefits */}
            {recipe.nutritional_benefits && recipe.nutritional_benefits.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {recipe.nutritional_benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Recipe Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Ingredients */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
            <ul className="space-y-3">
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
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
              {recipe.instructions && recipe.instructions.map((instruction, index) => (
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

        {/* Related Products - Always Visible */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
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
      </main>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
