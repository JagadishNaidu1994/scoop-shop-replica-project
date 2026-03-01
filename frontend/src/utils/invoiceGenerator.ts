import { jsPDF } from 'jspdf';

interface InvoiceItem {
  product_name: string;
  description?: string;
  quantity: number;
  product_price: number;
  tax_percent?: number;
}

interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  orderDate: string;
  paymentMethod?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    phone: string;
    country: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  totalTax: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  isSubscription?: boolean;
  subscriptionFrequency?: string;
  notes?: string;
}

// Company info (could be fetched from admin settings)
const COMPANY = {
  name: 'NASTEA',
  tagline: 'Premium Matcha Tea',
  address: 'Hyderabad, Telangana',
  country: 'India',
  postalCode: '500001',
  email: 'hello@nastea.in',
  website: 'www.nastea.in',
};

const COLORS = {
  purple: [88, 28, 135] as [number, number, number],       // #581C87
  purpleLight: [243, 232, 255] as [number, number, number], // #F3E8FF
  white: [255, 255, 255] as [number, number, number],
  black: [0, 0, 0] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],
  grayLight: [243, 244, 246] as [number, number, number],
  grayBorder: [229, 231, 235] as [number, number, number],
};

export const generateInvoiceNumber = (orderNumber: string): string => {
  const year = new Date().getFullYear();
  const seq = orderNumber.replace(/\D/g, '').slice(-5).padStart(5, '0');
  return `INV-${year}-${seq}`;
};

