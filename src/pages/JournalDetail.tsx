
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';

interface Journal {
  id: string;
  title: string;
  content: string;
  image_url: string;
  author: string;
  category: string;
  read_time: string;
  created_at: string;
}

const JournalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJournal(id);
    }
  }, [id]);

  const fetchJournal = async (journalId: string) => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('id', journalId)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching journal:', error);
        return;
      }

      setJournal(data);
    } catch (error) {
      console.error('Error fetching journal:', error);
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

  if (!journal) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/journal" className="text-green-600 hover:text-green-700 font-medium">
              ← Back to Journal
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
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/journal" 
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Journal
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mr-4">
              {journal.category}
            </span>
            <span>{journal.read_time}</span>
            <span className="mx-2">•</span>
            <span>{new Date(journal.created_at).toLocaleDateString()}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {journal.title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            By {journal.author}
          </p>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <img
            src={journal.image_url || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=500&fit=crop'}
            alt={journal.title}
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {journal.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Written by</p>
              <p className="font-medium text-gray-900">{journal.author}</p>
            </div>
            <Link 
              to="/journal"
              className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Read More Articles
            </Link>
          </div>
        </footer>
      </article>

      <Footer />
    </div>
  );
};

export default JournalDetail;
