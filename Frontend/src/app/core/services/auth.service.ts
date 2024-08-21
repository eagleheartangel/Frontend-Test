import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserIdentityInterface } from '@interfaces/user.interface';
import { AuthInterface, SignupInterface } from '../interfaces/auth.interface';
import { url } from './globals';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  identity = signal<UserIdentityInterface | undefined>(undefined);
  url = url;

  login(user: AuthInterface): Observable<any> {
    let body = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.url}signin`, body, {
      headers,
    });
  }

  signup(user: SignupInterface): Observable<any> {
    let body = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.url}signup`, body, {
      headers,
    });
  }

  verifyCode(userid: string, code: string): Observable<any> {
    let body = JSON.stringify({ userid, code });
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.url}code`, body, {
      headers,
    });
  }

  getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity')!);
    if (identity) {
      this.identity.set(identity);
    }
    return identity;
  }

  logout() {
    localStorage.removeItem('identity');
    this.router.navigate(['/signin']);
  }
}
