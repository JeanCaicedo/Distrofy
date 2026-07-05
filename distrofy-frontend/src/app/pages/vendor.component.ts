import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../models';

@Component({
  selector: 'app-vendor',
  imports: [FormsModule, CurrencyPipe],
  template: `
    <h1>Panel de vendedor</h1>

    <div class="card" style="margin-bottom: 24px">
      <h3>Publicar producto</h3>
      @if (error()) {
        <div class="alert error">{{ error() }}</div>
      }
      @if (ok()) {
        <div class="alert success">{{ ok() }}</div>
      }
      <form (ngSubmit)="crear()" class="vendor-form">
        <label>Título</label>
        <input name="title" [(ngModel)]="form.title" required />
        <label>Descripción</label>
        <textarea name="description" [(ngModel)]="form.description" rows="3"></textarea>
        <div class="form-row">
          <div>
            <label>Precio (USD)</label>
            <input type="number" name="price" [(ngModel)]="form.price" min="0" step="0.01" required />
          </div>
          <div>
            <label>Categoría</label>
            <input name="category" [(ngModel)]="form.category" placeholder="ebooks, plantillas, música…" required />
          </div>
        </div>
        <label>URL del archivo (lo que recibe el comprador)</label>
        <input name="fileUrl" [(ngModel)]="form.fileUrl" placeholder="https://…" required />
        <label>URL de la miniatura (opcional)</label>
        <input name="thumbnailUrl" [(ngModel)]="form.thumbnailUrl" placeholder="https://…" />
        <button type="submit" [disabled]="saving()">{{ saving() ? 'Publicando…' : 'Publicar' }}</button>
      </form>
    </div>

    <h3>Mis productos</h3>
    @if (mine().length === 0) {
      <p class="muted">Todavía no has publicado productos.</p>
    } @else {
      <table class="table">
        <thead>
          <tr><th>Título</th><th>Categoría</th><th>Precio</th><th>Descargas</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          @for (p of mine(); track p.id) {
            <tr>
              <td>{{ p.title }}</td>
              <td>{{ p.category }}</td>
              <td>{{ p.price | currency: 'USD' }}</td>
              <td>{{ p.downloads }}</td>
              <td>{{ isActive(p) ? 'Activo' : 'Inactivo' }}</td>
              <td><button class="danger" (click)="eliminar(p.id)">Retirar</button></td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
})
export class VendorComponent {
  private productService = inject(ProductService);

  mine = signal<Product[]>([]);
  saving = signal(false);
  error = signal('');
  ok = signal('');

  form = { title: '', description: '', price: 0, category: '', fileUrl: '', thumbnailUrl: '' };

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.productService.listMine().subscribe({
      next: (products) => this.mine.set(products),
      error: () => {},
    });
  }

  crear(): void {
    this.error.set('');
    this.ok.set('');
    if (!this.form.title || !this.form.category || !this.form.fileUrl || this.form.price < 0) {
      this.error.set('Completa título, categoría, precio y URL del archivo');
      return;
    }
    this.saving.set(true);
    this.productService.create({ ...this.form, price: Number(this.form.price) }).subscribe({
      next: () => {
        this.ok.set('Producto publicado ✔');
        this.form = { title: '', description: '', price: 0, category: '', fileUrl: '', thumbnailUrl: '' };
        this.saving.set(false);
        this.cargar();
      },
      error: (err) => {
        this.error.set(err.error?.error || 'No se pudo publicar');
        this.saving.set(false);
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Retirar este producto del catálogo?')) return;
    this.productService.delete(id).subscribe({ next: () => this.cargar() });
  }

  isActive(p: Product): boolean {
    return (p as unknown as { active?: boolean }).active !== false;
  }
}
