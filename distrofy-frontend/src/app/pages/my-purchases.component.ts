import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PurchaseService } from '../services/purchase.service';
import { Purchase } from '../models';

@Component({
  selector: 'app-my-purchases',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    <h1>Mis compras</h1>
    @if (loading()) {
      <p class="muted">Cargando…</p>
    } @else if (purchases().length === 0) {
      <p class="muted">Aún no has comprado nada. <a routerLink="/">Ver catálogo</a>.</p>
    } @else {
      @if (error()) {
        <div class="alert error">{{ error() }}</div>
      }
      <div class="cart-list">
        @for (c of purchases(); track c.id) {
          <div class="card cart-item">
            <div>
              <a [routerLink]="['/producto', c.productId]" class="product-title">{{ c.productTitle }}</a>
              <p class="muted">
                {{ c.purchasedAt | date: 'medium' }} ·
                {{ c.amount | currency: 'USD' }} ·
                descarga válida hasta {{ c.downloadExpiry | date: 'mediumDate' }}
              </p>
            </div>
            <button (click)="download(c)" [disabled]="downloading() === c.id">
              {{ downloading() === c.id ? 'Preparando…' : 'Descargar' }}
            </button>
          </div>
        }
      </div>
    }
  `,
})
export class MyPurchasesComponent {
  private purchaseService = inject(PurchaseService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  purchases = signal<Purchase[]>([]);
  loading = signal(true);
  error = signal('');
  downloading = signal<number | null>(null);

  constructor() {
    this.purchaseService.myPurchases().subscribe({
      next: (purchases) => {
        this.purchases.set(purchases);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  download(purchase: Purchase): void {
    this.downloading.set(purchase.id);
    this.error.set('');
    this.purchaseService.redeemDownload(purchase.downloadToken).subscribe({
      next: ({ fileUrl }) => {
        if (this.isBrowser) window.open(fileUrl, '_blank');
        this.downloading.set(null);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'No se pudo descargar');
        this.downloading.set(null);
      },
    });
  }
}
