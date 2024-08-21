import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInterface } from '@app/core/interfaces/user.interface';
import { MessagemodalService } from '@app/core/services/messagemodal.service';
import { UserService } from '@app/core/services/user.service';
import { ValidationService } from '@app/core/services/validation.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edituser',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edituser.component.html',
  styleUrl: './edituser.component.css',
})
export class EdituserComponent {
  private unsubscribe$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);
  private messageModalService = inject(MessagemodalService);
  private validationService = inject(ValidationService);

  constructor(private formBuilder: UntypedFormBuilder) {
    effect(() => {
      this.user = this.userService.user();
    });
  }

  userId!: string;
  user = this.userService.user();

  userForm: UntypedFormGroup = this.formBuilder.group({
    nickname: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validationService.lettersNumbers),
        Validators.minLength(3),
        Validators.maxLength(20),
      ],
    ],
  });

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;
  }

  envErrormsg(value: string): string {
    const errors = this.userForm.get(value)?.errors;
    if (errors?.['required']) {
      return `${value} required`;
    } else if (errors?.['pattern']) {
      return `must be only numbers and letters`;
    } else if (errors?.['minlength']) {
      return `must be at least ${errors?.['minlength'].requiredLength} characters`;
    } else if (errors?.['maxlength']) {
      return `must be maxium ${errors?.['maxlength'].requiredLength} characters`;
    }

    return '';
  }

  isvalid(field: string) {
    return (
      this.userForm.controls[field].invalid &&
      this.userForm.controls[field].touched
    );
  }

  edit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.userService
      .editUser(this.userId, this.userForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value: UserInterface) => {
          if (value) {
            this.router.navigate(['/users', this.userId]);
            this.userService.getUserById(this.userId);
          }
        },
        error: (error) => {
          console.log(error);
          this.messageModalService.modal.update((value) => {
            return {
              ...value,
              modal: true,
              message: error.error.error.message,
            };
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
