
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import SampleRecipeSeeder from '@/components/SampleRecipeSeeder';
import MatchaLoadingAnimation from '@/components/MatchaLoadingAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  read_time: string;
  ingredients: string[];
  instructions: string[];
  nutritional_benefits: string[];
  is_published: boolean;
  created_at: string;
}

const AdminRecipes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    read_time: '',
    ingredients: '',
    instructions: '',
    nutritional_benefits: '',
    is_published: false
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && !isAdmin) {
      navigate('/');
    } else if (!loading && isAdmin) {
      fetchRecipes();
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        return;
      }

      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recipeData = {
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      category: formData.category,
      read_time: formData.read_time,
      ingredients: formData.ingredients.split('\n').filter(item => item.trim()),
      instructions: formData.instructions.split('\n').filter(item => item.trim()),
      nutritional_benefits: formData.nutritional_benefits.split('\n').filter(item => item.trim()),
      is_published: formData.is_published,
      created_by: user?.id
    };

    try {
      if (editingRecipe) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', editingRecipe.id);

        if (error) throw error;
        toast({ title: "Recipe updated successfully!" });
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert([recipeData]);

        if (error) throw error;
        toast({ title: "Recipe created successfully!" });
      }

      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({ 
        title: "Error saving recipe", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: '',
      read_time: '',
      ingredients: '',
      instructions: '',
      nutritional_benefits: '',
      is_published: false
    });
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title,
      description: recipe.description || '',
      image_url: recipe.image_url || '',
      category: recipe.category || '',
      read_time: recipe.read_time || '',
      ingredients: recipe.ingredients?.join('\n') || '',
      instructions: recipe.instructions?.join('\n') || '',
      nutritional_benefits: recipe.nutritional_benefits?.join('\n') || '',
      is_published: recipe.is_published
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Recipe deleted successfully!" });
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({ 
        title: "Error deleting recipe", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <MatchaLoadingAnimation message="Loading recipes..." />
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recipe Management</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Add New Recipe
          </Button>
        </div>

        <SampleRecipeSeeder />

        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Recipe Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Breakfast, Drinks, Smoothies"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ImageUpload
                    label="Recipe Image"
                    value={formData.image_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    placeholder="Recipe featured image"
                  />
                </div>
                <div>
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 min read"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ingredients">Ingredients (one per line) *</Label>
                <Textarea
                  id="ingredients"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="1 tsp DIRTEA Matcha Powder&#10;1/2 tsp Lion's Mane Mushroom Powder&#10;1 cup coconut milk"
                  required
                />
              </div>

              <div>
                <Label htmlFor="instructions">Instructions (one per line) *</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="In a small bowl, whisk together the matcha powder...&#10;In a blender, combine the matcha mixture..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="nutritional_benefits">Nutritional Benefits (one per line)</Label>
                <Textarea
                  id="nutritional_benefits"
                  name="nutritional_benefits"
                  value={formData.nutritional_benefits}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Lion's Mane supports cognitive function&#10;Matcha provides sustained energy&#10;Rich in antioxidants"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="is_published">Publish Recipe</Label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                  {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
                </Button>
                <Button type="button" onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Recipe List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Recipes ({recipes.length})</h2>
          {recipes.length === 0 ? (
            <p className="text-gray-600">No recipes created yet.</p>
          ) : (
            <div className="grid gap-4">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{recipe.title}</h3>
                      <p className="text-gray-600 text-sm">{recipe.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Category: {recipe.category || 'N/A'}</span>
                        <span>Status: {recipe.is_published ? 'Published' : 'Draft'}</span>
                        <span>Created: {new Date(recipe.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleEdit(recipe)}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(recipe.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminRecipes;
