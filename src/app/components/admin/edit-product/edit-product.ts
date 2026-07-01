// inside edit-product.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/service/product'; 
import { InventoryService } from '../../../core/service/inventory.service'; 

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private inventoryService = inject(InventoryService);

  editForm!: FormGroup;
  productId: string = '';
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, Validators.required],
      initialInventory: [0, Validators.required],
      sku: ['', Validators.required],
      productType: [''],
      categoryTag: ['none'],
      // i added the new form controls here to hold the dimensions
      height: [''],
      width: [''],
      materials: [''] 
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        this.loadProductData(id);
      }
    });
  }

  loadProductData(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.editForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          initialInventory: product.currentInventory,
          sku: product.sku,
          productType: product.productType,
          categoryTag: product.categoryTag,
          
          // binding the database values to the form inputs. if materials is an array, i join it with a comma for the text input
          height: product.height || '',
          width: product.width || '',
          materials: product.materials ? product.materials.join(', ') : ''
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('error loading product data', err);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    
    this.inventoryService.updateProduct(this.productId, this.editForm.value).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/inventory']);
      },
      error: (err) => {
        console.error('error saving product', err);
        this.isSubmitting.set(false);
        alert('failed to update product');
      }
    });
  }
}