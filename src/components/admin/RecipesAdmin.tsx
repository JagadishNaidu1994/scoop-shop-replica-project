
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  read_time: string | null;
  image_url: string | null;
  ingredients: string[] | null;
  instructions: string[] | null;
  nutritional_benefits: string[] | null;
  is_published: boolean | null;
  created_at: string;
}

const RecipesAdmin = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    read_time: '',
    image_url: '',
    ingredients: '',
    instructions: '',
    nutritional_benefits: '',
    is_published: true
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch recipes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const recipeData = {
        ...formData,
        ingredients: formData.ingredients ? formData.ingredients.split('\n').filter(i => i.trim()) : null,
        instructions: formData.instructions ? formData.instructions.split('\n').filter(i => i.trim()) : null,
        nutritional_benefits: formData.nutritional_benefits ? formData.nutritional_benefits.split(',').map(b => b.trim()) : null
      };

      if (editingRecipe) {
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', editingRecipe.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Recipe updated successfully" });
      } else {
        const { error } = await supabase
          .from('recipes')
          .insert([recipeData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Recipe created successfully" });
      }

      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title,
      description: recipe.description || '',
      category: recipe.category || '',
      read_time: recipe.read_time || '',
      image_url: recipe.image_url || '',
      ingredients: recipe.ingredients ? recipe.ingredients.join('\n') : '',
      instructions: recipe.instructions ? recipe.instructions.join('\n') : '',
      nutritional_benefits: recipe.nutritional_benefits ? recipe.nutritional_benefits.join(', ') : '',
      is_published: recipe.is_published || false
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Recipe deleted successfully" });
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Error",
        description: "Failed to delete recipe",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      read_time: '',
      image_url: '',
      ingredients: '',
      instructions: '',
      nutritional_benefits: '',
      is_published: true
    });
    setEditingRecipe(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recipes Management</h2>
          <p className="text-gray-600">Manage your recipe collection</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData({...formData, read_time: e.target.value})}
                    placeholder="5 min read"
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="ingredients">Ingredients (one per line)</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="instructions">Instructions (one per line)</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="nutritional_benefits">Nutritional Benefits (comma separated)</Label>
                <Input
                  id="nutritional_benefits"
                  value={formData.nutritional_benefits}
                  onChange={(e) => setFormData({...formData, nutritional_benefits: e.target.value})}
                  placeholder="High protein, Rich in antioxidants"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingRecipe ? 'Update' : 'Create'} Recipe
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recipes</CardTitle>
          <CardDescription>All recipes in your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Read Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{recipe.category}</Badge>
                  </TableCell>
                  <TableCell>{recipe.read_time}</TableCell>
                  <TableCell>
                    <Badge variant={recipe.is_published ? "default" : "secondary"}>
                      {recipe.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(recipe.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(recipe)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(recipe.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipesAdmin;
