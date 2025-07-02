
import React from 'react';
import { Users, Award, Globe, Heart } from 'lucide-react';
import AdminImageUpload from './AdminImageUpload';

const ResultsStats = () => {
  const stats = [
    {
      icon: Users,
      number: "50K+",
      label: "Happy Customers",
      description: "Join our growing community"
    },
    {
      icon: Award,
      number: "98%",
      label: "Satisfaction Rate",
      description: "Customer satisfaction guaranteed"
    },
    {
      icon: Globe,
      number: "25+",
      label: "Countries",
      description: "Worldwide shipping available"
    },
    {
      icon: Heart,
      number: "100%",
      label: "Natural",
      description: "Pure, organic ingredients"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <AdminImageUpload
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
          alt="Background pattern"
          className="w-full h-full object-cover"
          imagePath="stats-background"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Join our community of health-conscious individuals who have discovered the power of functional mushrooms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-xl font-semibold text-white mb-2">{stat.label}</div>
              <div className="text-orange-100">{stat.description}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              <AdminImageUpload
                src="/lovable-uploads/362012c4-dfba-48a8-afca-59e8f36ec3cf.png"
                alt="Customer 1"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                imagePath="customer-1"
              />
              <AdminImageUpload
                src="/lovable-uploads/8edc40eb-3dfa-45fb-8cac-fc1a12ec6a3c.png"
                alt="Customer 2"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                imagePath="customer-2"
              />
              <AdminImageUpload
                src="/lovable-uploads/18fa3a22-212e-489f-bdee-5bb2266db6a4.png"
                alt="Customer 3"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                imagePath="customer-3"
              />
            </div>
            <span className="text-white font-medium">Join 50,000+ satisfied customers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsStats;
