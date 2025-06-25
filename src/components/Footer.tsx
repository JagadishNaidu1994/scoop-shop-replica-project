
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold text-white mb-4">alec's</h3>
            <p className="text-blue-200 mb-4">
              Premium organic ice cream made with regenerative ingredients. 
              The first ever probiotic ice cream that's good for you and the planet.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-200 hover:text-yellow-300 transition-colors">Facebook</a>
              <a href="#" className="text-blue-200 hover:text-yellow-300 transition-colors">Instagram</a>
              <a href="#" className="text-blue-200 hover:text-yellow-300 transition-colors">Twitter</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/products" className="block text-blue-200 hover:text-yellow-300">Products</a>
              <a href="/culture-cup" className="block text-blue-200 hover:text-yellow-300">Culture Cup</a>
              <a href="/stores" className="block text-blue-200 hover:text-yellow-300">Find Stores</a>
              <a href="/about" className="block text-blue-200 hover:text-yellow-300">About Us</a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-yellow-300" />
                <span className="text-blue-200">(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-yellow-300" />
                <span className="text-blue-200">hello@alecsicecream.com</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-yellow-300" />
                <span className="text-blue-200">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-8 text-center">
          <p className="text-blue-300">© 2024 Alec's Ice Cream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
