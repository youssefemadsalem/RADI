import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../../../core/service/inventory.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {
  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  // Form Fields Primitives State Bindings
  name = signal<string>('');
  description = signal<string>('');
  price = signal<number | null>(null);
  initialInventory = signal<number | null>(null);
  sku = signal<string>('');
  productType = signal<string>('Outerwear'); 
  categoryTag = signal<string>('none');
  isPubliclyVisible = signal<boolean>(false);

  // Luxury Editorial Attribute Arrays Defaults
  selectedColors = signal<string[]>(['#000000', '#FFFFFF', '#333333', '#E5E0D8']);
  selectedMaterials = signal<string[]>(['VIRGIN WOOL', 'CASHMERE BLEND', 'SILK LINING']);
  selectedSizes = signal<string[]>(['S', 'M', 'L', 'XL']);

  // Native Binary Buffers alongside Base64 representation vectors
  uploadedFiles = signal<File[]>([]);
  previewImageUrls = signal<string[]>([]);

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      if (this.uploadedFiles().length >= 5) break; // Capped out at max template slots available
      
      const file = files.item(i);
      if (file) {
        this.uploadedFiles.update(curr => [...curr, file]);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImageUrls.update(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImageSlot(index: number): void {
    this.uploadedFiles.update(files => files.filter((_, i) => i !== index));
    this.previewImageUrls.update(previews => previews.filter((_, i) => i !== index));
  }

  toggleVisibility(): void {
    this.isPubliclyVisible.update(val => !val);
  }

  onSaveDraft(): void {
    console.log('Draft structural serialization cached local cache block context');
  }

  onSubmitProduct(): void {
    if (!this.name() || !this.sku() || !this.price() || !this.initialInventory()) {
      alert('Validation constraint mapping incomplete. Please populate required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name());
    formData.append('description', this.description());
    formData.append('price', String(this.price()));
    formData.append('initialInventory', String(this.initialInventory()));
    formData.append('sku', this.sku());
    formData.append('productType', this.productType());
    formData.append('categoryTag', this.categoryTag());
    formData.append('isPubliclyVisible', String(this.isPubliclyVisible()));

    // Marshal structural array lists cleanly over the multipart boundaries
    formData.append('materials', JSON.stringify(this.selectedMaterials()));
    formData.append('colors', JSON.stringify(this.selectedColors()));
    formData.append('sizes', JSON.stringify(this.selectedSizes()));

    // Append standard file blobs explicitly maps directly to req.files array
    this.uploadedFiles().forEach((file) => {
      formData.append('images', file, file.name);
    });

    this.inventoryService.createNewProduct(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/inventory']);
        }
      },
      error: (err) => {
        console.error('Multipart asset record pipeline ingestion mapping failed:', err);
      }
    });
  }
}