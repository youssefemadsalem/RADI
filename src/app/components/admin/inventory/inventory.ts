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
  
  productToDelete = signal<string | null>(null);
  isDeleting = signal<boolean>(false);

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
    return `https://radi-backend.vercel.app/${imageStr}`;
  }

  // Modern modal delete logic
  openDeleteModal(productId: string): void {
    this.productToDelete.set(productId);
  }

  closeDeleteModal(): void {
    if (this.isDeleting()) return;
    this.productToDelete.set(null);
  }

  confirmDelete(): void {
    const productId = this.productToDelete();
    if (!productId) return;

    this.isDeleting.set(true);
    this.inventoryService.deleteProduct(productId).subscribe({
      next: () => {
        const updatedList = this.products().filter(p => p.id !== productId);
        this.products.set(updatedList);
        this.loadInventoryData();
        this.isDeleting.set(false);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('failed to delete product', err);
        alert('there was an error deleting the product.');
        this.isDeleting.set(false);
        this.closeDeleteModal();
      }
    });
  }
}