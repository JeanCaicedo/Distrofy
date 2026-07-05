import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-card card">
      <h2>Iniciar sesión</h2>
      @if (error()) {
        <div class="alert error">{{ error() }}</div>
      }
      <form (ngSubmit)="submit()">
        <label>Email</label>
        <input type="email" name="email" [(ngModel)]="email" required autocomplete="email" />
        <label>Contraseña</label>
        <input type="password" name="password" [(ngModel)]="password" required autocomplete="current-password" />
        <button type="submit" [disabled]="loading()">
          {{ loading() ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>
      <p class="muted">¿No tienes cuenta? <a routerLink="/registro">Regístrate</a></p>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  submit(): void {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error.set(err.error?.error || 'No se pudo iniciar sesión');
        this.loading.set(false);
      },
    });
  }
}
