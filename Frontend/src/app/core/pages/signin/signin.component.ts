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
import { MessagemodalComponent } from '@app/shared/components/messagemodal/messagemodal.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessagemodalComponent,
    RouterLink,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private unsubscribe$ = new Subject<void>();
  authService = inject(AuthService);
  router = inject(Router);
  messageModalService = inject(MessagemodalService);

  constructor(private formBuilder: UntypedFormBuilder) {}

  signinForm: UntypedFormGroup = this.formBuilder.group({
    email: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(30)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(30)],
    ],
  });

  envErrormsg(value: string): string {
    const errors = this.signinForm.get(value)?.errors;
    if (errors?.['required']) {
      return `${value} required`;
    } else if (errors?.['minlength']) {
      return `must be at least ${errors?.['minlength'].requiredLength} characters`;
    } else if (errors?.['maxlength']) {
      return `must be maxium ${errors?.['maxlength'].requiredLength} characters`;
    }

    return '';
  }

  isvalid(field: string) {
    return (
      this.signinForm.controls[field].invalid &&
      this.signinForm.controls[field].touched
    );
  }

  signin() {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }
    console.log('login');
    this.authService
      .login(this.signinForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value: SigninInterface) => {
          if (value.status === 200) {
            localStorage.setItem('identity', JSON.stringify(value.data));
            this.authService.identity.set(value.data);
            this.router.navigate(['/']);
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
