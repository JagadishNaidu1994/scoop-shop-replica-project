
import React, { useEffect, useState } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { sampleRecipes } from '@/data/sampleRecipes';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  read_time: string;
}

const Recipes = () => {
  const [dbRecipes, setDbRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        setDbRecipes([]);
      } else {
        setDbRecipes(data || []);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setDbRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Combine database recipes with sample recipes
  const allRecipes = [
    ...sampleRecipes,
    ...dbRecipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image_url || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop',
      category: recipe.category || 'Recipes',
      readTime: recipe.read_time || '5 min',
      description: recipe.description || ''
    }))
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Recipes & Rituals
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover delicious ways to incorporate our functional mushrooms and matcha into your daily routine. 
            From energizing morning lattes to calming evening elixirs.
          </p>
        </div>

        {/* Featured Recipe */}
        {allRecipes.length > 0 && (
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 text-white">
              <img
                src={allRecipes[0].image}
                alt={allRecipes[0].title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="relative px-8 py-16 md:px-16 md:py-24">
                <div className="max-w-lg">
                  <span className="inline-block px-3 py-1 bg-white text-gray-900 text-sm font-medium rounded-full mb-4">
                    Featured Recipe
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{allRecipes[0].title}</h2>
                  <p className="text-lg mb-6 opacity-90">{allRecipes[0].description}</p>
                  <Link
                    to={`/recipes/${allRecipes[0].id}`}
                    className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recipe Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {['All', 'Drinks', 'Smoothies', 'Snacks', 'Breakfast'].map((category) => (
              <button
                key={category}
                className="px-6 py-2 border border-gray-300 rounded-full hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {allRecipes.slice(1).map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="group block"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{recipe.category}</span>
                    <span>{recipe.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">{recipe.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {allRecipes.length === 0 && !loading && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes available</h3>
            <p className="text-gray-600">Check back soon for delicious new recipes!</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Recipes;
