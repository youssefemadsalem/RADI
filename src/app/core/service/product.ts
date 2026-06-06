import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/products';

  getProducts(filterType?: string): Observable<any[]> {
    const url = filterType ? `${this.apiUrl}?filterType=${filterType}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
