
import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 1, 2024</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the NASTEA website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, you should not use our services.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">2. Products and Services</h2>
            <p className="text-gray-700 leading-relaxed">
              NASTEA offers premium tea products and related accessories. All product descriptions, prices, and availability are subject to change without notice. We reserve the right to discontinue any product at any time.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
              <li>All prices are listed in Indian Rupees (INR)</li>
              <li>Product images are for illustration purposes only</li>
              <li>Actual products may vary slightly from images</li>
              <li>We reserve the right to limit quantities</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">3. Orders and Payment</h2>
            <p className="text-gray-700 leading-relaxed">
              When you place an order, you agree to provide accurate and complete information. We accept various payment methods including credit cards, debit cards, and digital wallets.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
              <li>Orders are subject to acceptance and availability</li>
              <li>Payment must be received before order processing</li>
              <li>We reserve the right to cancel orders for any reason</li>
              <li>Pricing errors are subject to correction</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">4. Shipping and Delivery</h2>
            <p className="text-gray-700 leading-relaxed">
              We ship to addresses within India. Shipping costs are calculated based on your location and order weight. Delivery times are estimates and may vary based on location and external factors.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
              <li>Free shipping on orders above INR 1000</li>
              <li>Standard delivery: 3-7 business days</li>
              <li>Express delivery: 1-3 business days</li>
              <li>Delivery to remote areas may take longer</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">5. Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              We accept returns within 30 days of delivery for unopened products in original packaging. Refunds will be processed to the original payment method within 7-10 business days.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
              <li>Products must be unused and in original packaging</li>
              <li>Customer is responsible for return shipping costs</li>
              <li>Refunds exclude original shipping charges</li>
              <li>Some products may not be eligible for return</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">6. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account information and password. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of NASTEA and is protected by copyright and trademark laws.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              NASTEA shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our products or services.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">9. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">Email: legal@nastea.com</p>
              <p className="text-gray-700">Phone: +91 40 1234 5678</p>
              <p className="text-gray-700">Address: Hyderabad, Telangana, India</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
