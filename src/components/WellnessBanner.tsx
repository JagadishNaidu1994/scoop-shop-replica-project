
import React, { useState, useEffect } from 'react';

const WellnessBanner = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showBottles, setShowBottles] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Show bottles when user scrolls down a bit
      if (currentScrollY > 100) {
        setShowBottles(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate animation progress based on scroll
  const animationProgress = Math.min(scrollY / 500, 1);
  const greenCapsuleY = -200 + (animationProgress * 250); // Starts above, lands in center
  const greenCapsuleScale = 0.3 + (animationProgress * 0.4); // Starts big (0.7), ends small (0.7 total)

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Main content section */}
      <div className="container mx-auto px-4 py-16">
        {/* Hero text section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-black text-black leading-tight mb-8">
            THE FUTURE<br />
            OF WELLNESS
          </h1>
          
          <div className="max-w-md mx-auto mb-8">
            <p className="text-black text-lg mb-2">
              Intelligent skin and hair products
            </p>
            <p className="text-black text-lg mb-6">
              that refuse to take aging seriously.
            </p>
            <p className="text-black text-lg font-medium mb-8">
              Find out exactly what you need.
            </p>
            
            <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
              🧠 Ask SpoiledBrain
            </button>
          </div>
        </div>

        {/* Animated bottles section */}
        <div className="relative min-h-96">
          {/* Navigation arrows */}
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Bottom row capsules - now with 4 capsules and space in center */}
          <div className="flex justify-center items-end space-x-8 relative">
            {/* Purple capsule */}
            <div className={`transform transition-all duration-1000 ${showBottles ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <img 
                src="/lovable-uploads/34a12b18-2b53-4154-8791-a374723bc2f0.png"
                alt="Purple Capsule"
                className="w-20 h-auto"
              />
            </div>

            {/* Pink capsule */}
            <div className={`transform transition-all duration-1000 delay-200 ${showBottles ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <img 
                src="/lovable-uploads/5fe87a68-79b4-4785-8a77-b100edfbcbf6.png"
                alt="Pink Capsule"
                className="w-20 h-auto"
              />
            </div>

            {/* Center space for green capsule with animated landing */}
            <div className="w-20 relative">
              <div 
                className="absolute transition-all duration-1000 ease-out z-10"
                style={{ 
                  transform: `translateY(${greenCapsuleY}px) scale(${greenCapsuleScale})`,
                  left: '50%',
                  marginLeft: '-40px'
                }}
              >
                <img 
                  src="/lovable-uploads/362012c4-dfba-48a8-afca-59e8f36ec3cf.png"
                  alt="Green Landing Capsule"
                  className="w-20 h-auto"
                />
              </div>
            </div>

            {/* Red capsule */}
            <div className={`transform transition-all duration-1000 delay-400 ${showBottles ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <img 
                src="/lovable-uploads/fb93161d-5e4c-405d-a9f0-22e74b7cfc0d.png"
                alt="Red Capsule"
                className="w-20 h-auto"
              />
            </div>

            {/* Orange capsule */}
            <div className={`transform transition-all duration-1000 delay-600 ${showBottles ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <img 
                src="/lovable-uploads/5bb3c112-8b5a-4427-a43f-d5e5fc935e8d.png"
                alt="Orange Capsule"
                className="w-20 h-auto"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="text-center mt-8">
            <p className="text-black font-medium text-lg mb-4">
              O36+ Anti-Aging Triple-<br />
              Peptide Moisturizer
            </p>
            
            <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
              🧠 Find Your Capsule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessBanner;
