
import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import AdminImageUpload from '@/components/AdminImageUpload';
import { Phone, Mail, MapPin, Coffee, Users, Award, Truck } from 'lucide-react';

const Wholesale = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Next Partnership<br />
                <span className="text-amber-600">Exceptional Coffee</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Great coffee, barista training, high-quality equipment, a commitment to sustainability, and a team you can rely on.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
                  Get Started
                </button>
                <button className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop"
                alt="Professional coffee setup"
                className="rounded-2xl shadow-2xl"
                imagePath="wholesale-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            We are the wholesale arm of The Missing Bean, we provide coffee guidance to cafes, restaurants, offices, and other businesses.
          </p>
        </div>
      </section>

      {/* Coffee Excellence Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=500&fit=crop"
                alt="Coffee beans being roasted"
                className="rounded-2xl shadow-lg w-full"
                imagePath="wholesale-coffee-excellence"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Coffee Excellence</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                We source our beans directly from farmers and cooperatives around the world, ensuring fair trade practices and exceptional quality. Our roasting process brings out the unique characteristics of each origin.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="text-amber-600 flex-shrink-0" size={24} />
                  <span className="text-gray-700">Award-winning coffee beans</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Coffee className="text-amber-600 flex-shrink-0" size={24} />
                  <span className="text-gray-700">Expert roasting techniques</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="text-amber-600 flex-shrink-0" size={24} />
                  <span className="text-gray-700">Dedicated support team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-700 text-lg">Everything you need for coffee excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Barista Training */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=300&fit=crop"
                alt="Barista training session"
                className="w-full h-64 object-cover"
                imagePath="wholesale-barista-training"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Barista Training & Ongoing Support</h3>
                <p className="text-gray-700 mb-6">
                  Our comprehensive training programs ensure your team can create exceptional coffee experiences for your customers.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    On-site barista training
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Ongoing support and consultation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Equipment maintenance guidance
                  </li>
                </ul>
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=300&fit=crop"
                alt="Professional espresso machine"
                className="w-full h-64 object-cover"
                imagePath="wholesale-equipment"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top-of-the-Line Equipment</h3>
                <p className="text-gray-700 mb-6">
                  We provide and maintain professional-grade equipment to ensure consistent, high-quality results.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Professional espresso machines
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Grinders and brewing equipment
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Installation and maintenance
                  </li>
                </ul>
              </div>
            </div>

            {/* Sourcing */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=300&fit=crop"
                alt="Coffee farm and sourcing"
                className="w-full h-64 object-cover"
                imagePath="wholesale-sourcing"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ethically Sourced Beans</h3>
                <p className="text-gray-700 mb-6">
                  We work directly with farmers to ensure fair prices and sustainable farming practices.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Direct relationships with farmers
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Fair trade and organic options
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Seasonal specialty selections
                  </li>
                </ul>
              </div>
            </div>

            {/* Sustainability */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop"
                alt="Sustainable coffee practices"
                className="w-full h-64 object-cover"
                imagePath="wholesale-sustainability"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainable Practices</h3>
                <p className="text-gray-700 mb-6">
                  Our commitment to sustainability extends to every aspect of our delivery and packaging process.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Biodegradable packaging materials
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Carbon-neutral delivery options
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                    Recyclable containers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Team Section */}
      <section className="py-16 bg-amber-50" id="expert-team">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
            <p className="text-gray-700 text-lg">Behind-the-beans professionals dedicated to your success</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                Our experienced team of coffee professionals is dedicated to helping your business succeed. From sourcing to service, we're here to support you every step of the way.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="text-center">
                  <AdminImageUpload
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="Sarah Johnson - Head of Wholesale"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                    imagePath="wholesale-team-sarah"
                  />
                  <h4 className="font-bold text-gray-900 text-lg">Sarah Johnson</h4>
                  <p className="text-amber-600 font-medium">Head of Wholesale</p>
                  <p className="text-gray-600 text-sm mt-2">15+ years in coffee industry</p>
                </div>
                <div className="text-center">
                  <AdminImageUpload
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    alt="Mike Chen - Training Manager"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg"
                    imagePath="wholesale-team-mike"
                  />
                  <h4 className="font-bold text-gray-900 text-lg">Mike Chen</h4>
                  <p className="text-amber-600 font-medium">Training Manager</p>
                  <p className="text-gray-600 text-sm mt-2">Certified barista trainer</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=500&fit=crop"
                alt="Coffee roasting facility"
                className="rounded-2xl shadow-2xl w-full"
                imagePath="wholesale-team-facility"
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

      <Footer />
    </div>
  );
};

export default Wholesale;
