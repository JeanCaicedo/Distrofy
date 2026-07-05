import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../models';

const TOKEN_KEY = 'distrofy_token';
const USER_KEY = 'distrofy_user';

export interface SessionUser {
  email: string;
  role: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly user = signal<SessionUser | null>(this.loadUser());
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isVendor = computed(() => {
    const rol = this.user()?.role;
    return rol === 'VENDOR' || rol === 'ADMIN';
  });

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.storeSession(res)));
  }

  register(name: string, email: string, password: string, role: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, { name, email, password, role })
      .pipe(tap((res) => this.storeSession(res)));
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.user.set(null);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }

  private storeSession(res: AuthResponse): void {
    const user: SessionUser = { email: res.email, role: res.role, name: res.name };
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    this.user.set(user);
  }

  private loadUser(): SessionUser | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  }
}
