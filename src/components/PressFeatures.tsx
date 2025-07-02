
import React from 'react';
import AdminImageUpload from './AdminImageUpload';

const PressFeatures = () => {
  const pressLogos = [
    {
      name: "Forbes",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Forbes_logo.svg/200px-Forbes_logo.svg.png",
      imagePath: "press-forbes"
    },
    {
      name: "TechCrunch",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/TechCrunch_logo.svg/200px-TechCrunch_logo.svg.png",
      imagePath: "press-techcrunch"
    },
    {
      name: "Vogue",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Vogue_logo.svg/200px-Vogue_logo.svg.png",
      imagePath: "press-vogue"
    },
    {
      name: "GQ",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/GQ_logo.svg/200px-GQ_logo.svg.png",
      imagePath: "press-gq"
    },
    {
      name: "Elle",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Elle_logo.svg/200px-Elle_logo.svg.png",
      imagePath: "press-elle"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">As featured in</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {pressLogos.map((press) => (
              <div key={press.name} className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                <AdminImageUpload
                  src={press.logo}
                  alt={`${press.name} logo`}
                  className="h-8 md:h-10 w-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                  imagePath={press.imagePath}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressFeatures;
