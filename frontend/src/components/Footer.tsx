import React, { useState } from 'react';
import { Instagram } from 'lucide-react';

const Footer = () => {
  console.log("Footer component rendered");
  console.log("Footer rendered");
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
  };

  return (
    <footer className="bg-[#0a0e27] text-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Newsletter Section */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4">Stay in the know</h4>
            <p className="text-gray-400 text-sm mb-4">
              Sign up to the NASTEA newsletter to get the latest updates on product releases and events.
            </p>
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-transparent border border-gray-600 rounded px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  →
                </button>
              </div>
            </form>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/nastearituals/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <div className="space-y-2">
              <a href="/our-story" className="block text-gray-400 hover:text-white transition-colors text-sm">Our Story</a>
              <a href="/science" className="block text-gray-400 hover:text-white transition-colors text-sm">Science</a>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <div className="space-y-2">
              <a href="/journal" className="block text-gray-400 hover:text-white transition-colors text-sm">Our Journal</a>
              <a href="/recipes" className="block text-gray-400 hover:text-white transition-colors text-sm">Recipes</a>
            </div>
          </div>

          {/* Customer Hub */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Hub</h4>
            <div className="space-y-2">
              <a href="/faq" className="block text-gray-400 hover:text-white transition-colors text-sm">FAQs</a>
              <a href="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a>
              <a href="/privacy-policy" className="block text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="/terms" className="block text-gray-400 hover:text-white transition-colors text-sm">Terms & Conditions</a>
            </div>
          </div>

          {/* Shop Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop Products</h4>
            <div className="space-y-2">
              <a href="/products/1" className="block text-gray-400 hover:text-white transition-colors text-sm">Ceremonial Matcha</a>
              <a href="/products/2" className="block text-gray-400 hover:text-white transition-colors text-sm">Classic Matcha</a>
            </div>
          </div>
        </div>

        {/* Large NASTEA Logo */}
        <div className="border-t border-gray-800 pt-8 pb-8">
          <div className="flex justify-center mb-8 w-full -mx-4 sm:-mx-6 lg:-mx-8">
            <img src="/lovable-uploads/footer-logo.png" alt="NASTEA Footer Logo" className="w-full h-auto object-contain px-4 sm:px-6 lg:px-8" style={{ maxHeight: '400px' }} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-gray-500 mb-4 md:mb-0">
              NASTEA is a trademark of NASTEA Limited.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
