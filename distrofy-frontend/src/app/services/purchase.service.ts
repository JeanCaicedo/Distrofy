import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Purchase } from '../models';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private http = inject(HttpClient);

  checkout(productId: number): Observable<Purchase> {
    return this.http.post<Purchase>(`${environment.apiUrl}/purchases`, { productId });
  }

  myPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${environment.apiUrl}/purchases`);
  }

  redeemDownload(token: string): Observable<{ title: string; fileUrl: string }> {
    return this.http.get<{ title: string; fileUrl: string }>(`${environment.apiUrl}/downloads/${token}`);
  }
}
