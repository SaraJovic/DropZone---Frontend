import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';
import { Product, Category } from '../../models';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink, FormsModule, RevealOnScrollDirective],
  templateUrl: './products.html',
  styleUrl: './products.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory: number | null = null;
  selectedGender: string | null = null;
  currentPage = 0;
  totalPages = 0;
  mobileFiltersOpen = false;

  readonly genderOptions = [
    { value: 'MALE',   label: 'Men' },
    { value: 'FEMALE', label: 'Women' },
    { value: 'UNISEX', label: 'Unisex' },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.applyFilters();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.markForCheck();
      }
    });
  }

  /** Main filter driver — called by every filter change except free-text search. */
  applyFilters(): void {
    this.searchQuery = '';
    this.currentPage = 0;

    const cat = this.selectedCategory ?? undefined;
    const gen = this.selectedGender ?? undefined;

    this.productService.filterProducts(cat, gen).subscribe({
      next: (data) => {
        this.products = data;
        this.totalPages = 0;
        this.cdr.markForCheck();
      }
    });
  }

  setGender(value: string): void {
    this.selectedGender = this.selectedGender === value ? null : value;
    this.applyFilters();
  }

  setCategory(id: number): void {
    this.selectedCategory = this.selectedCategory === id ? null : id;
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedGender = null;
    this.selectedCategory = null;
    this.searchQuery = '';
    this.applyFilters();
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (!q) {
      this.applyFilters();
      return;
    }
    this.selectedGender = null;
    this.selectedCategory = null;
    this.currentPage = 0;
    this.productService.searchProducts(q).subscribe({
      next: (data) => {
        this.products = data;
        this.totalPages = 0;
        this.cdr.markForCheck();
      }
    });
  }

  get hasActiveFilters(): boolean {
    return this.selectedGender !== null || this.selectedCategory !== null || this.searchQuery.trim() !== '';
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen = !this.mobileFiltersOpen;
    this.cdr.markForCheck();
  }

  closeMobileFilters(): void {
    this.mobileFiltersOpen = false;
    this.cdr.markForCheck();
  }

  /* Pagination only works with getAllProducts (paginated endpoint).
     When filtering/searching the backend returns a flat array — pagination is hidden. */
  loadPage(): void {
    this.productService.getAllProducts(this.currentPage).subscribe({
      next: (data) => {
        this.products = data.content;
        this.totalPages = data.totalPages;
        this.cdr.markForCheck();
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPage();
    }
  }
}
