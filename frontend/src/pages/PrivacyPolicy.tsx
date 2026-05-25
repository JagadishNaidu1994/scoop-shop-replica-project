import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#0D1B2A' }}>Privacy Policy</h1>
          <p className="text-sm mb-8" style={{ color: '#6B7280' }}>Nastea Rituals LLP</p>
          <p className="text-sm mb-8" style={{ color: '#6B7280' }}>Effective date: 22 Feb 2026</p>

          <div className="space-y-8" style={{ color: '#6B7280' }}>
            <section>
              <p className="font-semibold mb-4" style={{ color: '#0D1B2A' }}>Legal entity: Nastea Rituals LLP (India, Telangana)</p>
              <p className="font-semibold mb-2" style={{ color: '#0D1B2A' }}>Registered address:</p>
              <p className="mb-4">Flat 101, Raaga Residency, Ayyappa Society, Madhapur, Hyderabad, Telangana 500081, India</p>
              <p className="font-semibold mb-2" style={{ color: '#0D1B2A' }}>Privacy contact:</p>
              <p>hello@nastearituals.com</p>
            </section>

            <section>
              <p className="mb-4">Nastea Rituals ("Nastea", "we", "our", "us") respects your privacy and is committed to protecting the personal information you share with us when you visit our website, create an account, place an order, join our waitlist/newsletter, or contact us for wholesale/café enquiries.</p>
              <p>This Privacy Policy explains what information we collect, how we use it, how we share it, and the choices you have.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>1) What this policy covers</h2>
              <p className="mb-4">This policy applies to:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Our website and any pages/forms on it (newsletter, waitlist, contact, wholesale enquiry)</li>
                <li>Account creation and login</li>
                <li>Purchases and order fulfilment</li>
                <li>Communications via email and WhatsApp Business (where you choose to interact with us)</li>
              </ul>
              <p>This policy does not cover third-party websites you may reach through links on our site (they have their own policies).</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>2) Information we collect</h2>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>A) Information you provide directly</h3>
              <p className="mb-4">Depending on how you use our website, we may collect:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li><strong>Identity & contact details:</strong> name, email address, phone number</li>
                <li><strong>Account details:</strong> login credentials (stored in an encrypted/hashed format where applicable)</li>
                <li><strong>Date of birth:</strong> when you provide it (e.g., account profile / verification / personalisation)</li>
                <li><strong>Order & delivery details:</strong> shipping address, order items, order value, order history</li>
                <li><strong>Customer support details:</strong> messages you send us, order issues, preferences</li>
                <li><strong>Wholesale/café enquiry details:</strong> café/brand name, city, number of outlets, whether you serve matcha, estimated order volume, menu pricing context (as shared), and any additional information you submit through the form</li>
              </ul>
              <p className="mb-4">We do not intentionally collect sensitive personal data (like health information, government IDs, or financial account details) through our website forms.</p>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>B) Information collected automatically</h3>
              <p className="mb-4">When you browse our website, we may automatically collect:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li><strong>Device & usage data:</strong> IP address, browser type, device type, pages viewed, time spent, clicks, referring/exit pages</li>
                <li><strong>Approximate location:</strong> inferred from IP (e.g., city/region-level)</li>
                <li><strong>Site performance data:</strong> errors, load times, and general diagnostic info</li>
              </ul>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>C) Payment information</h3>
              <p className="mb-4">We use Razorpay to process payments.</p>
              <p className="mb-4">We do not store your card details on our servers.</p>
              <p>Razorpay handles payment authentication and processing; we may receive transaction metadata like payment status, payment method type, and a transaction reference ID.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>3) How we use your information (and why)</h2>
              <p className="mb-4">We use your information for the following purposes:</p>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>A) To run the website and provide services</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Create and manage your account</li>
                <li>Process orders and payments</li>
                <li>Confirm orders, send invoices/receipts, and provide order updates</li>
                <li>Fulfil and deliver your purchases via logistics partners (e.g., Delhivery)</li>
                <li>Provide customer support and resolve issues</li>
              </ul>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>B) To communicate with you</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Reply to your questions and requests</li>
                <li>Send service messages (order status, delivery updates, support follow-ups)</li>
                <li>Where you opt in (or where permitted), send product updates, drops, and newsletters via email</li>
                <li>If you provide your phone number, we may contact you via WhatsApp Business for important service updates (like delivery coordination) or to respond to enquiries you initiated</li>
              </ul>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>C) To improve our website and offering</h3>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Understand what pages and content people find useful</li>
                <li>Improve site experience, checkout performance, and product pages</li>
                <li>Debug issues and prevent abuse/fraud</li>
              </ul>

              <h3 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>D) For wholesale and café enquiries</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Evaluate and respond to wholesale requests</li>
                <li>Share relevant wholesale info (catalogue, pricing, MOQ, delivery options) after understanding fit and requirements</li>
                <li>Maintain enquiry records in our CRM (Zoho) so we can follow up appropriately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>4) Analytics (Google Analytics)</h2>
              <p className="mb-4">We use Google Analytics to understand website traffic and performance. Google Analytics may collect information such as pages visited, time spent, device type, approximate location, and interactions.</p>
              <p>This helps us understand what's working, what's confusing, and what needs improvement. It's not used to identify you personally in a "creepy" way — it's mainly for aggregated insight.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>5) CRM and record-keeping (Zoho)</h2>
              <p className="mb-4">We use Zoho to manage customer support and enquiries (including wholesale/café leads). This may include:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Contact details you provided (name, email, phone)</li>
                <li>Enquiry information and communication history</li>
                <li>Order or support context where relevant</li>
              </ul>
              <p>Access is restricted to authorised team members who need it to do their jobs.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>6) Who we share your information with</h2>
              <p className="mb-4">We share personal information only when needed to run the business and deliver services. Categories of recipients include:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li><strong>Payment processor:</strong> Razorpay (to process payments and manage fraud/security checks)</li>
                <li><strong>Shipping/logistics:</strong> Delhivery (to ship and deliver orders; includes name, phone, address, and order reference)</li>
                <li><strong>Email & WhatsApp communications:</strong> service providers used to send emails and manage WhatsApp Business communication</li>
                <li><strong>Analytics provider:</strong> Google (Google Analytics)</li>
                <li><strong>CRM provider:</strong> Zoho</li>
              </ul>
              <p className="mb-4">We may also share information:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>If required by law or legal process (e.g., court orders, lawful requests)</li>
                <li>To enforce our Terms, prevent fraud, or protect the safety and rights of our users and business</li>
                <li>In a business transfer scenario (e.g., merger/acquisition), with appropriate safeguards</li>
              </ul>
              <p>We do not sell your personal information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>7) Data retention (how long we keep it)</h2>
              <p className="mb-4">We retain personal information only as long as necessary for:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Order fulfilment, returns, and customer support</li>
                <li>Accounting, tax, and regulatory compliance</li>
                <li>Enquiry management and relationship history (especially for wholesale)</li>
                <li>Fraud prevention and security</li>
              </ul>
              <p>Retention periods vary based on the purpose and legal obligations. When data is no longer needed, we delete it or anonymise it.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>8) Security</h2>
              <p className="mb-4">We take reasonable safeguards to protect your information against unauthorised access, alteration, disclosure, or destruction. This includes:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Access controls and restricted internal permissions</li>
                <li>Secure handling of account credentials</li>
                <li>Working with reputable providers for payments, analytics, and CRM</li>
              </ul>
              <p>No system is 100% secure, but we take security seriously and we don't treat your data casually.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>9) Your choices and rights</h2>
              <p className="mb-4">You can:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Access and update your account information (where available via account settings)</li>
                <li>Unsubscribe from marketing emails using the link in the email</li>
                <li>Request deletion of your account or personal information (subject to legal requirements to retain certain records)</li>
                <li>Request correction if information is inaccurate</li>
                <li>Opt out of non-essential communications by contacting us</li>
              </ul>
              <p>To make any request, email us at hello@nastearituals.com</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>10) Date of birth (DOB)</h2>
              <p className="mb-4">If you provide your DOB, we use it only for legitimate purposes like:</p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Account profile consistency</li>
                <li>Age-related personalisation (where relevant)</li>
                <li>Basic internal analytics (in aggregated form)</li>
              </ul>
              <p>We don't use DOB to make sensitive inferences.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>11) Children's privacy</h2>
              <p>Our website and products are intended for a general audience and are not specifically directed at children. If you believe a child has provided us personal information, contact us and we will take appropriate steps to remove it.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>12) Changes to this Privacy Policy</h2>
              <p>We may update this policy from time to time to reflect changes in our practices, services, or legal requirements. We'll update the "Effective date" at the top when we do.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>13) Contact us</h2>
              <p className="mb-4">For privacy questions, requests, or concerns:</p>
              <div>
                <p className="font-semibold mb-2" style={{ color: '#0D1B2A' }}>Nastea Rituals LLP</p>
                <p className="mb-2"><strong>Address:</strong> Flat 101, Raaga Residency, Ayyappa Society, Madhapur, Hyderabad, Telangana 500081, India</p>
                <p><strong>Email:</strong> hello@nastearituals.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
