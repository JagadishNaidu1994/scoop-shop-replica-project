
import React, { useState } from 'react';
import AdminImageUpload from './AdminImageUpload';

const NasteaStandard = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const items = [
    {
      id: 'item-1',
      title: 'Japan-Grown, Shade-Grown',
      content: "We source Kagoshima Japanese matcha that's shade-grown for the signature umami and smoothness for your daily routine.",
    },
    {
      id: 'item-2',
      title: 'Stone-Milled for Silk-Smooth Sips',
      content: 'Our leaves are stone-milled into a fine, fluffy powder that blends clean, whisks fast, and drinks like velvet-no grit, no swampy bitterness.',
    },
    {
      id: 'item-3',
      title: 'Grades That Match Your Mood',
      content: 'From Ceremonial for your main-character mornings to Premium for daily lattes and cafe menus, our lineup is built for consistency in taste, texture, and that neon-clean colour everyone notices.',
    },
    {
      id: 'item-4',
      title: 'Consistency You Can Count On',
      content: 'Every batch is selected to hit the same flavour-and-colour standard-so your cup (and your cafe drinks) look iconic, taste smooth, and never surprise you in a bad way.',
    },
  ];

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
      <div className="w-full px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-0">
          <div className="order-2 lg:order-1 flex bg-white">
            <div className="flex min-h-[540px] w-full flex-col justify-between px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#0b1535] leading-tight">
                  The NASTEA Standard:
                </h2>
                <p className="mt-5 max-w-[720px] text-base sm:text-lg lg:text-[2rem] lg:leading-[1.45] text-[#1d233d]">
                  Our matcha is sourced, stone-milled, and crafted for maximum potency-delivering real results.
                </p>
              </div>

              <div className="mt-8">
                {items.map((item, index) => {
                  const isOpen = openItem === item.id;
                  const borderClass =
                    index === items.length - 1
                      ? 'border-y border-[#1d233d]/30'
                      : 'border-t border-[#1d233d]/30';

                  return (
                    <div key={item.id} className={borderClass}>
                      <button
                        type="button"
                        onClick={() => setOpenItem(isOpen ? null : item.id)}
                        className="flex w-full items-center justify-between py-3 text-left sm:py-4"
                      >
                        <span className="pr-4 text-[clamp(1.02rem,1.2vw,1.65rem)] font-semibold leading-tight text-[#121938]">
                          {item.title}
                        </span>
                        <span className="text-[clamp(1.45rem,1.7vw,2rem)] leading-none text-[#1d233d]">
                          {isOpen ? '-' : '+'}
                        </span>
                      </button>

                      {isOpen ? (
                        <p className="pb-4 pr-8 text-[clamp(0.88rem,0.9vw,1.08rem)] leading-[1.55] text-[#2f3a5c]">
                          {item.content}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <AdminImageUpload
              src="/lovable-uploads/NR_Cup-3.png"
              alt="Person holding NASTEA matcha cup"
              className="h-full min-h-[300px] w-full object-cover sm:min-h-[420px] lg:min-h-[760px]"
              imagePath="nastea-standard-hands" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NasteaStandard;
