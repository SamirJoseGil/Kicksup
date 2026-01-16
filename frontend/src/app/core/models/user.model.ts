// Modelo que representa un usuario
export enum UserRole {
  Client = 1,
  Administrator = 2
}

// Modelo que representa un usuario
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  address: string;
  username: string;
  role: UserRole;
}

// Modelo para la solicitud de inicio de sesión 
export interface LoginRequest {
  username: string;
  password: string;
}

// Modelo para la solicitud de registro de usuario
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  country: string;
  state: string;
  city: string;
  phone: string;
  address: string;
  username: string;
  password: string;
  role: UserRole;
}

// Modelo para la respuesta de autenticación  
export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
}
