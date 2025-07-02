
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import AdminImageUpload from './AdminImageUpload';

const JournalSection = () => {
  const articles = [
    {
      id: 1,
      title: "The Science Behind Lion's Mane Mushrooms",
      excerpt: "Discover how Lion's Mane mushrooms can boost cognitive function and support brain health through natural compounds.",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Science",
      image: "/lovable-uploads/ce948032-9353-486e-8b45-76c4fbcff748.png",
      imagePath: "journal-lions-mane"
    },
    {
      id: 2,
      title: "Morning Rituals: Starting Your Day Right",
      excerpt: "Learn how to create the perfect morning routine with functional mushroom coffee for sustained energy and focus.",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Lifestyle",
      image: "/lovable-uploads/5fe87a68-79b4-4785-8a77-b100edfbcbf6.png",
      imagePath: "journal-morning-ritual"
    },
    {
      id: 3,
      title: "Adaptogens: Nature's Stress Fighters",
      excerpt: "Explore the world of adaptogens and how they help your body naturally adapt to stress and maintain balance.",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Wellness",
      image: "/lovable-uploads/34a12b18-2b53-4154-8791-a374723bc2f0.png",
      imagePath: "journal-adaptogens"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">From Our Journal</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dive deep into the world of functional mushrooms, wellness tips, and the science behind natural health
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video relative overflow-hidden">
                <AdminImageUpload
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  imagePath={article.imagePath}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {article.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
