import React from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, RefreshCw, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderNavBar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-4">Return & Refund Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none space-y-8">
          {/* Overview */}
          <section className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Return Overview</h2>
            </div>
            <p className="text-muted-foreground">
              At NASTEA, we want you to be completely satisfied with your purchase. If you're not happy with your order, 
              we're here to help. Please review our return and refund policy below.
            </p>
          </section>

          {/* Return Window */}
          <section className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Return Window</h2>
            </div>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You have <strong>30 days</strong> from the date of delivery to initiate a return</li>
              <li>Items must be unused, unopened, and in their original packaging</li>
              <li>Proof of purchase (order confirmation or receipt) is required</li>
              <li>Returns initiated after 30 days will not be accepted</li>
            </ul>
          </section>

          {/* Eligible for Returns */}
          <section className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Eligible for Returns</h2>
            </div>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Unopened and sealed products in original packaging</li>
              <li>Damaged or defective products (reported within 48 hours of delivery)</li>
              <li>Wrong items received</li>
              <li>Items that don't match the product description</li>
            </ul>
          </section>

          {/* Not Eligible */}
          <section className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Not Eligible for Returns</h2>
            </div>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Opened or used products (for hygiene and quality reasons)</li>
              <li>Products without original packaging</li>
              <li>Items purchased on sale or with discount codes (unless defective)</li>
              <li>Gift cards or digital products</li>
              <li>Products damaged due to misuse or negligence</li>
            </ul>
          </section>

          {/* Refund Process */}
          <section className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Refund Process</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p><strong>Step 1:</strong> Contact our customer support team via email or through your account to initiate a return request.</p>
              <p><strong>Step 2:</strong> Once approved, you'll receive return shipping instructions and a return authorization number.</p>
              <p><strong>Step 3:</strong> Pack the item securely in its original packaging and ship it to our warehouse.</p>
              <p><strong>Step 4:</strong> Once we receive and inspect the item, your refund will be processed within 5-7 business days.</p>
              <p><strong>Step 5:</strong> Refunds will be credited to your original payment method. Bank processing times may vary.</p>
            </div>
          </section>

          {/* Shipping Costs */}
          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Shipping Costs</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Defective/Wrong Items:</strong> We cover return shipping costs</li>
              <li><strong>Change of Mind:</strong> Customer is responsible for return shipping costs</li>
              <li>Original shipping charges are non-refundable unless the return is due to our error</li>
            </ul>
          </section>

          {/* Exchanges */}
          <section className="bg-card rounded-lg p-6 border">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Exchanges</h2>
            <p className="text-muted-foreground">
              If you'd like to exchange an item for a different product, please return the original item for a refund 
              and place a new order for the desired product. This ensures the fastest processing time.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-card rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground m-0">Need Help?</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              If you have any questions about our return policy or need assistance with a return, 
              please contact our customer support team:
            </p>
            <ul className="list-none text-muted-foreground space-y-2">
              <li><strong>Email:</strong> support@nastea.com</li>
              <li><strong>Response Time:</strong> Within 24-48 hours</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReturnPolicy;
