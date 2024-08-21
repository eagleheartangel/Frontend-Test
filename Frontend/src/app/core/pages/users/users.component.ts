import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  PaginatesUsersInterface,
  UserInterface,
} from '@interfaces/user.interface';
import { UserService } from '@app/core/services/user.service';
import { MessagemodalService } from '@app/core/services/messagemodal.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  messageModalService = inject(MessagemodalService);
  users: UserInterface[] = [];
  currentPage = 1;
  totalPages = 0;
  limit = 10;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      this.loadUsers();
    });
  }

  loadUsers(): void {
    this.userService.getUsers(this.currentPage, 6).subscribe({
      next: (response: PaginatesUsersInterface) => {
        this.users = response.users;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.log(error);
        this.messageModalService.modal.set({
          modal: true,
          message: error.error.error.message,
        });
      },
    });
  }

  goToPage(page: number): void {
    if (page < 1) {
      page = 1; // Asegúrate de no ir por debajo de la primera página
    } else if (page >= this.totalPages) {
      page = this.totalPages; // Asegúrate de no ir más allá de la última página
    }

    this.router.navigate(['users/page', page]);
  }
}
