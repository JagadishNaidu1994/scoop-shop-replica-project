
import React from 'react';

const JournalSection = () => {
  const articles = [
    {
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'The Science Behind Lion\'s Mane',
      excerpt: 'Discover how this powerful mushroom supports cognitive function and brain health.'
    },
    {
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Morning Rituals for Success',
      excerpt: 'Build a morning routine that sets you up for focus and productivity all day long.'
    },
    {
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: 'Adaptogens vs Caffeine',
      excerpt: 'Understanding the difference between quick energy and sustained wellness.'
    }
  ];

  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Journal</h2>
          <p className="text-lg text-gray-600">Insights, tips, and stories from the world of functional wellness</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="overflow-hidden rounded-lg mb-4">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-orange-400 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600">{article.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
