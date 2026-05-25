import React from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';

const TermsAndConditions = () => {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#0D1B2A' }}>Terms & Conditions</h1>
          <p className="text-sm mb-2" style={{ color: '#6B7280' }}>Last updated: 22 Feb 2026</p>
          <p className="text-sm mb-8" style={{ color: '#6B7280' }}>Website operated by: Nastea Rituals LLP, Telangana, India</p>

          <div className="space-y-8" style={{ color: '#6B7280' }}>
            <section>
              <p className="font-semibold mb-2" style={{ color: '#0D1B2A' }}>Registered address:</p>
              <p className="mb-4">Flat 101, Raaga Residency, Ayyappa Society, Madhapur, Hyderabad, Telangana 500081, India</p>
              <p className="font-semibold mb-2" style={{ color: '#0D1B2A' }}>Privacy contact:</p>
              <p className="mb-4">hello@nastearituals.com</p>
              <p>These Terms & Conditions ("Terms") govern your access to and use of the Nastea Rituals website ("Website"), including creating an account, browsing, submitting forms, and purchasing products. By using the Website, you agree to these Terms.</p>
              <p className="mt-4">If you do not agree, please do not use the Website.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>1) Disclaimer</h2>
              <p className="mb-4">The content on this Website is provided for general information. While we aim to keep information accurate and current, we do not guarantee it will always be complete, error-free, or up to date.</p>
              <p className="mb-4">Our products are food/beverage products for general consumption. They are not intended to diagnose, treat, cure, or prevent any disease.</p>
              <p className="mb-4">Product images are for illustrative purposes. Colour and appearance may vary due to lighting, screen settings, harvest variation, and preparation method.</p>
              <p>Preparation guidance and taste notes are suggestions and may vary by individual preference.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>2) Website Use (T&C)</h2>
              <p className="mb-4">You agree to use the Website only for lawful purposes and in a way that does not infringe others' rights or restrict their use of the Website.</p>
              <p className="mb-4">You must not attempt to interfere with the Website's operation or security (including hacking, scraping at scale, introducing malware, or attempting unauthorised access).</p>
              <p>We may restrict, suspend, or terminate access if we reasonably believe misuse, fraud, or breach of these Terms has occurred.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>3) Account Registration</h2>
              <p className="mb-4">To purchase products, you may need to create an account.</p>
              <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials and for activities carried out under your account.</p>
              <p className="mb-4">You agree to provide accurate and up-to-date information and update it if it changes.</p>
              <p>We may suspend or terminate accounts where we suspect fraud, misuse, or breach of these Terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>4) When You Make a Purchase</h2>
              <p className="mb-4">By placing an order, you confirm that the information provided (name, phone number, address, etc.) is accurate and complete.</p>
              <p className="mb-4">Your order is considered accepted only once we confirm it (e.g., via email/notification/WhatsApp) and/or dispatch it.</p>
              <p className="mb-4">We reserve the right to refuse, hold, or cancel an order (and process a refund) if:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>payment is not authorised or is flagged as high-risk,</li>
                <li>stock is unavailable,</li>
                <li>there is a pricing/website error,</li>
                <li>address/pincode is not serviceable, or</li>
                <li>we reasonably suspect fraud or misuse.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>5) Price & Delivery Charges</h2>
              <p className="mb-4">All prices are shown in INR and are inclusive of applicable taxes (including GST) unless stated otherwise.</p>
              <p className="mb-4">Delivery charges are payable and are calculated at checkout based on your pincode.</p>
              <p className="mb-4">Free delivery applies for orders above INR 2000 (as displayed at checkout).</p>
              <p className="mb-4">Prices may change at any time; however, you will be charged the price shown at checkout at the time you place the order.</p>
              <p>If a pricing error occurs, we may cancel the order and refund you in full.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>6) Methods of Payment</h2>
              <p className="mb-4">Payments are processed via Razorpay and any payment methods Razorpay supports (UPI, cards, net banking, wallets, etc.).</p>
              <p className="mb-4">We do not store full card details on our servers. Payment information is handled securely by Razorpay and/or your bank/payment provider.</p>
              <p>Payment authorisation is subject to checks by Razorpay, banks, and relevant authorities.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>7) Delivery</h2>
              <p className="mb-4">We deliver across India using Delhivery and/or other logistics partners as needed.</p>
              <p className="mb-4"><strong>Dispatch time:</strong> 1–2 business days (unless otherwise stated during peak periods or special drops).</p>
              <p className="mb-4"><strong>Delivery time:</strong> 2–7 business days, depending on location/serviceability.</p>
              <p className="mb-4">Delivery timelines are estimates. Delays can occur due to courier operations, weather, public holidays, strikes, or other circumstances outside our control.</p>
              <p>If a shipment is returned to us due to incorrect address, repeated failed delivery attempts, or refusal to accept delivery, we may (at our discretion) reship with additional charges or process a refund after deducting shipping and handling charges.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>8) Defective / Faulty Goods</h2>
              <p className="mb-4">If you receive a product that is damaged, defective, or incorrect, contact us within 24–36 hours of delivery.</p>
              <p className="mb-4">Please share:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>your order number,</li>
                <li>clear photos/videos of the outer packaging + product, and</li>
                <li>a brief description of the issue.</li>
              </ul>
              <p className="mb-4">Once verified, we will offer replacement or refund (as appropriate).</p>
              <p>For verified defective/incorrect/damaged goods, we bear the return pickup/shipping cost.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>9) Cancelling Orders & Returns</h2>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>A) Order cancellations</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Orders may be cancelled before dispatch with no cancellation fee.</li>
                <li>Orders cannot be cancelled after dispatch.</li>
                <li>If an order is already processed/packed or handed to the courier, we may treat it as dispatched for the purpose of cancellations.</li>
              </ul>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>B) Returns</h3>
              <p className="mb-4">Because our products are consumables, we follow a hygiene-first policy:</p>
              <p className="mb-4">No returns are accepted for opened/used consumable products.</p>
              <p className="mb-4">Returns are accepted only if:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>the product is defective/damaged/incorrect, or</li>
                <li>the product is unopened, sealed, unused, and resalable, and the request is raised within 10 days of delivery.</li>
              </ul>
              <p className="mb-6">We reserve the right to decline returns that do not meet the above conditions.</p>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>C) Refunds</h3>
              <p className="mb-4">Approved refunds will be processed to the original payment method where possible.</p>
              <p className="mb-4">Refund timeline: within 10 business days after approval, subject to bank/payment provider processing.</p>
              <p>Where return is approved due to our error (wrong item/defect/damage), we will process a replacement or refund as appropriate.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>10) Liability</h2>
              <p className="mb-4">To the maximum extent permitted by law, Nastea Rituals LLP shall not be liable for indirect, incidental, special, or consequential damages, including loss of profit, revenue, business, goodwill, or data arising from:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>use of the Website,</li>
                <li>purchase or use of products, or</li>
                <li>delivery delays beyond our control.</li>
              </ul>
              <p className="mb-4">Our total liability for any claim relating to an order shall not exceed the amount paid for that order.</p>
              <p>You are responsible for checking ingredient/product suitability for your preferences and circumstances.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>11) Privacy</h2>
              <p>Your use of the Website is also governed by our Privacy Policy, which explains how we collect, use, and protect personal information. By using the Website, you consent to our data practices as described in the Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>12) Customer Complaints</h2>
              <p className="mb-4">For complaints, support, or escalations, contact us with:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>order number (if applicable)</li>
                <li>a clear description of the issue</li>
                <li>photos/videos where relevant</li>
              </ul>
              <p className="mb-4">We aim to respond within a reasonable timeframe on business days.</p>
              <p><strong>Email:</strong> hello@nastearituals.com</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>13) Special Offers & Promotions</h2>
              <p className="mb-4">Promotions, discount codes, bundles, and limited-time offers may have specific conditions (minimum order value, validity period, stock availability, etc.).</p>
              <p className="mb-4">Promo codes are valid as stated and may be single-use or reusable depending on the terms shown.</p>
              <p className="mb-4">Promo codes cannot be combined unless explicitly stated.</p>
              <p>We may refuse or reverse promotional benefits where misuse, fraud, or policy breach is suspected.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>14) Jurisdiction</h2>
              <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Hyderabad, Telangana.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>15) General</h2>
              <p className="mb-4"><strong>Severability:</strong> If any part of these Terms is found invalid, the remainder remains enforceable.</p>
              <p className="mb-4"><strong>No waiver:</strong> Failure to enforce a provision is not a waiver of our rights.</p>
              <p className="mb-4"><strong>Changes:</strong> We may update these Terms from time to time. Updated Terms will be posted on the Website with a new "Last updated" date.</p>
              <p><strong>Contact:</strong> Questions about these Terms can be directed to hello@nastearituals.com.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>16) Wholesale / B2B Orders</h2>
              <p className="mb-4">Wholesale orders may be placed via the Website and/or through direct coordination (e.g., WhatsApp/email/invoice).</p>
              <p className="mb-4">Wholesale terms may differ from consumer terms (including pricing, MOQs, payment terms, delivery schedules, and return policies) and will be shared separately where applicable.</p>
              <p>Where a conflict exists between these consumer Terms and agreed wholesale terms, the wholesale terms will prevail for wholesale transactions.</p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
