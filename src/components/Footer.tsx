import React, { useState } from 'react';
import { Instagram, Facebook } from 'lucide-react';

const Footer = () => {
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
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <div className="space-y-2">
              <a href="/story" className="block text-gray-400 hover:text-white transition-colors text-sm">Our Story</a>
              <a href="/science" className="block text-gray-400 hover:text-white transition-colors text-sm">Science</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Help Me Choose a Product</a>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <div className="space-y-2">
              <a href="/journal" className="block text-gray-400 hover:text-white transition-colors text-sm">Our Journal</a>
              <a href="/recipes" className="block text-gray-400 hover:text-white transition-colors text-sm">Recipes</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Loyalty & Rewards</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Refer a Friend</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Become an Affiliate</a>
            </div>
          </div>

          {/* Customer Hub */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Hub</h4>
            <div className="space-y-2">
              <a href="/faq" className="block text-gray-400 hover:text-white transition-colors text-sm">FAQs</a>
              <a href="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Shipping & Returns</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Help Centre</a>
              <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="/terms" className="block text-gray-400 hover:text-white transition-colors text-sm">Terms & Conditions</a>
            </div>
          </div>

          {/* Shop Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop Products</h4>
            <div className="space-y-2">
              <a href="/shop" className="block text-gray-400 hover:text-white transition-colors text-sm">Super Blends</a>
              <a href="/shop" className="block text-gray-400 hover:text-white transition-colors text-sm">Pure Powders</a>
              <a href="/shop" className="block text-gray-400 hover:text-white transition-colors text-sm">Gummies</a>
              <a href="/shop" className="block text-gray-400 hover:text-white transition-colors text-sm">Stacks</a>
              <a href="/shop" className="block text-gray-400 hover:text-white transition-colors text-sm">Accessories</a>
            </div>
          </div>
        </div>

        {/* Large NASTEA Branding */}
        <div className="border-t border-gray-800 pt-4 pb-4">
          <div className="text-center overflow-hidden py-2">
            <h1 className="text-[24vw] md:text-[30vw] lg:text-[26vw] font-bold leading-none tracking-tighter text-white">
              NASTEA
            </h1>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-4">
            <div className="text-xs text-gray-500 mb-4 md:mb-0">
              © NASTEA. NASTEA is a trademark of NASTEA Limited.
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/American_Express_logo_%282018%29.svg" alt="American Express" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
