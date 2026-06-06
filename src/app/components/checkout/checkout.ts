// checkout.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../../core/service/cart';
import { Checkout as CheckoutService } from '../../core/service/checkout'; 

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
      // Regex correctly locks prefixes to 010, 011, 012, and 015 followed by 8 trailing digits
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
    return this.cartService.subtotal() + this.shippingCost;
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

  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) return;
    this.screenshotFile = file;
    this.checkoutForm.get('screenshotRequired')?.setValue(file.name);

    const reader = new FileReader();
    reader.onload = () => this.screenshotPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid || this.cartService.items().length === 0) {
      this.checkoutForm.markAllAsTouched(); // Force all errors to show red simultaneously
      return;
    }

    this.isSubmitting.set(true);

    this.checkoutService.placeOrder(
      this.checkoutForm.value,
      this.cartService.items(),
      this.cartService.subtotal(),
      this.shippingCost,
      this.finalTotal,
      this.screenshotFile
    ).subscribe({
      next: (response) => {
        this.cartService.items.set([]); 
        this.isSubmitting.set(false);
        this.router.navigate(['/order-success'], { queryParams: { code: response.orderCode } });
      },
      error: (err) => {
        console.error('Order submission fault:', err);
        this.isSubmitting.set(false);
        alert('Failed processing your purchase order.');
      }
    });
  }
}