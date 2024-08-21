import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '@services/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  userId!: string;
  user = this.userService.user();

  constructor() {
    effect(() => {
      this.user = this.userService.user();
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserById(this.userId);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
