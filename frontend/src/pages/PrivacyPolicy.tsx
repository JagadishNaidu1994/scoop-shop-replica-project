
import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, User, Mail, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Shield className="mx-auto h-16 w-16 text-black mb-4" />
          <h1 className="text-4xl font-bold text-black mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 1, 2024</p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-2">
              <User className="h-6 w-6" />
              1. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-black mb-2">Personal Information</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>Name and contact information</li>
                  <li>Email address and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-black mb-2">Usage Information</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>Browsing history and preferences</li>
                  <li>Purchase history and patterns</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                </ul>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6" />
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send you confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Improve our products and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6" />
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
              <h3 className="font-semibold text-black mb-2">We may share your information with:</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>Service providers who help us operate our business</li>
                <li>Payment processors for transaction processing</li>
                <li>Shipping companies for order delivery</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Lock className="mx-auto h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-black text-sm">Encryption</h3>
                <p className="text-gray-600 text-xs mt-1">All data is encrypted in transit and at rest</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-semibold text-black text-sm">Secure Servers</h3>
                <p className="text-gray-600 text-xs mt-1">Data stored on secure, monitored servers</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Eye className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-semibold text-black text-sm">Access Control</h3>
                <p className="text-gray-600 text-xs mt-1">Limited access to authorized personnel only</p>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">5. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed">
              You have certain rights regarding your personal information, including the right to access, update, or delete your data.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2">
              <li>Access and update your account information</li>
              <li>Request deletion of your personal data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Restrict processing of your data</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">6. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-gray-700 text-sm">
                You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
              </p>
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-2">
              <Mail className="h-6 w-6" />
              8. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our practices, please contact us:
            </p>
            <div className="mt-4 p-6 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">privacy@nastea.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">+91 40 1234 5678</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700 font-medium">NASTEA Privacy Team</p>
                <p className="text-gray-600">Hyderabad, Telangana, India</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
