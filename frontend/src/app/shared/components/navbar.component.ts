import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./navbar.component.scss'],
  template: `
    <nav class="navbar">
      <div class="container">
        <a routerLink="/" class="brand">
          <img src="zapato.png" alt="KicksUp Logo" class="logo" />
          <span>KicksUp</span>
        </a>

        <div class="nav-links">
          <a routerLink="/products">Productos</a>
          
          @if (isAuthenticated()) {
            <a routerLink="/orders">Mis Pedidos</a>
          }
        </div>

        <div class="nav-actions">
          <button routerLink="/cart" class="cart-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" fill="currentColor"/>
            </svg>
            @if (cartItemsCount() > 0) {
              <span class="cart-badge">{{ cartItemsCount() }}</span>
            }
          </button>

          @if (isAuthenticated()) {
            <div class="user-menu">
              <button class="user-button" (click)="toggleMenu()">
                @if (profileImage()) {
                  <img [src]="profileImage()" alt="Foto de perfil" class="user-avatar" />
                } @else {
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="default-avatar">
                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                  </svg>
                }
                <span class="user-name">{{ currentUser()?.username }}</span>
                <svg class="chevron" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
                </svg>
              </button>
              
              @if (showMenu) {
                <div class="dropdown">
                  <div class="dropdown-header">
                    <div class="user-name">{{ currentUser()?.username }}</div>
                    <div class="user-role">{{ currentUser()?.role === 'Administrator' ? 'Administrador' : 'Cliente' }}</div>
                  </div>
                  <a routerLink="/profile" (click)="toggleMenu()" class="dropdown-item">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                    </svg>
                    Mi Perfil
                  </a>
                  @if (isAdmin()) {
                    <a routerLink="/admin" (click)="toggleMenu()" class="dropdown-item">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="currentColor"/>
                      </svg>
                      Panel Admin
                    </a>
                  }
                  <button (click)="logout()" class="dropdown-item logout">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/auth/login" class="login-link">Iniciar Sesión</a>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  protected readonly isAdmin = computed(() => this.authService.isAdmin());
  protected readonly currentUser = this.authService.currentUser;
  protected readonly cartItemsCount = this.cartService.totalItems;
  protected readonly profileImage = signal<string | null>(null);
  protected showMenu = false;

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.loadProfileImage();
    }
  }

  private loadProfileImage(): void {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        if (profile.profileImageUrl) {
          this.profileImage.set(profile.profileImageUrl);
        }
      }
    });
  }

  protected toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  protected logout(): void {
    this.authService.logout();
    this.showMenu = false;
    this.router.navigate(['/auth/login']);
  }
}