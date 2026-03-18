
import React from 'react';

const ScienceStepsGrid = () => {
  const steps = [
    {
      title: "Shade-grown vs. sun-grown (the matcha lesson)",
      description: "Before we get into the fun part (drinking it), here's the quick tea nerd moment because it explains why good matcha tastes so different.\n\nGreen tea plants usually grow in sunlight. But matcha is made from tea leaves that are grown under shade for a period before harvest. Think of it like this:\n\nSun-grown leaves = more bite, more bitterness, more \"green tea\" sharpness.\nShade-grown leaves = softer, smoother, more umami, more of that creamy matcha vibe.\n\nShade changes how the plant grows-pushing it to hold onto more of the compounds that make matcha taste rounded and feel less aggressive in your cup. Then those leaves are picked, gently processed, and milled into a fine powder so you're not just steeping tea… you're drinking the leaf.",
      image: "/lovable-uploads/NDN01022-2.jpg",
      reverse: false
    },
    {
      title: "The \"why it tastes smooth\" explanation",
      description: "Matcha's smoothness isn't an accident, it's engineered by tradition. Shade-growing helps develop a softer, more umami-forward leaf. Then it's gently dried and prepared for milling. Finally, stone-milling turns it into a powder so fine it practically floats.\n\nThat fineness matters: more even texture, better whisking, and a creamier mouthfeel so the cup feels polished, not powdery. It's a slow process, but it's the difference between \"green drink\" and \"matcha ritual.\"\n\nGenuine Japanese-style matcha is stone-ground at a speed of only 30-40g per hour to prevent heat friction, which can oxidize the tea and destroy its nutritional profile.",
      image: "/lovable-uploads/NDN00780-3.jpg",
      reverse: true
    },
    {
      title: "Refining & milling",
      description: "After the leaves are shade-grown and picked, they're gently processed and slowly stone-milled into an ultra-fine powder. That \"slow\" part matters: the gentler the milling, the less heat builds up helping preserve the vivid green colour, fresh aroma, and smooth mouthfeel matcha is famous for. Once milled, the powder is carefully sifted so what ends up in your tin is fluffy, even, and whiskable: no coarse bits, no gritty surprises, no clumps that ruin your latte.",
      image: "/lovable-uploads/NR_on_Matcha_powder.png",
      reverse: false
    },
    {
      title: "Quality checks",
      description: "Before anything reaches you (or a café menu), matcha is checked for purity and safety, think unwanted contaminants and consistency markers. We're obsessive about the two things you can't fake: how it performs in a cup, and how clean it is behind the scenes. If it doesn't meet standard, it doesn't ship. Simple.",
      image: "/lovable-uploads/Wholesale_2.png",
      reverse: true
    },
    {
      title: "Packaging & ready-to-ritual",
      description: "Once it passes, it's packed to keep it fresh and protected so the colour stays bright, the flavour stays smooth, and the texture stays silky. Then it's ready for what it was made for: daily rituals at home, or barista-level drinks in cafés minus the drama.",
      image: "/lovable-uploads/NDN00802-Edit.jpg",
      reverse: false
    }
  ];

  return (
    <section className="py-20 bg-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Our Scientific Process</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From shade-growing to stone-milling, every step is a blend of tradition and precision
          </p>
        </div>

        <div className="space-y-20">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-auto lg:h-[400px] ${
                step.reverse ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Content */}
              <div className={`flex flex-col justify-center space-y-6 overflow-hidden ${step.reverse ? 'lg:col-start-2' : ''}`}>
                <h3 className="text-3xl md:text-4xl font-bold text-black">{step.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Image */}
              <div className={`relative h-[300px] lg:h-full ${step.reverse ? 'lg:col-start-1' : ''}`}>
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScienceStepsGrid;
