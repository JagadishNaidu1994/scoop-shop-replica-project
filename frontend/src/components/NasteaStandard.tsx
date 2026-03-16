
import React from 'react';
import AdminImageUpload from './AdminImageUpload';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const NasteaStandard = () => {
  return (
    <section className="bg-gray-50 w-full my-[2px] py-[39px]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative order-2 lg:order-1">
            <AdminImageUpload
              src="/lovable-uploads/NR_Cup-3.png"
              alt="Person holding NASTEA matcha cup"
              className="w-full h-auto rounded-lg"
              imagePath="nastea-standard-hands" />
          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-between order-1 lg:order-2 min-h-[500px]">
            {/* Top: Heading + Subtitle */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">The NASTEA Standard:</h2>
              <p className="text-gray-600 text-base">
                Our matcha is sourced, stone-milled, and crafted for maximum quality—delivering real results.
              </p>
            </div>

            {/* Bottom: Collapsible Items */}
            <div className="mt-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-t border-gray-300 border-b-0">
                  <AccordionTrigger className="text-base font-semibold text-black hover:no-underline py-5">
                    Japan-Grown, Shade-Grown
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We source Kagoshima Japanese matcha that's shade-grown for the signature umami and smoothness for your daily routine.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-t border-gray-300 border-b-0">
                  <AccordionTrigger className="text-base font-semibold text-black hover:no-underline py-5">
                    Stone-Milled for Silk-Smooth Sips
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Our leaves are stone-milled into a fine, fluffy powder that blends clean, whisks fast, and drinks like velvet—no grit, no swampy bitterness.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-t border-gray-300 border-b-0">
                  <AccordionTrigger className="text-base font-semibold text-black hover:no-underline py-5">
                    Grades That Match Your Mood
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    From Ceremonial for your main-character mornings to Premium for daily lattes and café menus, our lineup is built for consistency in taste, texture, and that neon-clean colour everyone notices.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-t border-gray-300 border-b border-gray-300">
                  <AccordionTrigger className="text-base font-semibold text-black hover:no-underline py-5">
                    Consistency You Can Count On
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Every batch is selected to hit the same flavour-and-colour standard—so your cup (and your café drinks) look iconic, taste smooth, and never surprise you in a bad way.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NasteaStandard;