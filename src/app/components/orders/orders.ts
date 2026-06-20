import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order';
import { Order } from '../../models';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrdersByUser().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load orders';
      }
    });
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        this.successMessage = 'Order cancelled successfully!';
        this.errorMessage = '';
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to cancel order';
        this.successMessage = '';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge-status bg-pending';
      case 'PROCESSING': return 'badge-status bg-processing';
      case 'SHIPPED': return 'badge-status bg-shipped';
      case 'DELIVERED': return 'badge-status bg-delivered';
      case 'CANCELLED': return 'badge-status bg-cancelled';
      default: return 'badge-status bg-secondary';
    }
  }
}