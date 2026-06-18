import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { ProductsComponent } from './components/products/products';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';
import { OrdersComponent } from './components/orders/orders';
import { WishlistComponent } from './components/wishlist/wishlist';
import { DashboardComponent } from './components/admin/dashboard/dashboard';
import { ProductManagementComponent } from './components/admin/product-management/product-management';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [authGuard] },
  { path: 'admin', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/products', component: ProductManagementComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];