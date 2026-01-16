import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models';
import { CommonModule } from '@angular/common';

/**
 * Componente de inicio de sesión
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrls: ['./login.component.scss'],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Iniciar Sesión</h1>
        <p class="subtitle">Bienvenido a KicksUp</p>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              placeholder="Ingresa tu usuario"
            />
            @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
              <span class="error">El usuario es requerido</span>
            }
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-input">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Ingresa tu contraseña"
              />
              <button 
                type="button" 
                class="toggle-password"
                (click)="showPassword.set(!showPassword())"
                [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                @if (showPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                }
              </button>
            </div>
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <span class="error">La contraseña es requerida</span>
            }
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="loginForm.invalid || loading()"
          >
            @if (loading()) {
              Cargando...
            } @else {
              Iniciar Sesión
            }
          </button>

          <p class="register-link">
            ¿No tienes cuenta?
            <a routerLink="/auth/register">Regístrate aquí</a>
          </p>

          <div class="demo-credentials">
            <p><strong>Credenciales de prueba:</strong></p>
            <p>Admin - Usuario: <code>admin</code> / Contraseña: <code>Admin123!</code></p>
            <p>Cliente - Usuario: <code>cliente</code> / Contraseña: <code>Client123!</code></p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected readonly loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  protected onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.role === 'Administrator') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.error || 'Error al iniciar sesión');
      }
    });
  }
}
