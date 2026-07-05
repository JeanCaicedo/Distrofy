import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <h1>Carrito</h1>
    @if (cart.count() === 0) {
      <p class="muted">Tu carrito está vacío. <a routerLink="/">Explora el catálogo</a>.</p>
    } @else {
      <div class="cart-list">
        @for (p of cart.items(); track p.id) {
          <div class="card cart-item">
            <div>
              <a [routerLink]="['/producto', p.id]" class="product-title">{{ p.title }}</a>
              <p class="muted">{{ p.category }}</p>
            </div>
            <div class="cart-item-right">
              <strong>{{ p.price | currency: 'USD' }}</strong>
              <button class="danger" (click)="cart.remove(p.id)">Quitar</button>
            </div>
          </div>
        }
      </div>
      <div class="card cart-summary">
        <span>Total ({{ cart.count() }} producto{{ cart.count() === 1 ? '' : 's' }})</span>
        <strong>{{ cart.total() | currency: 'USD' }}</strong>
        <a routerLink="/checkout"><button>Finalizar compra</button></a>
      </div>
    }
  `,
})
export class CartComponent {
  protected cart = inject(CartService);
}
