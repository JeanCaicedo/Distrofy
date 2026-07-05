import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog.component';
import { ProductDetailComponent } from './pages/product-detail.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { CartComponent } from './pages/cart.component';
import { CheckoutComponent } from './pages/checkout.component';
import { MyPurchasesComponent } from './pages/my-purchases.component';
import { VendorComponent } from './pages/vendor.component';
import { authGuard, vendorGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: CatalogComponent, title: 'Distrofy — Catálogo' },
  { path: 'producto/:id', component: ProductDetailComponent, title: 'Distrofy — Producto' },
  { path: 'login', component: LoginComponent, title: 'Distrofy — Entrar' },
  { path: 'registro', component: RegisterComponent, title: 'Distrofy — Registro' },
  { path: 'carrito', component: CartComponent, title: 'Distrofy — Carrito' },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard], title: 'Distrofy — Checkout' },
  { path: 'mis-compras', component: MyPurchasesComponent, canActivate: [authGuard], title: 'Distrofy — Mis compras' },
  { path: 'vender', component: VendorComponent, canActivate: [vendorGuard], title: 'Distrofy — Vender' },
  { path: '**', redirectTo: '' },
];
