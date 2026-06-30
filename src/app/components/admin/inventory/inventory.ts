import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { InventoryMetrics, InventoryProduct, InventoryService } from '../../../core/service/inventory.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule,RouterLink],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  private inventoryService = inject(InventoryService);

  // Core visual data stream state nodes
  metrics = signal<InventoryMetrics | null>(null);
  products = signal<InventoryProduct[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadInventoryData();
  }

  loadInventoryData(): void {
    this.isLoading.set(true);
    this.inventoryService.getInventoryDashboard().subscribe({
      next: (res) => {
        this.metrics.set(res.summaryMetrics);
        this.products.set(res.products);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Inventory data hydration failed:', err);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * 🌟 FIXED CODE: Dynamically processes incoming asset string identifiers.
   * If it contains inline base64 seed strings, returns it directly.
   * Otherwise, treats it as a static asset file path from multer storage uploads.
   */
  resolveProductImage(imageStr: string): string {
    if (!imageStr) return '';
    
    if (imageStr.startsWith('data:image/')) {
      return imageStr;
    }
    
    return `http://localhost:5000/${imageStr}`;
  }
}