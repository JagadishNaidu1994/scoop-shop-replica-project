
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

interface Recipe {
  id: string;
  title: string;
  image_url: string;
  category: string;
  read_time: string;
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('id, title, image_url, category, read_time')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        return;
      }

      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recipes...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      {/* Hero Banner */}
      <div className="relative h-[400px] bg-gradient-to-r from-orange-100 to-green-100">
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Recipes</h1>
                <p className="text-lg text-gray-700 max-w-2xl">
                  Discover delicious and nutritious recipes featuring our functional mushroom powders. 
                  From energizing morning smoothies to calming evening lattes, find your perfect blend 
                  for every moment of the day.
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop" 
                  alt="DIRTEA Products" 
                  className="max-w-md rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No recipes available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <Link 
                key={recipe.id} 
                to={`/recipes/${recipe.id}`}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={recipe.image_url || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'} 
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {recipe.category || 'Recipe'}
                      </span>
                      <span className="text-sm text-gray-400">{recipe.read_time || '5 min read'}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                      {recipe.title}
                    </h3>
                    <div className="mt-4">
                      <span className="text-black font-medium hover:underline">READ MORE</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Recipes;
