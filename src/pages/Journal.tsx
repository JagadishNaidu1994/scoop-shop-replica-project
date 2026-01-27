
import React, { useState, useEffect } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import MatchaLoadingAnimation from '@/components/MatchaLoadingAnimation';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Journal {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  category: string;
  read_time: string;
  created_at: string;
}

const Journal = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching journals:', error);
        return;
      }

      setJournals(data || []);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderNavBar />
        <MatchaLoadingAnimation message="Loading journal articles..." />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            JOURNAL
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the world of matcha, wellness, and mindful living through our carefully curated articles and insights.
          </p>
        </div>
      </section>

      {/* Journal Grid */}
      <section className="py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {journals.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No articles published yet</h2>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {journals.map((journal) => (
                <Link 
                  key={journal.id} 
                  to={`/journal/${journal.id}`}
                  className="group cursor-pointer"
                >
                  <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      <img
                        src={journal.image_url || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop'}
                        alt={journal.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-3">
                          {journal.category}
                        </span>
                        <span>{journal.read_time}</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                        {journal.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {journal.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">By {journal.author}</span>
                        <span className="text-sm text-gray-400">
                          {new Date(journal.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Journal;
