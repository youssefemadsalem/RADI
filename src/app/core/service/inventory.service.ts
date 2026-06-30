import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InventoryMetrics {
  totalStock: number;
  outOfStock: number;
  totalCategories: number;
  newThisMonth: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'AVAILABLE' | 'LOW STOCK' | 'SOLD OUT';
  image: string | null;
}

export interface InventoryResponse {
  summaryMetrics: InventoryMetrics;
  products: InventoryProduct[];
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/products';

  // Fetch metrics and product list for your main panel grid (View 1)
  getInventoryDashboard(): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>(`${this.apiUrl}/inventory`);
  }

  // Submit form payload data as multipart/form-data for image uploads (View 2)
  createNewProduct(formData: FormData): Observable<{ success: boolean; productId: string }> {
    return this.http.post<{ success: boolean; productId: string }>(`${this.apiUrl}/create-new`, formData);
  }
}