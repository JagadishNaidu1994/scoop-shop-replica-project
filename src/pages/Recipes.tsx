
import React from 'react';
import { Link } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';

const Recipes = () => {
  const recipes = [
    {
      id: 1,
      title: 'Peanut Butter Yoghurt Bowl Recipe with Cacao and Reishi Mushrooms',
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=400&fit=crop',
      category: 'Breakfast',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Immune-Boosting Yoghurt Bowl Recipe: Breakfast That Fights Back',
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=400&fit=crop',
      category: 'Breakfast',
      readTime: '5 min read'
    },
    {
      id: 3,
      title: 'DIRTEA Reishi Latte Recipe: A Simple Evening Ritual for Better Sleep',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      category: 'Drinks',
      readTime: '3 min read'
    },
    {
      id: 4,
      title: 'DIRTEA Matcha Frappé Recipe: Functional Mushroom Iced Matcha Latte',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      category: 'Drinks',
      readTime: '5 min read'
    },
    {
      id: 5,
      title: 'DIRTEA Vegan Smoothie Recipe with Lion\'s Mane and Berries: Fight the Mental Fog',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      category: 'Smoothies',
      readTime: '5 min read'
    },
    {
      id: 6,
      title: 'DIRTEA Pre-Workout Cordyceps Protein Shake Recipe: Dairy-Free Energy for Peak Performance',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Pre-Workout',
      readTime: '5 min read'
    },
    {
      id: 7,
      title: 'DIRTEA Gluten-Free Chai Mushroom Latte Recipe: Calm, Comfort and Digestive Wellness',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      category: 'Drinks',
      readTime: '5 min read'
    },
    {
      id: 8,
      title: 'DIRTEA L-Theanine & Matcha Green Smoothie Bowl Recipe: Calm in Every Spoonful',
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=400&fit=crop',
      category: 'Smoothies',
      readTime: '5 min read'
    },
    {
      id: 9,
      title: 'DIRTEA Intermittent Fasting Matcha Recipe: L-Theanine Focus for Fasting Windows',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
      category: 'Drinks',
      readTime: '3 min read'
    },
    {
      id: 10,
      title: 'DIRTEA Golden Milk Latte Recipe: Turmeric Meets Lion\'s Mane Mushroom',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      category: 'Drinks',
      readTime: '5 min read'
    },
    {
      id: 11,
      title: 'DIRTEA Adaptogen Hot Chocolate Recipe: Evening Ritual for Balance',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      category: 'Drinks',
      readTime: '5 min read'
    },
    {
      id: 12,
      title: 'DIRTEA Nootropic Coffee Recipe: Brain-Boosting Blend for Mental Performance',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      category: 'Coffee',
      readTime: '3 min read'  
    }
  ];

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
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      {recipe.category}
                    </span>
                    <span className="text-sm text-gray-400">{recipe.readTime}</span>
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
      </main>

      <Footer />
    </div>
  );
};

export default Recipes;
