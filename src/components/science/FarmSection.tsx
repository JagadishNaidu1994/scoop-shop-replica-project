
import React from 'react';

const FarmSection = () => {
  return (
    <section className="py-20 w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=600&fit=crop"
              alt="Tea plantation in Kagoshima mountains"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="bg-white flex items-center">
            <div className="px-8 lg:px-16 py-12 space-y-8">
              <h2 className="text-4xl font-bold text-black leading-tight">
                Our matcha farms
              </h2>

              {/* Shade-grown vs. sun-grown */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-black">
                  Shade-grown vs. sun-grown (the matcha lesson)
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Before we get into the fun part (drinking it), here's the quick tea nerd moment because it explains why good matcha tastes so different.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Green tea plants usually grow in sunlight. But matcha is made from tea leaves that are grown under shade for a period before harvest. Think of it like this:
                </p>
                <ul className="text-lg text-gray-600 leading-relaxed list-none space-y-2 pl-4">
                  <li>Sun-grown leaves = more bite, more bitterness, more "green tea" sharpness.</li>
                  <li>Shade-grown leaves = softer, smoother, more umami, more of that creamy matcha vibe.</li>
                </ul>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Shade changes how the plant grows—pushing it to hold onto more of the compounds that make matcha taste rounded and feel less aggressive in your cup. Then those leaves are picked, gently processed, and milled into a fine powder so you're not just steeping tea… you're drinking the leaf.
                </p>
              </div>

              {/* Why it tastes smooth */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-black">
                  The "why it tastes smooth" explanation
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Matcha's smoothness isn't an accident, it's engineered by tradition. Shade-growing helps develop a softer, more umami-forward leaf. Then it's gently dried and prepared for milling. Finally, stone-milling turns it into a powder so fine it practically floats.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  That fineness matters: more even texture, better whisking, and a creamier mouthfeel so the cup feels polished, not powdery. It's a slow process, but it's the difference between "green drink" and "matcha ritual."
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Genuine Japanese-style matcha is stone-ground at a speed of only 30-40g per hour to prevent heat friction, which can oxidize the tea and destroy its nutritional profile.
                </p>
              </div>

              {/* Refining & milling */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-black">
                  Refining & milling
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  After the leaves are shade-grown and picked, they're gently processed and slowly stone-milled into an ultra-fine powder. That "slow" part matters: the gentler the milling, the less heat builds up helping preserve the vivid green colour, fresh aroma, and smooth mouthfeel matcha is famous for. Once milled, the powder is carefully sifted so what ends up in your tin is fluffy, even, and whiskable: no coarse bits, no gritty surprises, no clumps that ruin your latte.
                </p>
              </div>

              {/* Quality checks */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-black">
                  Quality checks
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Before anything reaches you (or a café menu), matcha is checked for purity and safety, think unwanted contaminants and consistency markers. We're obsessive about the two things you can't fake: how it performs in a cup, and how clean it is behind the scenes. If it doesn't meet standard, it doesn't ship. Simple.
                </p>
              </div>

              {/* Packaging & ready-to-ritual */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-black">
                  Packaging & ready-to-ritual
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Once it passes, it's packed to keep it fresh and protected so the colour stays bright, the flavour stays smooth, and the texture stays silky. Then it's ready for what it was made for: daily rituals at home, or barista-level drinks in cafés minus the drama.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmSection;
