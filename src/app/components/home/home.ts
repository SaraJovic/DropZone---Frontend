import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { Product } from '../../models';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts(0, 3).subscribe({
      next: (page) => {
        this.featuredProducts = page.content;
      },
      error: () => {}
    });
  }

  getPrimaryImage(product: Product): string {
    const primary = product.images?.find(img => img.isPrimary);
    return primary?.imageUrl || 'https://placehold.co/400x500/0D0D0D/CCFF00?text=DROP';
  }
}