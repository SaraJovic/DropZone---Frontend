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
  sortBy = '';
  currentPage = 0;
  totalPages = 0;
  mobileFiltersOpen = false;

  readonly genderOptions = [
    { value: 'MALE',   label: 'Men' },
    { value: 'FEMALE', label: 'Women' },
    { value: 'UNISEX', label: 'Unisex' },
  ];

  readonly sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price,asc', label: 'Price: Low to High' },
    { value: 'price,desc', label: 'Price: High to Low' },
    { value: 'name,asc', label: 'Name: A to Z' },
    { value: 'name,desc', label: 'Name: Z to A' },
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

  
  applyFilters(): void {
    this.searchQuery = '';
    this.currentPage = 0;

    const cat = this.selectedCategory ?? undefined;
    const gen = this.selectedGender ?? undefined;

    this.productService.filterProducts(cat, gen).subscribe({
      next: (data) => {
        this.products = this.applySortToList(data);
        this.totalPages = 0;
        this.cdr.markForCheck();
      }
    });
  }


  applySortToList(list: Product[]): Product[] {
    if (!this.sortBy) return list;

    const [field, direction] = this.sortBy.split(',');
    const sorted = [...list].sort((a, b) => {
      let valA: string | number = field === 'price' ? a.price : a.name.toLowerCase();
      let valB: string | number = field === 'price' ? b.price : b.name.toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  onSortChange(): void {
    if (this.hasActiveFilters) {
     
      this.products = this.applySortToList(this.products);
      this.cdr.markForCheck();
    } else {
     
      this.loadPage();
    }
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
        this.products = this.applySortToList(data);
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


  loadPage(): void {
    this.productService.getAllProducts(this.currentPage, 12, this.sortBy || undefined).subscribe({
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