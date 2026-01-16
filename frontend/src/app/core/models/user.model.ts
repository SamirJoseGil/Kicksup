export enum UserRole {
  Client = 1,
  Administrator = 2
}

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

export interface LoginRequest {
  username: string;
  password: string;
}

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

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
}
