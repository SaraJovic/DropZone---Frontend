import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';
import { CategoryService } from '../../../services/category';
import { Product, Category, NewProduct } from '../../../models';

@Component({
  selector: 'app-product-management',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css'
})
export class ProductManagementComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];
  successMessage = '';
  errorMessage = '';

  newProduct: NewProduct = {
    name: '',
    description: '',
    price: 0,
    categoryId: null
  };

  editingProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.content;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      }
    });
  }

  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.successMessage = 'Product created successfully!';
        this.errorMessage = '';
        this.newProduct = { name: '', description: '', price: 0, categoryId: null };
        this.loadProducts();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to create product';
      }
    });
  }

  startEdit(product: Product): void {
    this.editingProduct = { ...product };
  }

  updateProduct(): void {
    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, this.editingProduct).subscribe({
        next: () => {
          this.successMessage = 'Product updated successfully!';
          this.editingProduct = null;
          this.loadProducts();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update product';
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.successMessage = 'Product deleted successfully!';
          this.loadProducts();
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }
}