export const generateInvoice = (data: InvoiceData): void => {
  const doc = new jsPDF();
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // ===== A) HEADER SECTION – Purple Background =====
  doc.setFillColor(...COLORS.purple);
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Left: Company name + INVOICE title
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY.name, margin, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('INVOICE', margin, 26);

  // Subscription badge
  if (data.isSubscription) {
    doc.setFillColor(...COLORS.purpleLight);
    doc.roundedRect(margin, 30, 38, 7, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.purple);
    doc.setFont('helvetica', 'bold');
    doc.text('SUBSCRIPTION', margin + 19, 35, { align: 'center' });
    doc.setTextColor(...COLORS.white);
  }

  // Right: Company address
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const rightX = pageWidth - margin;
  doc.text(COMPANY.name, rightX, 14, { align: 'right' });
  doc.text(COMPANY.address, rightX, 20, { align: 'right' });
  doc.text(COMPANY.country, rightX, 26, { align: 'right' });
  doc.text(`Postal Code: ${COMPANY.postalCode}`, rightX, 32, { align: 'right' });
  doc.text(COMPANY.email, rightX, 38, { align: 'right' });

  // ===== B) BILLING SECTION =====
  let y = 54;

  // Left: Bill To
  doc.setTextColor(...COLORS.purple);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', margin, y);

  doc.setTextColor(...COLORS.black);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  y += 6;
  doc.text(data.customerName, margin, y);
  y += 5;
  doc.text(data.shippingAddress.address, margin, y);
  if (data.shippingAddress.addressLine2) {
    y += 5;
    doc.text(data.shippingAddress.addressLine2, margin, y);
  }
  y += 5;
  const cityLine = [data.shippingAddress.city, data.shippingAddress.state].filter(Boolean).join(', ');
  doc.text(cityLine, margin, y);
  y += 5;
  doc.text(`${data.shippingAddress.country} - ${data.shippingAddress.postalCode}`, margin, y);
  y += 5;
  doc.text(`Phone: ${data.shippingAddress.phone}`, margin, y);
  y += 5;
  doc.text(data.customerEmail, margin, y);

  // Right: Invoice details
  const detailX = 120;
  let detailY = 54;

  const addDetailRow = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLORS.gray);
    doc.setFontSize(8);
    doc.text(label, detailX, detailY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLORS.black);
    doc.setFontSize(9);
    doc.text(value, detailX + 40, detailY);
    detailY += 6;
  };

  addDetailRow('Invoice No:', data.invoiceNumber);
  addDetailRow('Order ID:', `#${data.orderNumber}`);
  addDetailRow('Order Date:', new Date(data.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  addDetailRow('Payment:', data.paymentMethod || 'Online');
  addDetailRow('Due Date:', new Date(data.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));

  if (data.isSubscription && data.subscriptionFrequency) {
    addDetailRow('Frequency:', data.subscriptionFrequency.charAt(0).toUpperCase() + data.subscriptionFrequency.slice(1));
  }

  // ===== C) ITEMS TABLE =====
  y = Math.max(y, detailY) + 12;

  // Table header
  doc.setFillColor(...COLORS.purple);
  doc.rect(margin, y, contentWidth, 9, 'F');

  doc.setTextColor(...COLORS.white);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  const cols = {
    item: margin + 3,
    desc: margin + 55,
    qty: margin + 105,
    price: margin + 120,
    tax: margin + 143,
    total: margin + 160,
  };

  doc.text('ITEM', cols.item, y + 6);
  doc.text('DESCRIPTION', cols.desc, y + 6);
  doc.text('QTY', cols.qty, y + 6);
  doc.text('PRICE', cols.price, y + 6);
  doc.text('TAX %', cols.tax, y + 6);
  doc.text('TOTAL', cols.total, y + 6);

  y += 12;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  data.items.forEach((item, index) => {
    const lineTotal = item.product_price * item.quantity;
    const taxAmt = item.tax_percent ? (lineTotal * item.tax_percent) / 100 : 0;

    if (index % 2 === 0) {
      doc.setFillColor(...COLORS.grayLight);
      doc.rect(margin, y - 4, contentWidth, 8, 'F');
    }

    doc.setTextColor(...COLORS.black);

    // Truncate long names
    const itemName = item.product_name.length > 28
      ? item.product_name.substring(0, 26) + '...'
      : item.product_name;

    doc.text(itemName, cols.item, y);
    doc.text(item.description ? item.description.substring(0, 22) : '-', cols.desc, y);
    doc.text(item.quantity.toString(), cols.qty, y);
    doc.text(`₹${item.product_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, cols.price, y);
    doc.text(item.tax_percent ? `${item.tax_percent}%` : '0%', cols.tax, y);
    doc.text(`₹${(lineTotal + taxAmt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, cols.total, y);

    y += 8;
  });

  // Table bottom border
  doc.setDrawColor(...COLORS.grayBorder);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);

  // ===== D) NOTES SECTION (Bottom Left) =====
  y += 10;
  const notesY = y;

  doc.setTextColor(...COLORS.purple);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTES', margin, y);

  doc.setTextColor(...COLORS.gray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  y += 6;
  const noteText = data.notes || 'Thank you for choosing NASTEA! Your order is being prepared with care.';
  const noteLines = doc.splitTextToSize(noteText, 80);
  doc.text(noteLines, margin, y);

  // ===== E) TOTALS SECTION (Bottom Right – Purple Box) =====
  const totalsX = 120;
  let totalsY = notesY - 2;

  // Purple background box
  const boxHeight = data.discount > 0 ? 48 : 42;
  doc.setFillColor(...COLORS.purpleLight);
  doc.roundedRect(totalsX - 3, totalsY - 4, 78, boxHeight, 3, 3, 'F');

  const addTotalRow = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(bold ? COLORS.purple[0] : COLORS.gray[0], bold ? COLORS.purple[1] : COLORS.gray[1], bold ? COLORS.purple[2] : COLORS.gray[2]);
    doc.setFontSize(bold ? 10 : 9);
    doc.text(label, totalsX, totalsY);
    doc.text(value, pageWidth - margin, totalsY, { align: 'right' });
    totalsY += bold ? 8 : 6;
  };

  addTotalRow('Subtotal', `₹${data.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  addTotalRow('Tax', `₹${data.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  addTotalRow('Shipping', `₹${data.shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  if (data.discount > 0) {
    addTotalRow('Discount', `-₹${data.discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`);
  }

  // Separator line before grand total
  doc.setDrawColor(...COLORS.purple);
  doc.setLineWidth(0.5);
  doc.line(totalsX, totalsY - 2, pageWidth - margin, totalsY - 2);
  totalsY += 2;

  addTotalRow('GRAND TOTAL', `₹${data.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, true);

  // ===== FOOTER =====
  const footerY = 272;
  doc.setDrawColor(...COLORS.grayBorder);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.gray);
  doc.text('Thank you for your business!', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.text(`${COMPANY.name} — ${COMPANY.tagline} | ${COMPANY.email}`, pageWidth / 2, footerY + 10, { align: 'center' });
  doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, footerY + 15, { align: 'center' });

  // Save PDF
  doc.save(`${data.invoiceNumber}.pdf`);
};
