import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FooterComponent } from './core/components/footer/footer.component';
import { HeaderComponent } from './core/components/header/header.component';
import { AuthService } from './core/services/auth.service';
import { MessagemodalComponent } from './shared/components/messagemodal/messagemodal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MessagemodalComponent,
    MessagemodalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  router = inject(Router);
  authService = inject(AuthService);

  constructor() {
    window.addEventListener('storage', this.checkIdentityRemoval.bind(this));
  }

  private checkIdentityRemoval(event: StorageEvent) {
    if (event.key === 'identity' && event.newValue === null) {
      this.authService.identity.set(undefined);
      this.authService.logout();
    }
  }
}
