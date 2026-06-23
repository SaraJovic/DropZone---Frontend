export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  stockQuantity: number;
}

export type Gender = 'MALE' | 'FEMALE' | 'UNISEX';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  gender: Gender;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements: number;
}

export interface CartItem {
  id: number;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  imageUrl: string | null;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalPrice: number;
}

export interface AddToCartRequest {
  productVariantId: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  priceAtPurchase: number;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: number;
  user?: User;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  // Customer identity (populated by backend from Order.user)
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  // Stripe traceability (null when order has no payment yet)
  stripePaymentIntentId?: string;
}

export interface CreateOrderRequest {
  shippingAddress: string;
}

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  primaryImageUrl: string | null;
}

export interface Wishlist {
  id: number;
  items: WishlistItem[];
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  categoryId: number | null;
  gender: Gender | null;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}