
import React from 'react';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">FAQ</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Shipping & Returns</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Size Guide</a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Our Story</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Science</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Sustainability</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Careers</a>
            </div>
          </div>

          {/* Journal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Journal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Latest Articles</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Wellness Tips</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Recipes</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Research</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Accessibility</a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-6 mb-12">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            <Instagram size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            <Twitter size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            <Facebook size={24} />
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            <Youtube size={24} />
          </a>
        </div>

        {/* Large DIRTEA Branding */}
        <div className="text-center border-t border-gray-700 pt-12">
          <h1 className="text-8xl font-bold text-white mb-4">DIRTEA</h1>
          <p className="text-gray-400">© 2024 DIRTEA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
