import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { InventoryMetrics, InventoryProduct, InventoryService } from '../../../core/service/inventory.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, RouterLink],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  private inventoryService = inject(InventoryService);

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

  resolveProductImage(imageStr: string): string {
    if (!imageStr) return '';
    if (imageStr.startsWith('data:image/')) return imageStr;
    return `http://localhost:5000/${imageStr}`;
  }

  // i added this function to handle when the admin clicks delete. 
  // it asks for confirmation first so they dont accidentally delete things.
  onDeleteProduct(productId: string): void {
    if (confirm('are you sure you want to permanently delete this product?')) {
      this.inventoryService.deleteProduct(productId).subscribe({
        next: () => {
          // i filter out the deleted product from the signal so it disappears from the table immediately
          const updatedList = this.products().filter(p => p.id !== productId);
          this.products.set(updatedList);
          // you might also want to call this.loadInventoryData() here to refresh the metrics at the top
          this.loadInventoryData();
        },
        error: (err) => {
          console.error('failed to delete product', err);
          alert('there was an error deleting the product.');
        }
      });
    }
  }
}