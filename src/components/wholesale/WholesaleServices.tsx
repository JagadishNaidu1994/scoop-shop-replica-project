import React from 'react';
import AdminImageUpload from '@/components/AdminImageUpload';

const WholesaleServices = () => {
  return (
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
  );
};

export default WholesaleServices;