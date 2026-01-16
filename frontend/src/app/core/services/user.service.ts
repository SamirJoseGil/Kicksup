import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Modelo para el perfil de usuario
export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  address: string;
  profileImageUrl: string;
}

// Modelo que representa un usuario
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  age: number;
  country: string;
  state: string;
  city: string;
  phone: string;
  address: string;
  role: string;
  profileImageUrl: string;
  createdAt: string;
}

// Modelo para la solicitud de actualización de perfil
export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  address?: string;
  profileImageUrl?: string;
}

/**
 * Servicio para manejo de usuarios
 */
@Injectable({
  providedIn: 'root'
})

// Servicio para manejo de usuarios
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  // Obtiene el perfil del usuario actual
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`);
  }

  // Actualiza el perfil del usuario actual
  updateProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/profile`, request);
  }

  // Obtiene todos los usuarios
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Elimina un usuario por ID
  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  // Actualiza el rol de un usuario
  updateUserRole(id: string, role: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/role`, { role });
  }
}
