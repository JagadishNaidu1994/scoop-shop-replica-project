
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Journal {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author: string | null;
  category: string | null;
  read_time: string | null;
  image_url: string | null;
  is_published: boolean | null;
  created_at: string;
}

const JournalsAdmin = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    read_time: '',
    image_url: '',
    is_published: true
  });

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJournals(data || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch journals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingJournal) {
        const { error } = await supabase
          .from('journals')
          .update(formData)
          .eq('id', editingJournal.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Journal updated successfully" });
      } else {
        const { error } = await supabase
          .from('journals')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Journal created successfully" });
      }

      resetForm();
      fetchJournals();
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({
        title: "Error",
        description: "Failed to save journal",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (journal: Journal) => {
    setEditingJournal(journal);
    setFormData({
      title: journal.title,
      content: journal.content,
      excerpt: journal.excerpt || '',
      author: journal.author || '',
      category: journal.category || '',
      read_time: journal.read_time || '',
      image_url: journal.image_url || '',
      is_published: journal.is_published || false
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal?')) return;

    try {
      const { error } = await supabase
        .from('journals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Journal deleted successfully" });
      fetchJournals();
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast({
        title: "Error",
        description: "Failed to delete journal",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      category: '',
      read_time: '',
      image_url: '',
      is_published: true
    });
    setEditingJournal(null);
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
          <h2 className="text-2xl font-bold text-gray-900">Journals Management</h2>
          <p className="text-gray-600">Manage your journal articles</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Journal
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingJournal ? 'Edit Journal' : 'Create New Journal'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Journal Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="read_time">Read Time</Label>
                  <Input
                    id="read_time"
                    value={formData.read_time}
                    onChange={(e) => setFormData({...formData, read_time: e.target.value})}
                    placeholder="5 min read"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  label="Journal Image"
                  value={formData.image_url}
                  onChange={(url) => setFormData({...formData, image_url: url})}
                  placeholder="Journal featured image"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={10}
                  required
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
                  {editingJournal ? 'Update' : 'Create'} Journal
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
          <CardTitle>Journals</CardTitle>
          <CardDescription>All journal articles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Read Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journals.map((journal) => (
                <TableRow key={journal.id}>
                  <TableCell className="font-medium">{journal.title}</TableCell>
                  <TableCell>{journal.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{journal.category}</Badge>
                  </TableCell>
                  <TableCell>{journal.read_time}</TableCell>
                  <TableCell>
                    <Badge variant={journal.is_published ? "default" : "secondary"}>
                      {journal.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(journal.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(journal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(journal.id)}
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

export default JournalsAdmin;
