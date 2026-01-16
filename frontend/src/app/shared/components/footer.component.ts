import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./footer.component.scss'],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <a routerLink="/" class="brand">
              <img src="zapato.png" alt="KicksUp Logo" class="logo" />
              <span>KicksUp</span>
            </a>
            <p class="tagline">Tu tienda de zapatillas premium</p>
          </div>

          <div class="footer-links">
            <div class="link-group">
              <h4>Navegación</h4>
              <a routerLink="/products">Productos</a>
              <a routerLink="/cart">Carrito</a>
              <a routerLink="/orders">Mis Pedidos</a>
            </div>

            <div class="link-group">
              <h4>Cuenta</h4>
              <a routerLink="/auth/login">Iniciar Sesión</a>
              <a routerLink="/auth/register">Registrarse</a>
              <a routerLink="/profile">Mi Perfil</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} KicksUp. Todos los derechos reservados.</p>
          <p class="made-with">Hecho con ❤️ en Colombia</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}
