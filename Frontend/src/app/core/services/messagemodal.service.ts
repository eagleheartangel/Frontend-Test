import { Injectable, signal } from '@angular/core';

interface MessagemodalInterface {
  modal: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessagemodalService {
  modal = signal<MessagemodalInterface>({ modal: false, message: '' });
}
