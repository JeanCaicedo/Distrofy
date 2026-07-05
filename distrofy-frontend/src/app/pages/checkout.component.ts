import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CartService } from '../services/cart.service';
import { PurchaseService } from '../services/purchase.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <h1>Checkout</h1>
    @if (cart.count() === 0) {
      <p class="muted">No hay nada que pagar. <a routerLink="/">Ir al catálogo</a>.</p>
    } @else {
      <div class="card checkout-card">
        <h3>Resumen</h3>
        @for (p of cart.items(); track p.id) {
          <div class="checkout-row">
            <span>{{ p.title }}</span>
            <span>{{ p.price | currency: 'USD' }}</span>
          </div>
        }
        <hr />
        <div class="checkout-row total">
          <strong>Total</strong>
          <strong>{{ cart.total() | currency: 'USD' }}</strong>
        </div>

        @if (error()) {
          <div class="alert error">{{ error() }}</div>
        }

        <button (click)="pay()" [disabled]="processing()">
          {{ processing() ? 'Procesando…' : 'Pagar (simulado)' }}
        </button>
        <p class="muted small">
          Modo demo: el pago se registra como completado sin pasarela real.
          La integración con Stripe está en el roadmap.
        </p>
      </div>
    }
  `,
})
export class CheckoutComponent {
  protected cart = inject(CartService);
  private purchases = inject(PurchaseService);
  private router = inject(Router);

  processing = signal(false);
  error = signal('');

  pay(): void {
    const items = this.cart.items();
    if (items.length === 0) return;
    this.processing.set(true);
    this.error.set('');

    forkJoin(items.map((p) => this.purchases.checkout(p.id))).subscribe({
      next: () => {
        this.cart.clear();
        this.router.navigate(['/mis-compras']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'No se pudo completar la compra');
        this.processing.set(false);
      },
    });
  }
}
