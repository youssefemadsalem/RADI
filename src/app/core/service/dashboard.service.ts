import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardPayload {
  metrics: {
    revenue: string;
    revenueChange: string;
    orders: string;
    ordersChange: string;
    customers: string;
    customersChange: string;
  };
  recentOrders: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://radi-backend.vercel.app/api/admin/overview';

  getOverviewMetrics(): Observable<DashboardPayload> {
    return this.http.get<DashboardPayload>(this.apiUrl);
  }
}