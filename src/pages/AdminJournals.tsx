
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
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

interface Journal {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  category: string;
  read_time: string;
  is_published: boolean;
  created_at: string;
}

const AdminJournals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    author: '',
    category: 'Matcha',
    read_time: '',
    is_published: false
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && !isAdmin) {
      navigate('/');
    } else if (!loading && isAdmin) {
      fetchJournals();
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching journals:', error);
        return;
      }

      setJournals(data || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
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
    
    const journalData = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      image_url: formData.image_url,
      author: formData.author,
      category: formData.category,
      read_time: formData.read_time,
      is_published: formData.is_published,
      created_by: user?.id
    };

    try {
      if (editingJournal) {
        const { error } = await supabase
          .from('journals')
          .update(journalData)
          .eq('id', editingJournal.id);

        if (error) throw error;
        toast({ title: "Journal updated successfully!" });
      } else {
        const { error } = await supabase
          .from('journals')
          .insert([journalData]);

        if (error) throw error;
        toast({ title: "Journal created successfully!" });
      }

      resetForm();
      fetchJournals();
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({ 
        title: "Error saving journal", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      author: '',
      category: 'Matcha',
      read_time: '',
      is_published: false
    });
    setShowForm(false);
    setEditingJournal(null);
  };

  const handleEdit = (journal: Journal) => {
    setEditingJournal(journal);
    setFormData({
      title: journal.title,
      content: journal.content,
      excerpt: journal.excerpt || '',
      image_url: journal.image_url || '',
      author: journal.author || '',
      category: journal.category || 'Matcha',
      read_time: journal.read_time || '',
      is_published: journal.is_published
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal?')) return;

    try {
      const { error } = await supabase
        .from('journals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Journal deleted successfully!" });
      fetchJournals();
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast({ 
        title: "Error deleting journal", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <MatchaLoadingAnimation message="Loading journals..." />
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
          <h1 className="text-3xl font-bold text-gray-900">Journal Management</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Add New Journal
          </Button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingJournal ? 'Edit Journal' : 'Add New Journal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Journal Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Brief description for the journal card"
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  placeholder="Full journal content..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <ImageUpload
                    label="Journal Image"
                    value={formData.image_url}
                    onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                    placeholder="Journal featured image"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Matcha, Wellness"
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="is_published">Publish Journal</Label>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                  {editingJournal ? 'Update Journal' : 'Create Journal'}
                </Button>
                <Button type="button" onClick={resetForm} variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Journal List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Journals ({journals.length})</h2>
          {journals.length === 0 ? (
            <p className="text-gray-600">No journals created yet.</p>
          ) : (
            <div className="grid gap-4">
              {journals.map((journal) => (
                <div key={journal.id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{journal.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{journal.excerpt}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Author: {journal.author || 'N/A'}</span>
                        <span>Category: {journal.category}</span>
                        <span>Status: {journal.is_published ? 'Published' : 'Draft'}</span>
                        <span>Created: {new Date(journal.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleEdit(journal)}
                        variant="outline"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(journal.id)}
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

export default AdminJournals;
