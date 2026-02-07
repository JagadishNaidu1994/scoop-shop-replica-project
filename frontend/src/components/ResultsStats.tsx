
import React from 'react';

const ResultsStats = () => {
  const stats = [
    { percentage: '77%', description: 'improved focus' },
    { percentage: '82%', description: 'energy boost' },
    { percentage: '91%', description: 'reduced brain fog' }
  ];

  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Research-backed energy. Personality-led vibes.</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Informed by science. Formulated by craft.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl font-bold text-black mb-4">{stat.percentage}</div>
              <p className="text-lg text-gray-600 capitalize">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsStats;
