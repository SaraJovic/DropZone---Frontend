import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
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

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.orderService.getOrdersByUser(user.id).subscribe({
        next: (data) => {
          this.orders = data;
        }
      });
    }
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        this.successMessage = 'Order cancelled successfully!';
        this.loadOrders();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to cancel order';
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