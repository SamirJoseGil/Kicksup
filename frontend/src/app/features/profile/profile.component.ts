import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./profile.component.scss'],
  template: `
    <div class="profile-container">
      <button class="back-button" (click)="goBack()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver
      </button>
      <div class="profile-card">
        <div class="profile-header">
          <h1>Mi Perfil</h1>
          <p>Administra tu información personal</p>
        </div>

        <div class="profile-content">
          <div class="profile-avatar-section">
            <div class="avatar-container">
              @if (profileImage()) {
                <img [src]="profileImage()" alt="Foto de perfil" class="avatar-image">
              } @else {
                <div class="avatar-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                  </svg>
                </div>
              }
              <label class="avatar-upload">
                <input type="file" (change)="onImageChange($event)" accept="image/*" hidden>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
                </svg>
              </label>
            </div>
            @if (uploadError()) {
              <p class="error-message">{{ uploadError() }}</p>
            }
            @if (successMessage()) {
              <p class="success-message">{{ successMessage() }}</p>
            }
          </div>

          <form [formGroup]="profileForm" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label>Usuario</label>
                <input type="text" [value]="currentUser()?.username" disabled>
              </div>
              <div class="form-group">
                <label>Rol</label>
                <input type="text" [value]="currentUser()?.role === 'Administrator' ? 'Administrador' : 'Cliente'" disabled>
              </div>
            </div>

            <div class="form-group">
              <label>Nombre Completo</label>
              <input type="text" formControlName="fullName" placeholder="Ingresa tu nombre completo">
            </div>

            <div class="form-group">
              <label>Teléfono</label>
              <input type="tel" formControlName="phone" placeholder="+1 234 567 8900">
            </div>

            <div class="form-group">
              <label>Dirección</label>
              <textarea formControlName="address" rows="3" placeholder="Ingresa tu dirección"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-save" (click)="saveProfile()" [disabled]="loading()">
                @if (loading()) {
                  <svg class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4" />
                  </svg>
                  Guardando...
                } @else {
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z" fill="currentColor"/>
                  </svg>
                  Guardar Cambios
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  protected readonly currentUser = this.authService.currentUser;
  protected readonly profileImage = signal<string | null>(null);
  protected readonly uploadError = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected readonly profileForm = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    phone: [''],
    address: ['']
  });

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          fullName: profile.fullName,
          phone: profile.phone,
          address: profile.address
        });
        if (profile.profileImageUrl) {
          this.profileImage.set(profile.profileImageUrl);
        }
        this.loading.set(false);
      },
      error: () => {
        // Fallback to localStorage if backend fails
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          this.profileForm.patchValue(profile);
          if (profile.profileImage) {
            this.profileImage.set(profile.profileImage);
          }
        }
        this.loading.set(false);
      }
    });
  }

  protected onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.uploadError.set('La imagen no debe superar 2MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        this.uploadError.set('Solo se permiten imágenes');
        return;
      }

      this.uploadError.set(null);

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  protected saveProfile(): void {
    if (this.profileForm.invalid) {
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.successMessage.set(null);
    this.uploadError.set(null);
    
    const request = {
      fullName: this.profileForm.value.fullName,
      phone: this.profileForm.value.phone,
      address: this.profileForm.value.address,
      profileImageUrl: this.profileImage() || undefined
    };

    this.userService.updateProfile(request).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('¡Perfil actualizado correctamente!');
        // Auto-hide success message after 5 seconds
        setTimeout(() => this.successMessage.set(null), 5000);
      },
      error: (err) => {
        this.loading.set(false);
        this.uploadError.set(err.error?.error || 'Error al actualizar el perfil');
      }
    });
  }

  protected goBack(): void {
    this.location.back();
  }
}
