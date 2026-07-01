import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  private http = inject(HttpClient);
  
  // tracking the state of our orders array
  public orders = signal<any[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.http.get<any>('http://localhost:5000/api/orders').subscribe({
      next: (response) => {
        this.orders.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('error loading orders from backend:', err);
        this.isLoading.set(false);
      }
    });
  }

  // this fires whenever the admin changes the select dropdown value in the table
  updateOrderStatus(orderId: string, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;

    this.http.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }).subscribe({
      next: () => {
        // updates the local signal array so the ui reflects the change without needing a full page reload
        const currentOrders = this.orders();
        const updatedOrders = currentOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        this.orders.set(updatedOrders);
      },
      error: (err) => {
        console.error('failed to update status', err);
        alert('there was an error updating the order status.');
      }
    });
  }
}