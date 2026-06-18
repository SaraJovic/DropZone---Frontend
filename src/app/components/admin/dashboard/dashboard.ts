import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order';
import { Order } from '../../../models';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  orders: Order[] = [];
  totalRevenue = 0;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.totalRevenue = data.reduce((sum: number, order: Order) => sum + order.totalPrice, 0);
      }
    });
  }

  handleStatusChange(orderId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement && selectElement.value) {
      this.updateStatus(orderId, selectElement.value);
    }
  }

  updateStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.loadOrders();
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