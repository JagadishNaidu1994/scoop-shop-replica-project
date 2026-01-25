
import React, { useState } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import AdminImageUpload from '@/components/AdminImageUpload';
import { Phone, Mail, MapPin, Coffee, Users, Award, Truck, Package, IndianRupee, GraduationCap } from 'lucide-react';
import { useWholesaleForm } from '@/hooks/useWholesaleForm';

const Wholesale = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Café',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: ''
  });

  const { submitForm, isSubmitting } = useWholesaleForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      businessType: ''
    };

    let isValid = true;

    // Validate name (required)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Validate email (required and format)
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate phone (required)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    // Validate business type (required)
    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const result = await submitForm(formData);

    if (result.success) {
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessType: 'Café',
        message: ''
      });
      setErrors({
        name: '',
        email: '',
        phone: '',
        businessType: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your next 
<br />
                <span className="text-amber-600">Matcha Partner.</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
Premium Japanese matcha, barista training, menu support, flexible bulk packs, and a team you can actually rely on.              </p>
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
We are the wholesale arm of Nastea Rituals, we provide matcha guidance to cafes, bakeries, baristas, chefs, pâtissiers, chocolatiers, and F&B artisans.          </p>
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
            <p className="text-gray-700 text-lg">Everything you need for matcha excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Products & Grades */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&h=300&fit=crop"
                alt="Matcha powder grades"
                className="w-full h-64 object-cover"
                imagePath="wholesale-products-grades"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="text-green-600" size={24} />
                  Products & Grades
                </h3>
                <p className="text-gray-700 mb-6">
                  Premium Japanese matcha grades tailored for every application—from signature drinks to culinary creations.
                </p>
                <div className="space-y-3 text-gray-600">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="font-semibold text-green-800">Organic Imperial Ceremonial Grade</span>
                    <p className="text-sm text-gray-600 mt-1">Premium lattes & signature drinks</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="font-semibold text-green-800">Organic Ceremonial Grade</span>
                    <p className="text-sm text-gray-600 mt-1">Daily lattes, iced drinks, high-volume service</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="font-semibold text-green-800">Japanese Classic Grade</span>
                    <p className="text-sm text-gray-600 mt-1">Baking, desserts, R&D, matcha infusions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & MOQs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1554224311-beee460c201f?w=500&h=300&fit=crop"
                alt="Business pricing and packages"
                className="w-full h-64 object-cover"
                imagePath="wholesale-pricing-moqs"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <IndianRupee className="text-amber-600" size={24} />
                  Pricing & MOQs
                </h3>
                <p className="text-gray-700 mb-6">
                  Trial-friendly minimums and flexible payment terms designed for growing cafés and established partners.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">MOQ:</span> Starting from as low as 250g (trial-friendly)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">Payment terms:</span> UPI / bank transfer (credit terms for repeat partners)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">Samples:</span> 10g at INR 500 + delivery. Available for cafés ready for onboarding
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Supply & Delivery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=500&h=300&fit=crop"
                alt="Delivery and logistics"
                className="w-full h-64 object-cover"
                imagePath="wholesale-supply-delivery"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="text-blue-600" size={24} />
                  Supply & Delivery (consistent, not chaotic)
                </h3>
                <p className="text-gray-700 mb-6">
                  Reliable recurring supply with fast delivery and batch-to-batch consistency you can trust.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">Recurring supply:</span> Bi-weekly / monthly re-stocks tailored to your needs
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">Lead time:</span> 5 days or under. Fast dispatch + Pan-India shipping
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">Consistency:</span> Batch standard for colour + taste (barista-proof)
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Training & Growth Support */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <AdminImageUpload
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=300&fit=crop"
                alt="Barista training and support"
                className="w-full h-64 object-cover"
                imagePath="wholesale-training-support"
              />
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="text-purple-600" size={24} />
                  Training & Growth Support (we help you sell it)
                </h3>
                <p className="text-gray-700 mb-6">
                  Comprehensive barista training, menu engineering, and co-marketing support to help your matcha offerings thrive.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">Free barista training:</span> Recipes, ratios, workflow, speed tips
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">Menu engineering:</span> Best-sellers + pricing guidance
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">POS assets:</span> Table-talkers, menu inserts, QR codes
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <div>
                      <span className="font-semibold text-gray-800">Co-marketing:</span> Reels, collabs, seasonal drops, "NR x Your Café" moments
                    </div>
                  </li>
                </ul>
              </div>
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
              Drop us a message to learn more about our Wholesale Matcha Service and how we can help your business thrive.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-700 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-600'
                    } focus:border-amber-500 focus:outline-none text-white`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-700 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    } focus:border-amber-500 focus:outline-none text-white`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-700 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-600'
                    } focus:border-amber-500 focus:outline-none text-white`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Business Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-gray-700 rounded-lg border ${
                      errors.businessType ? 'border-red-500' : 'border-gray-600'
                    } focus:border-amber-500 focus:outline-none text-white`}
                  >
                    <option value="Café">Cafe</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Office">Office</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.businessType && (
                    <p className="text-red-400 text-sm mt-1">{errors.businessType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-500 focus:outline-none text-white"
                    placeholder="Tell us about your business and matcha needs..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
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
