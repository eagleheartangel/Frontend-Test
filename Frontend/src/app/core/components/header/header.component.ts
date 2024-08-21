import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LogoutService } from '@app/core/services/logout.service';
import { AuthService } from '@services/auth.service';
import { LogoutComponent } from '../../../shared/components/logout/logout.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LogoutComponent,
    LogoutComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  logoutService = inject(LogoutService);
  router = inject(Router);
  identity = this.authService.identity;

  constructor() {
    effect(() => {
      this.identity = this.authService.identity;
    });
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  logoutModal() {
    let value = true;
    this.logoutService.logoutModal.set(true);
  }
}
