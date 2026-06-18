import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';
import { Product, Category } from '../../models';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory: number | null = null;
  currentPage = 0;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getAllProducts(this.currentPage).subscribe({
      next: (data) => {
        this.products = data.content;
        this.totalPages = data.totalPages;
        this.cdr.markForCheck();
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.markForCheck();
      }
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (data) => {
          this.products = data;
          this.totalPages = 0;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.loadProducts();
    }
  }

  onCategoryChange(): void {
    if (this.selectedCategory) {
      this.productService.getProductsByCategory(this.selectedCategory).subscribe({
        next: (data) => {
          this.products = data;
          this.totalPages = 0;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}