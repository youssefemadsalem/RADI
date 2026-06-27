import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/service/'; // Adjust your relative path here
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
export class Overview implements OnInit {
  private dashboardService = inject(DashboardService);

  // Structural Branding Icon Templates
  readonly revenueIcon = LucideDollarSign;
  readonly ordersIcon = LucideShoppingBag;
  readonly customersIcon = LucideUsers;
  readonly trendIcon = LucideTrendingUp;
  readonly arrowRight = LucideArrowRight;

  // Modern UI Signals
  metrics = signal<any[]>([]);
  recentOrders = signal<any[]>([]);

  ngOnInit(): void {
    this.loadDashboardAnalytics();
  }

  private loadDashboardAnalytics(): void {
    this.dashboardService.getOverviewMetrics().subscribe({
      next: (response) => {
        // Hydrate visual matrices using actual backend trends calculations
        this.metrics.set([
          { 
            title: 'Total Revenue', 
            value: response.metrics.revenue, 
            change: response.metrics.revenueChange, 
            context: 'vs last 30 days', 
            icon: this.revenueIcon 
          },
          { 
            title: 'Total Orders', 
            value: response.metrics.orders, 
            change: response.metrics.ordersChange, 
            context: 'fulfillment rate', 
            icon: this.ordersIcon 
          },
          { 
            title: 'New Customers', 
            value: response.metrics.customers, 
            change: response.metrics.customersChange, 
            context: 'organic signups', 
            icon: this.customersIcon 
          }
        ]);

        this.recentOrders.set(response.recentOrders);
      },
      error: (err) => {
        console.error('Data pipeline decoupling error:', err);
      }
    });
  }
}