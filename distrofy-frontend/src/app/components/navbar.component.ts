import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="brand">Distrofy</a>
      <div class="links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Catálogo</a>
        @if (auth.isVendor()) {
          <a routerLink="/vender" routerLinkActive="active">Vender</a>
        }
        @if (auth.isAuthenticated()) {
          <a routerLink="/mis-compras" routerLinkActive="active">Mis compras</a>
        }
        <a routerLink="/carrito" routerLinkActive="active" class="cart-link">
          Carrito
          @if (cart.count() > 0) {
            <span class="badge">{{ cart.count() }}</span>
          }
        </a>
        @if (auth.isAuthenticated()) {
          <span class="user">{{ auth.user()?.name }}</span>
          <button class="btn-link" (click)="logout()">Salir</button>
        } @else {
          <a routerLink="/login" routerLinkActive="active">Entrar</a>
        }
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  protected auth = inject(AuthService);
  protected cart = inject(CartService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
