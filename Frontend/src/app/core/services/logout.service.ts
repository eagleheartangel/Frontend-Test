import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  logoutModal = signal<boolean>(false);

  modal(value: boolean) {
    this.logoutModal.set(value);
  }
}
