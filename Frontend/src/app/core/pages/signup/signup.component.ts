import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { SigninInterface } from '@app/core/interfaces/user.interface';
import { AuthService } from '@app/core/services/auth.service';
import { MessagemodalService } from '@app/core/services/messagemodal.service';
import { ValidationService } from '@app/core/services/validation.service';
import { MessagemodalComponent } from '@app/shared/components/messagemodal/messagemodal.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessagemodalComponent,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private unsubscribe$ = new Subject<void>();
  authService = inject(AuthService);
  router = inject(Router);
  messageModalService = inject(MessagemodalService);
  validationService = inject(ValidationService);
  identity = this.authService.identity;
  code: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder) {}

  signupForm: UntypedFormGroup = this.formBuilder.group({
    nickname: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validationService.lettersNumbers),
        Validators.minLength(5),
        Validators.maxLength(30),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(this.validationService.email),
        Validators.minLength(5),
        Validators.maxLength(30),
      ],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(30)],
    ],
  });

  envErrormsg(value: string): string {
    const errors = this.signupForm.get(value)?.errors;
    if (errors?.['required']) {
      return `${value} required`;
    } else if (errors?.['email']) {
      return 'invalid email format';
    } else if (errors?.['pattern']) {
      return 'invalid format';
    } else if (errors?.['minlength']) {
      return `must be at least ${errors?.['minlength'].requiredLength} characters`;
    } else if (errors?.['maxlength']) {
      return `must be maxium ${errors?.['maxlength'].requiredLength} characters`;
    }

    return '';
  }

  isvalid(field: string) {
    return (
      this.signupForm.controls[field].invalid &&
      this.signupForm.controls[field].touched
    );
  }

  signup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.authService
      .signup(this.signupForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value: SigninInterface) => {
          if (value.status === 200) {
            this.authService.identity.set(value.data);
            this.router.navigate(['/verify']);
          }
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
