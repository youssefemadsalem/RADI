import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-page.html'
})
export class InfoPage {
  private route = inject(ActivatedRoute);
  
  pageContent: { title: string, subtitle: string, content: string[] } = { title: '', subtitle: '', content: [] };

  constructor() {
    this.route.url.subscribe(segments => {
      const path = segments[0]?.path || '';
      this.pageContent = this.getContentForPath(path);
    });
  }

  getContentForPath(path: string) {
    const data: Record<string, { title: string, subtitle: string, content: string[] }> = {
      'about': {
        title: 'About RADI',
        subtitle: 'Our philosophy and archive.',
        content: [
          'RADI was founded on the principle of structural permanence. We believe in creating silhouettes that transcend seasonal trends, focusing on architectural construction and premium materials.',
          'Each piece is conceptualized in our atelier and meticulously handcrafted. We treat our garments as artifacts for the modern archive—designed to be worn, aged, and preserved.'
        ]
      },
      'collections': {
        title: 'Collections',
        subtitle: 'Explore our archives.',
        content: [
          'Our collections are not defined by seasons, but by volumes. Volume 01 introduced our core structural language, focusing on heavyweight cottons and rigid denims.',
          'Future volumes will continue to expand on this foundation, introducing new textures and technical fabrics while maintaining our uncompromising commitment to silhouette and form.'
        ]
      },
      'privacy-policy': {
        title: 'Privacy Policy',
        subtitle: 'How we handle your data.',
        content: [
          'At RADI, we respect your privacy. The information you provide—including your name, address, and payment details—is securely encrypted and used solely for fulfilling your orders and enhancing your experience with our archive.',
          'We do not sell your personal data to third parties. If you have subscribed to our newsletter, you may opt out at any time through the link provided in our communications.'
        ]
      },
      'terms-and-conditions': {
        title: 'Terms & Conditions',
        subtitle: 'Legal agreements and usage.',
        content: [
          'By accessing or using the RADI platform, you agree to be bound by our terms. All designs, imagery, and text on this site are the exclusive property of RADI.',
          'Prices are subject to change without notice. We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion.'
        ]
      },
      'faq': {
        title: 'Frequently Asked Questions',
        subtitle: 'Answers to common inquiries.',
        content: [
          'Q: Where are RADI products manufactured?',
          'A: Our garments are conceptualized and handcrafted by our specialized manufacturing partners, ensuring rigorous quality control at every step.',
          'Q: Do you restock sold-out items?',
          'A: Many of our pieces are produced in limited quantities to maintain exclusivity. However, core silhouettes may be restocked periodically.'
        ]
      },
      'returns-exchanges': {
        title: 'Returns & Exchanges',
        subtitle: 'Our return policy.',
        content: [
          'We accept returns and exchanges within 14 days of delivery. Items must be returned in their original, unworn condition with all tags attached.',
          'Please note that return shipping costs are the responsibility of the customer. Once your return is received and inspected, we will process your refund to the original payment method.'
        ]
      },
      'customer-care': {
        title: 'Customer Care',
        subtitle: 'We are here to help.',
        content: [
          'For any inquiries regarding your order, sizing advice, or general questions, our customer care team is available to assist you.',
          'Please reach out to us via email at support@radi-archive.com. We strive to respond to all inquiries within 24-48 business hours.'
        ]
      }
    };

    return data[path] || { title: 'Not Found', subtitle: 'Page not found.', content: ['The page you are looking for does not exist.'] };
  }
}
