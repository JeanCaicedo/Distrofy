import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-card card">
      <h2>Crear cuenta</h2>
      @if (error()) {
        <div class="alert error">{{ error() }}</div>
      }
      <form (ngSubmit)="submit()">
        <label>Nombre</label>
        <input name="name" [(ngModel)]="name" required />
        <label>Email</label>
        <input type="email" name="email" [(ngModel)]="email" required autocomplete="email" />
        <label>Contraseña (mín. 6 caracteres)</label>
        <input type="password" name="password" [(ngModel)]="password" required minlength="6" autocomplete="new-password" />
        <label>Quiero</label>
        <select name="role" [(ngModel)]="role">
          <option value="CLIENT">Comprar productos</option>
          <option value="VENDOR">Vender mis productos</option>
        </select>
        <button type="submit" [disabled]="loading()">
          {{ loading() ? 'Creando…' : 'Registrarme' }}
        </button>
      </form>
      <p class="muted">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
    </div>
  `,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  role = 'CLIENT';
  loading = signal(false);
  error = signal('');

  submit(): void {
    if (!this.name || !this.email || this.password.length < 6) {
      this.error.set('Completa todos los campos (contraseña mínimo 6 caracteres)');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.name, this.email, this.password, this.role).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error.set(err.error?.error || 'No se pudo crear la cuenta');
        this.loading.set(false);
      },
    });
  }
}
