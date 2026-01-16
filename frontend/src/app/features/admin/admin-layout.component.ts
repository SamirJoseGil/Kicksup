import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  styleUrls: ['./admin-layout.component.scss'],
  template: `
    <div class="admin-layout">
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()">
        <button class="sidebar-toggle" (click)="toggleSidebar()">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
          </svg>
        </button>
        <div class="sidebar-header">
          <a routerLink="/" class="brand">
            <img src="zapato.png" alt="KicksUp Logo" class="logo" />
            <span>KicksUp</span>
          </a>
          <span class="admin-badge">Admin</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z" fill="currentColor"/>
            </svg>
            <span>Dashboard</span>
          </a>

          <a routerLink="/admin/products" routerLinkActive="active" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.25 2.25a.75.75 0 000 1.5H3v16.5h-.75a.75.75 0 000 1.5H21v-1.5h-.75V3.75h.75a.75.75 0 000-1.5H2.25zM6.75 19.5v-5.25a.75.75 0 01.75-.75h9a.75.75 0 01.75.75v5.25h-10.5zM7.5 6.75A.75.75 0 018.25 6h7.5a.75.75 0 01.75.75v5.25a.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V6.75z" fill="currentColor"/>
            </svg>
            <span>Productos</span>
          </a>

          <a routerLink="/admin/orders" routerLinkActive="active" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.625 3.75a2.625 2.625 0 100 5.25h12.75a2.625 2.625 0 000-5.25H5.625zM3.75 11.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 15.75a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" fill="currentColor"/>
            </svg>
            <span>Pedidos</span>
          </a>

          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
            </svg>
            <span>Usuarios</span>
          </a>
        </nav>

        <div class="sidebar-divider"></div>

        <nav class="sidebar-nav secondary">
          <a routerLink="/" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
            </svg>
            <span>Volver al Inicio</span>
          </a>
          
          <a routerLink="/profile" class="nav-item">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
            </svg>
            <span>Mi Perfil</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">
              @if (profileImage()) {
                <img [src]="profileImage()" alt="Foto de perfil" class="avatar-image" />
              } @else {
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                </svg>
              }
            </div>
            <div class="user-details">
              <span class="user-name">{{ currentUser()?.username }}</span>
              <span class="user-role">Administrador</span>
            </div>
          </div>
          
          <button (click)="logout()" class="logout-btn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.59L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main class="main-content" [class.expanded]="sidebarCollapsed()">
        <router-outlet />
      </main>
    </div>
  `
})
export class AdminLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  protected readonly currentUser = this.authService.currentUser;
  protected readonly sidebarCollapsed = signal(false);
  protected readonly profileImage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProfileImage();
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

  protected toggleSidebar(): void {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
