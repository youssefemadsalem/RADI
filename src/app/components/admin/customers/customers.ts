import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideDynamicIcon, 
  LucideUsers, 
  LucideUserPlus, 
  LucideTrendingUp, 
  LucidePercent,
  LucideMoreVertical,
  LucideSearch,
  LucideSlidersHorizontal,
  LucideDownload
} from '@lucide/angular';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: './customers.html'
})
export class Customers {
  // Lucide Icons
  readonly totalCustomersIcon = LucideUsers;
  readonly newCustomersIcon = LucideUserPlus;
  readonly vipIcon = LucideTrendingUp;
  readonly engagementIcon = LucidePercent;
  readonly optionsIcon = LucideMoreVertical;
  readonly searchIcon = LucideSearch;
  readonly filterIcon = LucideSlidersHorizontal;
  readonly downloadIcon = LucideDownload;

  // Analytical Upper Row Metrics
  customerStats = signal([
    { title: 'Total Customers', value: '12,482', change: '+12%', icon: this.totalCustomersIcon, isTrendPositive: true },
    { title: 'New This Month', value: '842', change: '+5.4%', icon: this.newCustomersIcon, isTrendPositive: true },
    { title: 'VIP Members', value: '312', change: 'Core', icon: this.vipIcon, isTrendPositive: false },
    { title: 'Engagement Rate', value: '64.8%', change: 'Avg.', icon: this.engagementIcon, isTrendPositive: false }
  ]);

  // Client Rows Data matching the high-fashion grid archive layout
  clientsList = signal([
    { name: 'Julian Voss', email: 'j.voss@atelier.com', history: '14 Orders', spend: '€12,450.00', status: 'ACTIVE', statusClass: 'bg-black text-white' },
    { name: 'Elena Moretti', email: 'elena.m@vogue.it', history: '42 Orders', spend: '€48,920.00', status: 'ACTIVE', statusClass: 'bg-black text-white' },
    { name: 'Marcus Thorne', email: 'm.thorne@luxury.com', history: '0 Orders', spend: '€0.00', status: 'INACTIVE', statusClass: 'border border-neutral-300 text-neutral-400' },
    { name: 'Sasha Chen', email: 'sasha@shanghai.design', history: '8 Orders', spend: '€6,120.00', status: 'ACTIVE', statusClass: 'bg-black text-white' }
  ]);
}