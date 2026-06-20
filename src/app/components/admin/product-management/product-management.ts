import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  isUploading = false;

  private readonly CLOUDINARY_CLOUD_NAME = 'dgzuhqhgy';
  private readonly CLOUDINARY_UPLOAD_PRESET = 'dropzone_unsigned';

  newProduct: NewProduct = {
    name: '',
    description: '',
    price: 0,
    categoryId: null,
    gender: null
  };

  readonly genderOptions = [
    { value: 'MALE',   label: 'Men' },
    { value: 'FEMALE', label: 'Women' },
    { value: 'UNISEX', label: 'Unisex' },
  ];

  newVariant = {
    productId: null as number | null,
    size: '',
    color: '',
    stockQuantity: 0
  };

  newImage = {
    productId: null as number | null,
    imageUrl: '',
    isPrimary: true
  };

  editingProduct: Product | null = null;
  expandedProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => { this.products = data.content; }
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => { this.categories = data; }
    });
  }

  createProduct(): void {
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.categoryId || !this.newProduct.gender) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.successMessage = 'Product created successfully!';
        this.errorMessage = '';
        this.newProduct = { name: '', description: '', price: 0, categoryId: null, gender: null };
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
          this.successMessage = 'Product updated!';
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
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.successMessage = 'Product deleted!';
          this.loadProducts();
        }
      });
    }
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }

  toggleExpand(productId: number): void {
    this.expandedProductId = this.expandedProductId === productId ? null : productId;
    if (this.expandedProductId) {
      this.newVariant = { productId, size: '', color: '', stockQuantity: 0 };
      this.newImage = { productId, imageUrl: '', isPrimary: true };
    }
  }

  addVariant(): void {
    if (!this.newVariant.productId || !this.newVariant.size || !this.newVariant.color) {
      this.errorMessage = 'Please fill in all variant fields';
      return;
    }
    this.productService.addVariant(this.newVariant.productId, {
      size: this.newVariant.size as any,
      color: this.newVariant.color,
      stockQuantity: this.newVariant.stockQuantity
    }).subscribe({
      next: () => {
        this.successMessage = 'Variant added!';
        this.errorMessage = '';
        this.newVariant.size = '';
        this.newVariant.color = '';
        this.newVariant.stockQuantity = 0;
        this.loadProducts();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add variant';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.uploadToCloudinary(file);
  }

  uploadToCloudinary(file: File): void {
    this.isUploading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);

    const url = `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CLOUD_NAME}/image/upload`;

    this.http.post<any>(url, formData).subscribe({
      next: (response) => {
        this.newImage.imageUrl = response.secure_url;
        this.isUploading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to upload image to Cloudinary';
        this.isUploading = false;
      }
    });
  }

  addImage(): void {
    if (!this.newImage.productId || !this.newImage.imageUrl) {
      this.errorMessage = 'Please upload an image first';
      return;
    }
    this.productService.addImage(this.newImage.productId, this.newImage.imageUrl, this.newImage.isPrimary).subscribe({
      next: () => {
        this.successMessage = 'Image added!';
        this.errorMessage = '';
        this.newImage.imageUrl = '';
        this.loadProducts();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to add image';
      }
    });
  }

  getSizeOptions(): string[] {
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE_SIZE'];
  }
}