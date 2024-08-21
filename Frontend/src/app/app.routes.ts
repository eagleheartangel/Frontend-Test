import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/pages/home/home.component').then((c) => c.HomeComponent),
    pathMatch: 'full',
  },
  {
    path: 'users/page/:page',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/pages/users/users.component').then(
        (c) => c.UsersComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'users/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/pages/user/user.component').then((c) => c.UserComponent),
    pathMatch: 'full',
  },
  {
    path: 'users/edit/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/pages/edituser/edituser.component').then(
        (c) => c.EdituserComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./core/pages/signin/signin.component').then(
        (c) => c.SigninComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./core/pages/signup/signup.component').then(
        (c) => c.SignupComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'verify',
    loadComponent: () =>
      import('./core/pages/verify/verify.component').then(
        (c) => c.VerifyComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'password',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./core/pages/password/password.component').then(
        (c) => c.PasswordComponent
      ),
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
