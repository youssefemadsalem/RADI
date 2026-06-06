import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Checkout {
  




private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/orders/create';

  /**
   * Compiles textual data and files into a multipart/form-data payload
   */
  placeOrder(formValues: any, cartItems: any[], subtotal: number, shipping: number, total: number, file: File | null): Observable<any> {
    const formData = new FormData();

    // Structural breakdown matching your backend parser specifications
    const customerDetails = {
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phone: formValues.phone,
      shippingAddress: {
        address: formValues.address,
        apartment: formValues.apartment,
        city: formValues.city,
        governorate: formValues.governorate,
        postalCode: formValues.postalCode
      }
    };

    formData.append('customerDetails', JSON.stringify(customerDetails));
    formData.append('items', JSON.stringify(cartItems));
    formData.append('subtotal', subtotal.toString());
    formData.append('shippingCost', shipping.toString());
    formData.append('total', total.toString());
    formData.append('paymentMethod', formValues.paymentMethod);

    // Append the verification receipt image file if Instapay is selected
    if (formValues.paymentMethod === 'INSTAPAY' && file) {
      formData.append('screenshot', file);
    }

    return this.http.post<any>(this.apiUrl, formData);
  }











}
