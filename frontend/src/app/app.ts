import { Component, inject, computed } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Componente raíz de la aplicación
 */
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  
  // Señal de la URL actual
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url)
    ),
    { initialValue: this.router.url }
  );

  // Verifica si la ruta actual es del panel de administración
  protected readonly isAdminRoute = computed(() => {
    const url = this.currentUrl();
    return url?.startsWith('/admin') ?? false;
  });
}
