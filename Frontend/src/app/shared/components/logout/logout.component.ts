import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { LogoutService } from '@app/core/services/logout.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  authService = inject(AuthService);
  logoutService = inject(LogoutService);
  router = inject(Router);
  modal = this.logoutService.logoutModal;
  identity = this.authService.identity;

  onOverlayClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const contentElement = document.querySelector(
      '.modal-content'
    ) as HTMLElement;

    // Verificar si el clic fue fuera del contenido del modal
    if (contentElement && !contentElement.contains(target)) {
      this.logoutService.modal(false);
    }
  }

  onModalContentClick(event: MouseEvent) {
    event.stopPropagation();
  }

  profile() {
    this.router.navigate(['/users', this.identity()?.user?.uid]);
    this.logoutService.modal(false);
  }

  session() {
    this.authService.identity.set(undefined);
    this.authService.logout();
    this.logoutService.modal(false);
  }
}
