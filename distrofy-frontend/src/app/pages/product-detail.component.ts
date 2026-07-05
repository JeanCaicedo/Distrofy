import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    @if (loading()) {
      <p class="muted">Cargando producto…</p>
    } @else if (!product()) {
      <div class="alert error">Producto no encontrado.</div>
      <a routerLink="/">← Volver al catálogo</a>
    } @else {
      <a routerLink="/" class="muted">← Volver al catálogo</a>
      <div class="detail">
        <div class="detail-thumb">
          @if (product()!.thumbnailUrl) {
            <img [src]="product()!.thumbnailUrl" [alt]="product()!.title" />
          } @else {
            <div class="thumb-placeholder big">{{ product()!.title.charAt(0) }}</div>
          }
        </div>
        <div class="detail-info card">
          <span class="chip">{{ product()!.category }}</span>
          <h1>{{ product()!.title }}</h1>
          <p class="muted">
            por {{ product()!.sellerName || 'Anónimo' }} ·
            {{ product()!.downloads }} descargas ·
            publicado {{ product()!.createdAt | date: 'mediumDate' }}
          </p>
          <p class="description">{{ product()!.description }}</p>
          <div class="detail-buy">
            <strong class="price">{{ product()!.price | currency: 'USD' }}</strong>
            <button (click)="add()" [disabled]="cart.has(product()!.id)">
              {{ cart.has(product()!.id) ? 'Ya está en el carrito' : 'Agregar al carrito' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  protected cart = inject(CartService);

  product = signal<Product | null>(null);
  loading = signal(true);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getPublic(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  add(): void {
    const p = this.product();
    if (p) this.cart.add(p);
  }
}
