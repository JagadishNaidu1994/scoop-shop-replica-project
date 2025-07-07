
import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import AdminImageUpload from '@/components/AdminImageUpload';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
            About NASTEA
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make functional mushrooms and adaptogens accessible, 
            delicious, and part of your daily ritual.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                NASTEA was born from a simple belief: that the most powerful ingredients 
                in nature shouldn't be hidden away in supplement bottles, but enjoyed as 
                part of your daily rituals.
              </p>
              <p>
                Founded in 2020, we started with a mission to make functional mushrooms 
                and adaptogens accessible through delicious, high-quality blends that 
                actually taste good.
              </p>
              <p>
                Today, we're proud to source the finest ceremonial-grade ingredients from 
                trusted suppliers around the world, bringing you products that support 
                your wellness journey without compromise.
              </p>
            </div>
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden">
            <AdminImageUpload
              src="/lovable-uploads/a61d3c6a-fc59-45fe-9266-350a3c40ae91.png"
              alt="NASTEA Story"
              className="w-full h-full object-cover"
              imagePath="about-story"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-black text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality First</h3>
              <p className="text-gray-600">
                We source only the highest quality, organic ingredients from trusted suppliers worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔬</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Science-Backed</h3>
              <p className="text-gray-600">
                Every ingredient is backed by research and carefully formulated for maximum efficacy.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to sustainable practices and supporting farming communities.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <div key={member} className="text-center">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <AdminImageUpload
                    src="/lovable-uploads/26d45a3e-0bd4-4883-89d1-b11b087ead71.png"
                    alt={`Team Member ${member}`}
                    className="w-full h-full object-cover"
                    imagePath={`team-member-${member}`}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Team Member {member}</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
