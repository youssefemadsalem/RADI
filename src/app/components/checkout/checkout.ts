import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../../core/service/cart';
import { Checkout as CheckoutService } from '../../core/service/checkout'; 
import { Tag, X } from 'lucide-angular'; // Add icons if you use them

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private checkoutService = inject(CheckoutService); 
  public cartService = inject(Cart);

  checkoutForm!: FormGroup;
  screenshotFile: File | null = null;
  screenshotPreview = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);
  shippingCost = 100;

  
  couponInput = '';
  appliedCoupon = signal<string | null>(null);
  discountAmount = signal<number>(0);
  couponError = signal<string | null>(null);

  ngOnInit(): void {
    this.initCheckoutForm();
  }

  private initCheckoutForm(): void {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      emailMarketing: [true],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      apartment: [''],
      city: ['', Validators.required],
      governorate: ['Cairo', Validators.required],
      postalCode: [''],
      phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      saveInfo: [false],
      paymentMethod: ['COD', Validators.required],
      billingAddressSame: [true]
    });

    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      if (method === 'INSTAPAY') {
        this.checkoutForm.addControl('screenshotRequired', this.fb.control('', Validators.required));
      } else {
        this.checkoutForm.removeControl('screenshotRequired');
        this.screenshotFile = null;
        this.screenshotPreview.set(null);
      }
    });
  }

  get finalTotal(): number {
    const total = this.cartService.subtotal() - this.discountAmount() + this.shippingCost;
    return Math.max(0, total); // Prevents negative totals
  }

  applyCoupon(): void {
    const code = this.couponInput.trim().toUpperCase();
    this.couponError.set(null);

    if (!code) return;

    if (code === 'RADI10') {
      const discount = this.cartService.subtotal() * 0.10; // 10% off
      this.appliedCoupon.set(code);
      this.discountAmount.set(discount);
      this.couponInput = ''; // clear input
    } else if (code === 'FREESHIP') {
      this.appliedCoupon.set(code);
      this.discountAmount.set(this.shippingCost);
      this.couponInput = '';
    } else {
      this.couponError.set('Enter a valid discount code');
    }
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
    this.discountAmount.set(0);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) this.processFile(input.files[0]);
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private async processFile(file: File): Promise<void> {
    if (!file.type.startsWith('image/')) return;
    
    try {
      const compressedFile = await this.compressImage(file);
      this.screenshotFile = compressedFile;
      this.checkoutForm.get('screenshotRequired')?.setValue(compressedFile.name);

      const reader = new FileReader();
      reader.onload = () => this.screenshotPreview.set(reader.result as string);
      reader.readAsDataURL(compressedFile);
    } catch (e) {
      console.error('Compression failed', e);
      this.screenshotFile = file;
      this.checkoutForm.get('screenshotRequired')?.setValue(file.name);
      const reader = new FileReader();
      reader.onload = () => this.screenshotPreview.set(reader.result as string);
      reader.readAsDataURL(file);
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

  submitOrder(): void {
    if (this.checkoutForm.invalid || this.cartService.items().length === 0) {
      this.checkoutForm.markAllAsTouched(); 
      return;
    }

    this.isSubmitting.set(true);

    const orderPayload = {
      ...this.checkoutForm.value,
      couponCode: this.appliedCoupon(),
      discountAmount: this.discountAmount()
    };

    this.checkoutService.placeOrder(
      orderPayload, 
      this.cartService.items(),
      this.cartService.subtotal(),
      this.shippingCost,
      this.finalTotal,
      this.screenshotFile
    ).subscribe({
      next: (response) => {
        this.cartService.items.set([]); 
        this.isSubmitting.set(false);
        
        this.router.navigate(['/order-complete'], { 
          queryParams: { ref: response.orderCode || response.code || 'RAD-SUCCESS' } 
        });
      },
      error: (err) => {
        console.error('Order submission fault:', err);
        this.isSubmitting.set(false);
        alert('Failed processing your purchase order.');
      }
    });
  }
}