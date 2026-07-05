import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models';

const CART_KEY = 'distrofy_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly items = signal<Product[]>(this.load());
  readonly count = computed(() => this.items().length);
  readonly total = computed(() => this.items().reduce((sum, p) => sum + Number(p.price), 0));

  constructor() {
    // Persistir el carrito en localStorage ante cualquier cambio
    effect(() => {
      const items = this.items();
      if (this.isBrowser) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      }
    });
  }

  add(product: Product): void {
    if (this.items().some((p) => p.id === product.id)) return; // productos digitales: 1 por compra
    this.items.update((items) => [...items, product]);
  }

  remove(productId: number): void {
    this.items.update((items) => items.filter((p) => p.id !== productId));
  }

  has(productId: number): boolean {
    return this.items().some((p) => p.id === productId);
  }

  clear(): void {
    this.items.set([]);
  }

  private load(): Product[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? (JSON.parse(raw) as Product[]) : [];
    } catch {
      return [];
    }
  }
}
