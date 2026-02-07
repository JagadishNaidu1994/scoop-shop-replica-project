
import React, { useState } from 'react';
import HeaderNavBar from '@/components/HeaderNavBar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: 'Products',
      questions: [
        {
          q: 'What are functional mushrooms?',
          a: 'Functional mushrooms are nutrient-dense fungi that have been used for centuries in traditional medicine. They contain bioactive compounds that may support various aspects of health and wellness, including immune function, cognitive performance, and stress management.'
        },
        {
          q: 'How do I use DIRTEA products?',
          a: 'Simply add 1-2 teaspoons of your chosen DIRTEA blend to hot water, plant milk, or your favorite beverage. Stir well and enjoy. For best results, consume daily as part of your morning or evening routine.'
        },
        {
          q: 'Are your products organic?',
          a: 'Yes, all our mushroom powders are certified organic and sourced from trusted suppliers. We maintain the highest quality standards throughout our supply chain.'
        },
        {
          q: 'Can I take multiple DIRTEA products together?',
          a: 'Absolutely! Our products are designed to complement each other. Many customers enjoy mixing different blends or taking them at different times of the day to support various wellness goals.'
        }
      ]
    },
    {
      category: 'Shipping & Orders',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping typically takes 3-5 business days within the UK. Express shipping options are available for faster delivery. International shipping times vary by location.'
        },
        {
          q: 'Do you offer free shipping?',
          a: 'Yes! We offer free standard shipping on orders over £50 within the UK. International shipping rates apply for orders outside the UK.'
        },
        {
          q: 'Can I modify or cancel my order?',
          a: 'You can modify or cancel your order within 1 hour of placing it. After that, orders are processed for shipping. Please contact our customer service team as soon as possible.'
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. Some restrictions may apply to certain products in specific countries.'
        }
      ]
    },
    {
      category: 'Subscriptions',
      questions: [
        {
          q: 'How do subscriptions work?',
          a: 'With our subscription service, you save 20% on every order and receive your favorite products automatically at your chosen frequency. You can skip, modify, or cancel anytime.'
        },
        {
          q: 'Can I change my subscription frequency?',
          a: 'Yes! You can easily adjust your delivery frequency through your account dashboard or by contacting customer service. Options include every 4, 6, or 8 weeks.'
        },
        {
          q: 'How do I pause or cancel my subscription?',
          a: 'You can pause or cancel your subscription anytime through your account dashboard. There are no cancellation fees or minimum commitments.'
        }
      ]
    },
    {
      category: 'Health & Safety',
      questions: [
        {
          q: 'Are there any side effects?',
          a: 'Our products are generally well-tolerated. However, if you have any medical conditions, are pregnant, breastfeeding, or taking medications, please consult your healthcare provider before use.'
        },
        {
          q: 'Are your products third-party tested?',
          a: 'Yes, all our products undergo rigorous third-party testing for purity, potency, and contaminants including heavy metals, pesticides, and microbials.'
        },
        {
          q: 'Can children consume DIRTEA products?',
          a: 'Our products are formulated for adults. Please consult with a pediatrician before giving any functional mushroom products to children.'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <HeaderNavBar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, and more.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search frequently asked questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-black"
          />
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-black mb-6">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`${categoryIndex}-${index}`}
                    className="border border-gray-200 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold text-black hover:text-gray-700">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 leading-relaxed pt-2">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all categories above.</p>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-black mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to help you with any questions not covered above.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="mailto:hello@dirtea.com"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
