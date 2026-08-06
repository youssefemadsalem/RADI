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

  imageSlotLabels = signal<string[]>(['First Pic', 'Second Pic', 'Morning', 'Afternoon', 'Night']);


  name = signal<string>('');
  description = signal<string>('');
  price = signal<number | null>(null);
  initialInventory = signal<number | null>(null);
  sku = signal<string>('');
  productType = signal<string>('Outerwear'); 
  categoryTag = signal<string>('none');
  isPubliclyVisible = signal<boolean>(false);

  // i removed colors and sizes and added the dimension tracking signals
  height = signal<string>('');
  width = signal<string>('');
  materials = signal<string>('');

  uploadedFiles = signal<File[]>([]);
  previewImageUrls = signal<string[]>([]);

  isSubmitting = signal<boolean>(false);
  showSuccessToast = signal<boolean>(false);
  formErrors = signal<any>({});

  async onFilesSelected(event: any): Promise<void> {
    const files: FileList = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      if (this.uploadedFiles().length >= 5) break; 
      
      const file = files.item(i);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImageUrls.update(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);

        try {
          const compressedFile = await this.compressImage(file);
          this.uploadedFiles.update(curr => [...curr, compressedFile]);
        } catch (e) {
          console.error('Compression failed', e);
          this.uploadedFiles.update(curr => [...curr, file]);
        }
      }
    }
  }

  compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round(height * (maxDim / width));
              width = maxDim;
            } else {
              width = Math.round(width * (maxDim / height));
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.8);
        };
        img.onerror = error => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  }

  removeImageSlot(index: number): void {
    this.uploadedFiles.update(files => files.filter((_, i) => i !== index));
    this.previewImageUrls.update(previews => previews.filter((_, i) => i !== index));
  }

  toggleVisibility(): void {
    this.isPubliclyVisible.update(val => !val);
  }

  onSubmitProduct(): void {
    const errors: any = {};
    if (!this.name() || this.name().trim() === '') errors.name = 'Product name is required.';
    if (!this.description() || this.description().trim() === '') errors.description = 'Editorial description is required.';
    if (!this.productType()) errors.productType = 'Category is required.';
    if (!this.categoryTag()) errors.categoryTag = 'Collection tag is required.';
    
    if (this.price() === null || this.price() === undefined || this.price()! <= 0) errors.price = 'Valid retail price is required.';
    if (this.initialInventory() === null || this.initialInventory() === undefined || this.initialInventory()! < 0) errors.inventory = 'Valid initial inventory is required.';
    if (!this.sku() || this.sku().trim() === '') errors.sku = 'SKU is required.';
    
    if (!this.height() || this.height().trim() === '') errors.height = 'Height is required.';
    if (!this.width() || this.width().trim() === '') errors.width = 'Width is required.';
    if (!this.materials() || this.materials().trim() === '') errors.materials = 'Composition/Material is required.';

    if (this.uploadedFiles().length === 0) errors.images = 'At least one image is required.';

    this.formErrors.set(errors);

    if (Object.keys(errors).length > 0) {
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('name', this.name());
    formData.append('description', this.description());
    formData.append('price', String(this.price()));
    formData.append('initialInventory', String(this.initialInventory()));
    formData.append('sku', this.sku());
    formData.append('productType', this.productType());
    formData.append('categoryTag', this.categoryTag());
    formData.append('isPubliclyVisible', String(this.isPubliclyVisible()));

    // i am appending the new structural dimension fields here
    formData.append('height', this.height());
    formData.append('width', this.width());
    formData.append('materials', this.materials()); // the backend splits this string by commas

    this.uploadedFiles().forEach((file) => {
      formData.append('images', file, file.name);
    });

    this.inventoryService.createNewProduct(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.isSubmitting.set(false);
          this.showSuccessToast.set(true);
          setTimeout(() => {
            this.router.navigate(['/admin/inventory']);
          }, 1500);
        } else {
          this.isSubmitting.set(false);
          alert('Submission failed. Please check details.');
        }
      },
      error: (err) => {
        console.error('Multipart asset record pipeline ingestion mapping failed:', err);
        this.isSubmitting.set(false);
        alert('Server error occurred during upload.');
      }
    });
  }
}