
import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-pink-400 mb-4">Alec's Ice Cream</h3>
            <p className="text-gray-300 mb-4">
              Serving the finest handcrafted ice cream since 1985. Made with love, 
              using only the freshest ingredients and traditional recipes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Twitter</a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-pink-400" />
                <span className="text-gray-300">(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-pink-400" />
                <span className="text-gray-300">info@alecsicecream.com</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-pink-400" />
                <span className="text-gray-300">123 Sweet Street, City, ST 12345</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock size={16} className="mr-2 text-pink-400" />
                <div className="text-gray-300">
                  <div>Mon-Thu: 11am-9pm</div>
                  <div>Fri-Sat: 11am-10pm</div>
                  <div>Sunday: 12pm-8pm</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 Alec's Ice Cream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
