import { jsPDF } from 'jspdf';

interface InvoiceItem {
  product_name: string;
  quantity: number;
  product_price: number;
}

interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    country: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  isSubscription?: boolean;
  subscriptionFrequency?: string;
}

export const generateInvoice = (data: InvoiceData): void => {
  const doc = new jsPDF();

  // Set up colors
  const primaryColor = '#000000';
  const secondaryColor = '#6b7280';
  const accentColor = '#f97316'; // Orange accent

  // Company Header
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('NASTEA', 20, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Matcha Tea', 20, 32);

  // Invoice Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 150, 25);

  // Subscription Badge (if applicable)
  if (data.isSubscription) {
    doc.setFillColor(243, 232, 255); // Purple background
    doc.roundedRect(148, 10, 42, 8, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(126, 34, 206); // Purple text
    doc.setFont('helvetica', 'bold');
    doc.text('SUBSCRIPTION', 169, 15, { align: 'center' });
  }

  // Order Number and Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Order: #${data.orderNumber}`, 150, 32);
  doc.text(`Date: ${new Date(data.orderDate).toLocaleDateString('en-IN')}`, 150, 37);

  // Subscription Frequency (if applicable)
  if (data.isSubscription && data.subscriptionFrequency) {
    doc.setTextColor(126, 34, 206);
    doc.setFontSize(9);
    const frequencyText = data.subscriptionFrequency.charAt(0).toUpperCase() + data.subscriptionFrequency.slice(1);
    doc.text(`Frequency: ${frequencyText}`, 150, 42);
    doc.text('Saves 20% on every order', 150, 47);
    doc.setTextColor(0, 0, 0);
  }

  // Customer Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.customerName, 20, 62);
  doc.text(data.customerEmail, 20, 68);

  // Shipping Address
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ship To:', 110, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`, 110, 62);
  doc.text(data.shippingAddress.address, 110, 68);
  doc.text(`${data.shippingAddress.city}, ${data.shippingAddress.postalCode}`, 110, 74);
  doc.text(data.shippingAddress.country, 110, 80);
  doc.text(`Phone: ${data.shippingAddress.phone}`, 110, 86);

  // Table Header
  const tableTop = 100;
  doc.setFillColor(243, 244, 246);
  doc.rect(20, tableTop, 170, 10, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Product', 25, tableTop + 7);
  doc.text('Qty', 120, tableTop + 7);
  doc.text('Price', 145, tableTop + 7);
  doc.text('Total', 175, tableTop + 7);

  // Table Items
  let yPosition = tableTop + 15;
  doc.setFont('helvetica', 'normal');

  data.items.forEach((item, index) => {
    const itemTotal = item.product_price * item.quantity;

    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, yPosition - 5, 170, 10, 'F');
    }

    doc.text(item.product_name, 25, yPosition);
    doc.text(item.quantity.toString(), 125, yPosition);
    doc.text(`₹${item.product_price.toFixed(2)}`, 145, yPosition);
    doc.text(`₹${itemTotal.toFixed(2)}`, 170, yPosition);

    yPosition += 10;
  });

  // Separator line
  yPosition += 5;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 10;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 145, yPosition);
  doc.text(`₹${data.subtotal.toFixed(2)}`, 170, yPosition);
  yPosition += 8;

  // Shipping
  doc.text('Shipping:', 145, yPosition);
  doc.text(`₹${data.shippingCost.toFixed(2)}`, 170, yPosition);
  yPosition += 10;

  // Total - Bold and larger
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(140, yPosition - 3, 190, yPosition - 3);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 145, yPosition + 5);
  doc.text(`₹${data.totalAmount.toFixed(2)}`, 165, yPosition + 5);

  // Footer
  const footerY = 270;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, footerY, 190, footerY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Thank you for your business!', 105, footerY + 7, { align: 'center' });
  doc.text('NASTEA - Premium Matcha Tea', 105, footerY + 12, { align: 'center' });
  doc.text('For questions, contact us at: jagadish.bondada@gmail.com', 105, footerY + 17, { align: 'center' });

  // Save PDF
  doc.save(`NASTEA-Invoice-${data.orderNumber}.pdf`);
};
