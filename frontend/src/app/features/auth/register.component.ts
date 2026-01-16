import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models';
import { CommonModule } from '@angular/common';

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrls: ['./register.component.scss'],
  template: `
    <div class="register-container">
      <div class="register-card">
        <h1>Crear Cuenta</h1>
        <p class="subtitle">Únete a KicksUp</p>

        @if (errorMessage()) {
          <div class="error-message">{{ errorMessage() }}</div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Nombres *</label>
              <input id="firstName" type="text" formControlName="firstName" placeholder="Juan" />
            </div>

            <div class="form-group">
              <label for="lastName">Apellidos *</label>
              <input id="lastName" type="text" formControlName="lastName" placeholder="Pérez" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="age">Edad *</label>
              <input id="age" type="number" formControlName="age" placeholder="25" />
            </div>

            <div class="form-group">
              <label for="dateOfBirth">Fecha de Nacimiento *</label>
              <input id="dateOfBirth" type="date" formControlName="dateOfBirth" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="country">País *</label>
              <input id="country" type="text" formControlName="country" placeholder="Colombia" />
            </div>

            <div class="form-group">
              <label for="state">Departamento *</label>
              <input id="state" type="text" formControlName="state" placeholder="Antioquia" />
            </div>
          </div>

          <div class="form-group">
            <label for="city">Ciudad *</label>
            <input id="city" type="text" formControlName="city" placeholder="Medellín" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phone">Celular *</label>
              <input id="phone" type="tel" formControlName="phone" placeholder="3001234567" />
            </div>

            <div class="form-group">
              <label for="address">Dirección *</label>
              <input id="address" type="text" formControlName="address" placeholder="Calle 123 #45-67" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="username">Usuario *</label>
              <input id="username" type="text" formControlName="username" placeholder="usuario123" />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña *</label>
            <div class="password-input">
              <input 
                id="password" 
                [type]="showPassword() ? 'text' : 'password'" 
                formControlName="password" 
                placeholder="••••••••" 
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
            @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
              <small class="error-text">La contraseña debe tener al menos 6 caracteres</small>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña *</label>
            <div class="password-input">
              <input 
                id="confirmPassword" 
                [type]="showConfirmPassword() ? 'text' : 'password'" 
                formControlName="confirmPassword" 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                class="toggle-password"
                (click)="showConfirmPassword.set(!showConfirmPassword())"
                [attr.aria-label]="showConfirmPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                @if (showConfirmPassword()) {
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
            @if (registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched) {
              <small class="error-text">Las contraseñas no coinciden</small>
            }
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="registerForm.invalid || loading()"
          >
            @if (loading()) {
              Cargando...
            } @else {
              Registrarse
            }
          </button>

          <p class="login-link">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login">Inicia sesión aquí</a>
          </p>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);

  protected readonly registerForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    age: [0, [Validators.required, Validators.min(1)]],
    dateOfBirth: ['', Validators.required],
    country: ['', Validators.required],
    state: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  protected onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const formValue = this.registerForm.getRawValue();
    const { confirmPassword, ...requestData } = formValue;
    const request = {
      ...requestData,
      role: UserRole.Client
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error.error?.error || 'Error al registrarse');
      }
    });
  }
}
