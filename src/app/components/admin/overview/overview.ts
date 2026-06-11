import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideDynamicIcon, 
  LucideDollarSign, 
  LucideShoppingBag, 
  LucideUsers, 
  LucideTrendingUp,
  LucideArrowRight
} from '@lucide/angular';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: './overview.html'
})
export class Overview {
  // Lucide Icons
  readonly revenueIcon = LucideDollarSign;
  readonly ordersIcon = LucideShoppingBag;
  readonly customersIcon = LucideUsers;
  readonly trendIcon = LucideTrendingUp;
  readonly arrowRight = LucideArrowRight;

  // Mock Analytical Matrix Data matching your high-fidelity screenshot
  metrics = signal([
    { title: 'Total Revenue', value: '$284,902.00', change: '+12.5%', context: 'vs last month', icon: this.revenueIcon },
    { title: 'Total Orders', value: '1,204', change: '+5.2%', context: 'fulfillment rate', icon: this.ordersIcon },
    { title: 'New Customers', value: '482', change: '+24.0%', context: 'organic growth', icon: this.customersIcon }
  ]);

  recentOrders = signal([
    { id: '#RD-9021', date: 'Oct 24, 2026', customer: 'Julianne Moore', amount: '$1,240.00', status: 'SHIPPED', statusClass: 'bg-black text-white' },
    { id: '#RD-9022', date: 'Oct 24, 2026', customer: 'Marcus Aurelius', amount: '$890.00', status: 'PROCESSING', statusClass: 'border border-black text-black' },
    { id: '#RD-9023', date: 'Oct 23, 2026', customer: 'Sienna Miller', amount: '$2,400.00', status: 'DELIVERED', statusClass: 'bg-neutral-100 text-neutral-400' },
    { id: '#RD-9024', date: 'Oct 23, 2026', customer: 'Tom Hardy', amount: '$450.00', status: 'SHIPPED', statusClass: 'bg-black text-white' }
  ]);
}