import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  router = inject(Router);
  authService = inject(AuthService);

  canActivate() {
    const identity = this.authService.getIdentity();
    if (identity && identity.token) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      this.authService.identity.set(undefined);
      return false;
    }
  }
}
