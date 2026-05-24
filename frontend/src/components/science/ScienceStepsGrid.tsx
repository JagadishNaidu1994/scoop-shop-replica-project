import React from 'react';

type ScienceStep = {
  title: string;
  image: string;
  reverse?: boolean;
  body: string[];
};

const steps: ScienceStep[] = [
  {
    title: "Shade-grown vs. sun-grown (the matcha lesson)",
    image: "/lovable-uploads/NDN01022-2.jpg",
    body: [
      "Before we get into the fun part, here's the quick tea nerd moment because it explains why good matcha tastes so different.",
      "Green tea plants usually grow in sunlight. But matcha is made from tea leaves that are grown under shade for a period before harvest.",
      "Sun-grown leaves = more bite, more bitterness, more green-tea sharpness. Shade-grown leaves = softer, smoother, more umami, more of that creamy matcha vibe.",
      "Shade changes how the plant grows, pushing it to hold onto more of the compounds that make matcha taste rounded and feel less aggressive in your cup. Then those leaves are picked, gently processed, and milled into a fine powder so you're not just steeping tea, you're drinking the leaf."
    ]
  },
  {
    title: 'The "why it tastes smooth" explanation',
    image: "/lovable-uploads/NDN00780-3.jpg",
    reverse: true,
    body: [
      "Matcha's smoothness isn't an accident, it's engineered by tradition. Shade-growing helps develop a softer, more umami-forward leaf. Then it's gently dried and prepared for milling.",
      "Finally, stone-milling turns it into a powder so fine it practically floats. That fineness matters: more even texture, better whisking, and a creamier mouthfeel so the cup feels polished, not powdery.",
      "It's a slow process, but it's the difference between green drink and matcha ritual. Genuine Japanese-style matcha is stone-ground at a speed of only 30-40g per hour to prevent heat friction, which can oxidize the tea and destroy its nutritional profile."
    ]
  },
  {
    title: "Refining & milling",
    image: "/lovable-uploads/NR_on_Matcha_powder.png",
    body: [
      "After the leaves are shade-grown and picked, they're gently processed and slowly stone-milled into an ultra-fine powder.",
      "That slow part matters: the gentler the milling, the less heat builds up, helping preserve the vivid green colour, fresh aroma, and smooth mouthfeel matcha is famous for.",
      "Once milled, the powder is carefully sifted so what ends up in your tin is fluffy, even, and whiskable: no coarse bits, no gritty surprises, no clumps that ruin your latte."
    ]
  },
  {
    title: "Quality checks",
    image: "/lovable-uploads/Wholesale_2.png",
    reverse: true,
    body: [
      "Before anything reaches you, or a cafe menu, matcha is checked for purity and safety, including unwanted contaminants and consistency markers.",
      "We're obsessive about the two things you can't fake: how it performs in a cup, and how clean it is behind the scenes.",
      "If it doesn't meet standard, it doesn't ship. Simple."
    ]
  },
  {
    title: "Packaging & ready-to-ritual",
    image: "/lovable-uploads/NDN00802-Edit.jpg",
    body: [
      "Once it passes, it's packed to keep it fresh and protected so the colour stays bright, the flavour stays smooth, and the texture stays silky.",
      "Then it's ready for what it was made for: daily rituals at home, or barista-level drinks in cafes minus the drama."
    ]
  }
];

const ScienceStepsGrid = () => {
  return (
    <section className="bg-white py-20 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="space-y-20">
          {steps.map((step) => {
            const imageOrder = step.reverse ? 'order-2' : 'order-1';
            const textOrder = step.reverse ? 'order-1' : 'order-2';

            return (
              <article key={step.title} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className={`${imageOrder}`}>
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-full min-h-[240px] w-full object-cover sm:min-h-[320px] md:min-h-[420px] lg:min-h-[520px] rounded-lg"
                  />
                </div>

                <div className={`space-y-8 ${textOrder}`}>
                  <div>
                    <h3 className="text-4xl font-bold text-black">
                      {step.title}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {step.body.map((paragraph) => (
                      <p key={paragraph} className="text-lg text-gray-600 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScienceStepsGrid;
