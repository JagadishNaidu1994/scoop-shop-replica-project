
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const SampleRecipeSeeder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const sampleRecipes = [
    {
      title: "Classic Matcha Latte",
      description: "A creamy and smooth matcha latte perfect for any time of day",
      image_url: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=400&fit=crop",
      category: "Drinks",
      read_time: "5 min read",
      ingredients: [
        "2 tsp ceremonial grade matcha powder",
        "1/4 cup hot water (80°C)",
        "1 cup milk of choice",
        "1-2 tsp honey or maple syrup",
        "Ice cubes (optional)"
      ],
      instructions: [
        "Sift matcha powder into a bowl to remove any lumps",
        "Add hot water and whisk vigorously in a 'W' motion until frothy",
        "Heat milk until steaming (don't boil)",
        "Pour matcha mixture into a mug",
        "Add sweetener and stir well",
        "Top with steamed milk and enjoy hot or over ice"
      ],
      nutritional_benefits: [
        "Rich in antioxidants (catechins)",
        "Provides sustained energy without jitters",
        "Supports metabolism and fat burning",
        "Contains L-theanine for calm alertness"
      ]
    },
    {
      title: "Matcha White Chocolate Smoothie",
      description: "Indulgent matcha smoothie with white chocolate flavor",
      image_url: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=600&h=400&fit=crop",
      category: "Smoothies",
      read_time: "3 min read",
      ingredients: [
        "1 tsp matcha powder",
        "1 frozen banana",
        "1/2 cup coconut milk",
        "1/4 cup cashew butter",
        "1 tbsp white chocolate chips",
        "1 cup ice cubes",
        "1 tsp vanilla extract"
      ],
      instructions: [
        "Add all ingredients to a high-speed blender",
        "Blend until smooth and creamy",
        "Adjust consistency with more coconut milk if needed",
        "Taste and add more matcha if desired",
        "Pour into a glass and serve immediately",
        "Garnish with extra white chocolate chips if desired"
      ],
      nutritional_benefits: [
        "High in healthy fats from cashews",
        "Natural sweetness from banana",
        "Antioxidant boost from matcha",
        "Protein-rich for sustained energy"
      ]
    },
    {
      title: "Iced Matcha Coconut Latte",
      description: "Refreshing iced latte with tropical coconut flavors",
      image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop",
      category: "Drinks",
      read_time: "4 min read",
      ingredients: [
        "1 1/2 tsp matcha powder",
        "2 tbsp warm water",
        "1 cup coconut milk",
        "1 tbsp coconut cream",
        "1 tsp agave syrup",
        "1 cup ice cubes",
        "Toasted coconut flakes for garnish"
      ],
      instructions: [
        "Whisk matcha powder with warm water until smooth",
        "Fill a glass with ice cubes",
        "Pour matcha mixture over ice",
        "Add coconut milk and coconut cream",
        "Stir in agave syrup",
        "Top with toasted coconut flakes and serve with a straw"
      ],
      nutritional_benefits: [
        "Dairy-free and vegan-friendly",
        "Medium-chain fatty acids from coconut",
        "Natural electrolytes",
        "Anti-inflammatory properties"
      ]
    },
    {
      title: "Matcha Chia Pudding Bowl",
      description: "Nutritious overnight chia pudding infused with matcha",
      image_url: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&h=400&fit=crop",
      category: "Breakfast",
      read_time: "10 min prep, 4 hours chill",
      ingredients: [
        "1 tsp matcha powder",
        "1/4 cup chia seeds",
        "1 cup almond milk",
        "2 tbsp maple syrup",
        "1/2 tsp vanilla extract",
        "Fresh berries for topping",
        "Sliced almonds",
        "Coconut flakes"
      ],
      instructions: [
        "Whisk matcha powder with a small amount of almond milk until smooth",
        "In a bowl, combine chia seeds, remaining almond milk, maple syrup, and vanilla",
        "Add matcha mixture and whisk well",
        "Cover and refrigerate for at least 4 hours or overnight",
        "Stir occasionally during the first hour to prevent clumping",
        "Serve in bowls topped with berries, almonds, and coconut"
      ],
      nutritional_benefits: [
        "High in omega-3 fatty acids",
        "Excellent source of fiber",
        "Plant-based protein",
        "Sustained energy release"
      ]
    },
    {
      title: "Matcha Mint Chocolate Chip Ice Cream",
      description: "Homemade matcha ice cream with chocolate chips and fresh mint",
      image_url: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop",
      category: "Desserts",
      read_time: "20 min prep, 4 hours freeze",
      ingredients: [
        "2 tbsp matcha powder",
        "2 cups heavy cream",
        "1 cup whole milk",
        "3/4 cup sugar",
        "6 egg yolks",
        "1/4 cup fresh mint leaves",
        "1/2 cup dark chocolate chips",
        "1 tsp vanilla extract"
      ],
      instructions: [
        "Heat milk and mint leaves in a saucepan until steaming",
        "Whisk egg yolks and sugar until pale",
        "Gradually add hot milk mixture to eggs, whisking constantly",
        "Return to saucepan and cook until it coats the back of a spoon",
        "Strain mixture and whisk in matcha powder until smooth",
        "Stir in cream and vanilla, then chill completely",
        "Churn in ice cream maker according to manufacturer's instructions",
        "Fold in chocolate chips during last 2 minutes of churning"
      ],
      nutritional_benefits: [
        "Rich in antioxidants from matcha",
        "Natural mint aids digestion",
        "High-quality dairy proteins",
        "Mood-boosting dark chocolate"
      ]
    },
    {
      title: "Matcha Energy Balls",
      description: "No-bake energy balls packed with matcha and superfoods",
      image_url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      category: "Snacks",
      read_time: "15 min prep",
      ingredients: [
        "1 tbsp matcha powder",
        "1 cup pitted dates",
        "1/2 cup cashews",
        "1/4 cup rolled oats",
        "2 tbsp coconut oil",
        "1 tbsp chia seeds",
        "1 tsp vanilla extract",
        "Pinch of sea salt",
        "Desiccated coconut for rolling"
      ],
      instructions: [
        "Soak dates in warm water for 10 minutes if too dry",
        "Add cashews and oats to food processor and pulse until chopped",
        "Add dates, matcha powder, coconut oil, chia seeds, vanilla, and salt",
        "Process until mixture holds together when pressed",
        "Roll mixture into 12-15 small balls",
        "Roll each ball in desiccated coconut",
        "Chill in refrigerator for 30 minutes before serving",
        "Store in an airtight container for up to 1 week"
      ],
      nutritional_benefits: [
        "Natural energy from dates",
        "Healthy fats from nuts and seeds",
        "Fiber for digestive health",
        "Antioxidant power of matcha"
      ]
    }
  ];

  const seedRecipes = async () => {
    if (!user) {
      toast({ title: "Please log in first", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    try {
      const recipesToInsert = sampleRecipes.map(recipe => ({
        ...recipe,
        is_published: true,
        created_by: user.id
      }));

      const { error } = await supabase
        .from('recipes')
        .insert(recipesToInsert);

      if (error) throw error;

      toast({ 
        title: "Success!", 
        description: "6 sample matcha recipes have been added to the database." 
      });
    } catch (error) {
      console.error('Error seeding recipes:', error);
      toast({ 
        title: "Error", 
        description: "Failed to add sample recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-2">Sample Recipes</h3>
      <p className="text-sm text-gray-600 mb-4">
        Click the button below to add 6 sample matcha recipes to get started with your recipe collection.
      </p>
      <Button 
        onClick={seedRecipes}
        disabled={loading}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? 'Adding Recipes...' : 'Add 6 Sample Matcha Recipes'}
      </Button>
    </div>
  );
};

export default SampleRecipeSeeder;
