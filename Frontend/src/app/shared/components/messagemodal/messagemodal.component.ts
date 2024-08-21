import { Component, effect, inject } from '@angular/core';
import { MessagemodalService } from '@app/core/services/messagemodal.service';

@Component({
  selector: 'app-messagemodal',
  standalone: true,
  imports: [],
  templateUrl: './messagemodal.component.html',
  styleUrl: './messagemodal.component.css',
})
export class MessagemodalComponent {
  messageModalService = inject(MessagemodalService);
  modal = this.messageModalService.modal;

  constructor() {
    effect(() => {
      this.messageModalService.modal();
    });
  }

  closeModal() {
    this.messageModalService.modal.update((value) => ({
      ...value,
      modal: false,
    }));
  }
}
