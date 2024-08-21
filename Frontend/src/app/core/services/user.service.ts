import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  PaginatedUserResponseInterface,
  PaginatesUsersInterface,
  UserInterface,
} from '@interfaces/user.interface';
import { url } from './globals';
import { catchError, map, Observable, of, ReplaySubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new ReplaySubject<UserInterface>(1);
  private currentUserId: string | null = null;
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  url = url;

  user = signal<UserInterface | undefined>(undefined);

  getUsers(
    page: number,
    limit: number = 6
  ): Observable<PaginatesUsersInterface> {
    const identity = JSON.parse(localStorage.getItem('identity')!);

    if (!identity.token) {
      throw new Error('Token is missing or invalid');
    }

    const headers = new HttpHeaders({
      'eagle-token': identity.token,
      'Content-Type': 'application/json',
    });

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get<PaginatedUserResponseInterface>(`${this.url}users`, {
        headers,
        params,
      })
      .pipe(
        map((res: PaginatedUserResponseInterface) => {
          return res.data;
        })
      );
  }

  getUserById(id: string) {
    const identity = JSON.parse(localStorage.getItem('identity')!);
    const headers = new HttpHeaders({
      'eagle-token': identity.token,
      'Content-Type': 'application/json',
    });

    this.http
      .get<UserInterface>(`${this.url}user/${id}`, { headers })
      .pipe(
        map((res: any) => res.data),
        map((user: UserInterface) => {
          this.user.set(user);
          return user;
        }),
        catchError(() => {
          return of({} as UserInterface);
        })
      )
      .subscribe();
  }

  editUser(id: string, user: UserInterface): Observable<UserInterface> {
    const identity = JSON.parse(localStorage.getItem('identity')!);
    const headers = new HttpHeaders({
      'eagle-token': identity.token,
      'Content-Type': 'application/json',
    });

    return this.http
      .put<UserInterface>(`${this.url}user/${id}`, user, { headers })
      .pipe(
        map((res: any) => res.data),
        catchError(() => {
          // Handle error and provide a default value or rethrow
          return of({} as UserInterface); // Handle default value properly
        })
      );
  }
}
