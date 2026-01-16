import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../core/services/user.service';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./admin-users.component.scss'],
  template: `
    <div class="admin-users-container">
      <div class="header">
        <h2>Gestión de Usuarios</h2>
        <div class="stats">
          <div class="stat-card">
            <span class="stat-label">Total Usuarios</span>
            <span class="stat-value">{{ users().length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Administradores</span>
            <span class="stat-value">{{ adminCount() }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Clientes</span>
            <span class="stat-value">{{ clientCount() }}</span>
          </div>
        </div>
      </div>

      <div class="filters">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="onFilterChange()"
          placeholder="Buscar por nombre o usuario..."
          class="search-input"
        />
        <select [(ngModel)]="filterRole" (ngModelChange)="onFilterChange()" class="filter-select">
          <option [ngValue]="null">Todos los roles</option>
          <option value="Administrator">Administradores</option>
          <option value="Client">Clientes</option>
        </select>
      </div>

      @if (loading()) {
        <div class="loading">Cargando usuarios...</div>
      } @else if (filteredUsers().length === 0) {
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
          </svg>
          <p>No se encontraron usuarios</p>
        </div>
      } @else {
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Edad</th>
                <th>Ubicación</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (user of filteredUsers(); track user.id) {
                <tr>
                  <td>
                    <div class="user-avatar">
                      @if (user.profileImageUrl) {
                        <img [src]="user.profileImageUrl" [alt]="user.username" />
                      } @else {
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                        </svg>
                      }
                    </div>
                  </td>
                  <td>
                    <span class="username">{{ user.username }}</span>
                  </td>
                  <td>{{ user.firstName }} {{ user.lastName }}</td>
                  <td>{{ user.age }} años</td>
                  <td>
                    <div class="location">
                      <span class="city">{{ user.city }}</span>
                      <span class="state">{{ user.state }}, {{ user.country }}</span>
                    </div>
                  </td>
                  <td>{{ user.phone }}</td>
                  <td>
                    <span class="role-badge" [class.admin]="user.role === 'Administrator'">
                      {{ user.role === 'Administrator' ? 'Admin' : 'Cliente' }}
                    </span>
                  </td>
                  <td>
                    <span class="date">{{ formatDate(user.createdAt) }}</span>
                  </td>
                  <td>
                    <div class="actions">
                      @if (user.role === 'Client') {
                        <button
                          (click)="promoteToAdmin(user)"
                          class="btn-action promote"
                          title="Promover a administrador"
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                          </svg>
                        </button>
                      } @else if (user.role === 'Administrator') {
                        <button
                          (click)="demoteToClient(user)"
                          class="btn-action demote"
                          title="Degradar a cliente"
                        >
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2"/>
                          </svg>
                        </button>
                      }
                      <button
                        (click)="deleteUser(user)"
                        class="btn-action delete"
                        title="Eliminar usuario"
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private readonly userService = inject(UserService);

  protected readonly users = signal<User[]>([]);
  protected readonly filteredUsers = signal<User[]>([]);
  protected readonly loading = signal(true);

  protected readonly adminCount = computed(() => 
    this.filteredUsers().filter(u => u.role === 'Administrator').length
  );
  
  protected readonly clientCount = computed(() => 
    this.filteredUsers().filter(u => u.role === 'Client').length
  );

  protected searchTerm = '';
  protected filterRole: string | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.filteredUsers.set(users);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        alert('Error al cargar los usuarios');
        this.loading.set(false);
      }
    });
  }

  protected onFilterChange(): void {
    let filtered = this.users();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.firstName.toLowerCase().includes(term) ||
        u.lastName.toLowerCase().includes(term)
      );
    }

    if (this.filterRole) {
      filtered = filtered.filter(u => u.role === this.filterRole);
    }

    this.filteredUsers.set(filtered);
  }

  protected promoteToAdmin(user: User): void {
    if (!confirm(`¿Promover a ${user.username} a administrador?`)) {
      return;
    }

    this.userService.updateUserRole(user.id, 'Administrator').subscribe({
      next: () => {
        alert('Usuario promovido a administrador exitosamente');
        this.loadUsers();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al actualizar el rol');
      }
    });
  }

  protected demoteToClient(user: User): void {
    if (!confirm(`¿Degradar a ${user.username} a cliente?`)) {
      return;
    }

    this.userService.updateUserRole(user.id, 'Client').subscribe({
      next: () => {
        alert('Usuario degradado a cliente exitosamente');
        this.loadUsers();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al actualizar el rol');
      }
    });
  }

  protected deleteUser(user: User): void {
    if (!confirm(`¿Estás seguro de eliminar a ${user.username}? Esta acción no se puede deshacer.`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        alert('Usuario eliminado exitosamente');
        this.loadUsers();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al eliminar el usuario');
      }
    });
  }

  protected formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
