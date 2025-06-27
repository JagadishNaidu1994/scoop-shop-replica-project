
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { sampleRecipes } from '@/data/sampleRecipes';
import { Clock, Users, ChefHat } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  read_time?: string;
  ingredients?: string[];
  instructions?: string[];
  nutritional_benefits?: string[];
}

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      // First check if it's a sample recipe
      const sampleRecipe = sampleRecipes.find(r => r.id === id);
      if (sampleRecipe) {
        setRecipe(sampleRecipe);
        setLoading(false);
        return;
      }

      // If not found in samples, check database
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching recipe:', error);
        navigate('/recipes');
        return;
      }

      setRecipe({
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image_url,
        category: data.category,
        readTime: data.read_time,
        ingredients: data.ingredients,
        instructions: data.instructions,
        benefits: data.nutritional_benefits
      });
    } catch (error) {
      console.error('Error fetching recipe:', error);
      navigate('/recipes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h1>
            <button
              onClick={() => navigate('/recipes')}
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Back to Recipes
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-gray-700">Home</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/recipes')} className="hover:text-gray-700">Recipes</button>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{recipe.title}</span>
        </nav>

        {/* Recipe Header */}
        <div className="mb-12">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl mb-8">
            <img
              src={recipe.image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=600&fit=crop'}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              {recipe.description}
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{recipe.readTime || '15 min'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>1-2 servings</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-4 h-4" />
                <span>{recipe.category || 'Recipe'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients?.map((ingredient: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
              
              {recipe.benefits && recipe.benefits.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
                  <ul className="space-y-2">
                    {recipe.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Instructions</h2>
            <div className="space-y-6">
              {recipe.instructions?.map((instruction: string, index: number) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1 leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>

            {/* Tips Section */}
            <div className="mt-12 p-6 bg-amber-50 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Chef's Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• For best results, use high-quality, organic ingredients</li>
                <li>• Store any leftover powder in a cool, dry place</li>
                <li>• Feel free to adjust sweetness to your taste</li>
                <li>• This recipe can be doubled for meal prep</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back to Recipes */}
        <div className="text-center mt-16 pt-16 border-t border-gray-200">
          <button
            onClick={() => navigate('/recipes')}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            ← Back to All Recipes
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
