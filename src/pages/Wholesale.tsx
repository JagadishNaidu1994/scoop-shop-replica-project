
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Coffee, Users, Award, Truck } from 'lucide-react';

const Wholesale = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Next Partnership<br />
                Exceptional Coffee
              </h1>
              <p className="text-xl mb-8 text-teal-100">
                Great coffee, barista training, high-quality equipment, a commitment to sustainability, and a team you can rely on.
              </p>
              <div className="flex space-x-4">
                <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop" 
                alt="Coffee shop interior" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We are the wholesale arm of The Missing Bean, we provide coffee guidance to cafes, restaurants, offices, and other businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=600&fit=crop" 
                alt="Coffee preparation" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Coffee Excellence</h2>
              <p className="text-gray-700">
                We source our beans directly from farmers and cooperatives around the world, ensuring fair trade practices and exceptional quality. Our roasting process brings out the unique characteristics of each origin.
              </p>
              <div className="flex items-center space-x-3">
                <Award className="text-teal-600" size={24} />
                <span className="text-gray-700">Award-winning coffee beans</span>
              </div>
              <div className="flex items-center space-x-3">
                <Coffee className="text-teal-600" size={24} />
                <span className="text-gray-700">Expert roasting techniques</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Barista Training */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=300&fit=crop" 
                alt="Barista training" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Barista training & ongoing support</h3>
                <p className="text-gray-700 mb-4">
                  Our comprehensive training programs ensure your team can create exceptional coffee experiences for your customers.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• On-site barista training</li>
                  <li>• Ongoing support and consultation</li>
                  <li>• Equipment maintenance guidance</li>
                </ul>
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop" 
                alt="Coffee equipment" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Top-of-the-line espresso machines & equipment</h3>
                <p className="text-gray-700 mb-4">
                  We provide and maintain professional-grade equipment to ensure consistent, high-quality results.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Professional espresso machines</li>
                  <li>• Grinders and brewing equipment</li>
                  <li>• Installation and maintenance</li>
                </ul>
              </div>
            </div>

            {/* Sourcing */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=300&fit=crop" 
                alt="Coffee sourcing" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ethically sourced, direct-trade coffee beans</h3>
                <p className="text-gray-700 mb-4">
                  We work directly with farmers to ensure fair prices and sustainable farming practices.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Direct relationships with farmers</li>
                  <li>• Fair trade and organic options</li>
                  <li>• Seasonal specialty selections</li>
                </ul>
              </div>
            </div>

            {/* Sustainability */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop" 
                alt="Sustainable packaging" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-friendly delivery and packaging</h3>
                <p className="text-gray-700 mb-4">
                  Our commitment to sustainability extends to every aspect of our delivery and packaging process.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Biodegradable packaging materials</li>
                  <li>• Carbon-neutral delivery options</li>
                  <li>• Recyclable containers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Meet our behind-the-beans team</h2>
              <p className="text-teal-100 mb-8">
                Our experienced team of coffee professionals is dedicated to helping your business succeed. From sourcing to service, we're here to support you every step of the way.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                    alt="Team member" 
                    className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-teal-200">Head of Wholesale</p>
                </div>
                <div className="text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                    alt="Team member" 
                    className="w-24 h-24 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h4 className="font-semibold">Mike Chen</h4>
                  <p className="text-sm text-teal-200">Training Manager</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop" 
                alt="Coffee roasting" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Partner With Us?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Drop us a message to learn more about our Wholesale Coffee Service and how we can help your business thrive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Type</label>
                  <select className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none">
                    <option>Café</option>
                    <option>Restaurant</option>
                    <option>Office</option>
                    <option>Hotel</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-teal-500 focus:outline-none"
                    placeholder="Tell us about your business and coffee needs..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
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
                    <Phone className="text-teal-400" size={20} />
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-teal-400" size={20} />
                    <span>wholesale@alecsicecream.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-teal-400" size={20} />
                    <span>123 Coffee Street, San Francisco, CA</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Why Choose Us?</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="text-teal-400" size={16} />
                    <span className="text-gray-300">Expert support team</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="text-teal-400" size={16} />
                    <span className="text-gray-300">Reliable delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="text-teal-400" size={16} />
                    <span className="text-gray-300">Premium quality products</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Coffee className="text-teal-400" size={16} />
                    <span className="text-gray-300">Comprehensive training</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Wholesale;
