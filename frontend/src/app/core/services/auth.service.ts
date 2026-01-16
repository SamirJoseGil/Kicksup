import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UserRole } from '../models';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

/**
 * Servicio para manejo de autenticación
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  // Señal del usuario actual
  private readonly currentUserSignal = signal<AuthResponse | null>(null);
  public readonly currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Carga el usuario desde localStorage
   */
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as AuthResponse;
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        this.currentUserSignal.set(null);
      }
    }
  }

  /**
   * Inicia sesión
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  /**
   * Registra un nuevo usuario
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, request).pipe(
      tap(response => {
        this.setAuthData(response);
      })
    );
  }

  /**
   * Guarda los datos de autenticación
   */
  private setAuthData(response: AuthResponse): void {
    console.log('🔐 Auth Response:', response);
    console.log('🔐 Role value:', response.role);
    console.log('🔐 Is Admin?', response.role === 'Administrator');
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response));
    this.currentUserSignal.set(response);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'Administrator';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return this.currentUser()?.userId ?? null;
  }
}
