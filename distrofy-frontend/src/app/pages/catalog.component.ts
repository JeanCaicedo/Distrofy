import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="page-header">
      <h1>Catálogo</h1>
      <input
        class="search"
        placeholder="Buscar productos…"
        [value]="query()"
        (input)="query.set($any($event.target).value)"
      />
    </div>

    @if (loading()) {
      <p class="muted">Cargando catálogo…</p>
    } @else if (error()) {
      <div class="alert error">{{ error() }}</div>
    } @else if (filtered().length === 0) {
      <p class="muted">No hay productos publicados todavía.</p>
    } @else {
      <div class="grid">
        @for (p of filtered(); track p.id) {
          <div class="card product-card">
            <a [routerLink]="['/producto', p.id]" class="thumb">
              @if (p.thumbnailUrl) {
                <img [src]="p.thumbnailUrl" [alt]="p.title" />
              } @else {
                <div class="thumb-placeholder">{{ p.title.charAt(0) }}</div>
              }
            </a>
            <div class="product-body">
              <span class="chip">{{ p.category }}</span>
              <a [routerLink]="['/producto', p.id]" class="product-title">{{ p.title }}</a>
              <p class="muted seller">por {{ p.sellerName || 'Anónimo' }}</p>
              <div class="product-footer">
                <strong>{{ p.price | currency: 'USD' }}</strong>
                <button (click)="add(p)" [disabled]="cart.has(p.id)">
                  {{ cart.has(p.id) ? 'En el carrito' : 'Agregar' }}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class CatalogComponent {
  private productService = inject(ProductService);
  protected cart = inject(CartService);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');
  query = signal('');

  filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.products();
    return this.products().filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    );
  });

  constructor() {
    this.productService.listPublic().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el catálogo. ¿Está corriendo el backend?');
        this.loading.set(false);
      },
    });
  }

  add(p: Product): void {
    this.cart.add(p);
  }
}
