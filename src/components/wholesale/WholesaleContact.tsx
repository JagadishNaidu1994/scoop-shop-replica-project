import React from 'react';
import { Phone, Mail, MapPin, Coffee, Users, Award, Truck } from 'lucide-react';

const WholesaleContact = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Drop us a message to learn more about our Wholesale Coffee Service and how we can help your business thrive.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Business Type</label>
                <select className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none text-white">
                  <option>Café</option>
                  <option>Restaurant</option>
                  <option>Office</option>
                  <option>Hotel</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none text-white"
                  placeholder="Tell us about your business and coffee needs..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="text-amber-400 flex-shrink-0" size={20} />
                  <span className="text-gray-300">(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-amber-400 flex-shrink-0" size={20} />
                  <span className="text-gray-300">wholesale@themissingbean.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-amber-400 flex-shrink-0" size={20} />
                  <span className="text-gray-300">Abingdon, Oxfordshire, UK</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-amber-400">Why Choose The Missing Bean?</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <span className="text-white font-medium block">Expert Support Team</span>
                    <span className="text-gray-400 text-sm">Dedicated professionals at your service</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Truck className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <span className="text-white font-medium block">Reliable Delivery</span>
                    <span className="text-gray-400 text-sm">Fresh coffee delivered on schedule</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Award className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <span className="text-white font-medium block">Premium Quality</span>
                    <span className="text-gray-400 text-sm">Award-winning coffee beans</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Coffee className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <span className="text-white font-medium block">Comprehensive Training</span>
                    <span className="text-gray-400 text-sm">Complete barista education programs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WholesaleContact;