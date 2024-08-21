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
  selector: 'app-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessagemodalComponent,
    RouterLink,
  ],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css',
})
export class VerifyComponent {
  private unsubscribe$ = new Subject<void>();
  authService = inject(AuthService);
  router = inject(Router);
  messageModalService = inject(MessagemodalService);
  validationService = inject(ValidationService);
  identity = this.authService.identity;
  code: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder) {}

  codeForm: UntypedFormGroup = this.formBuilder.group({
    code: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validationService.numbers),
        Validators.minLength(6),
        Validators.maxLength(6),
      ],
    ],
  });

  envErrormsg(value: string): string {
    const errors = this.codeForm.get(value)?.errors;
    if (errors?.['required']) {
      return `${value} required`;
    } else if (errors?.['pattern']) {
      return 'only numbers accepted';
    } else if (errors?.['minlength']) {
      return `must be at least ${errors?.['minlength'].requiredLength} characters`;
    } else if (errors?.['maxlength']) {
      return `must be maxium ${errors?.['maxlength'].requiredLength} characters`;
    }

    return '';
  }

  isvalid(field: string) {
    return (
      this.codeForm.controls[field].invalid &&
      this.codeForm.controls[field].touched
    );
  }

  verifyCode() {
    if (this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      return;
    }
    this.authService
      .verifyCode(this.identity()?.user?.uid!, this.codeForm.value.code)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value: SigninInterface) => {
          if (value.status === 200) {
            localStorage.setItem('identity', JSON.stringify(value.data));
            this.authService.identity.set(value.data);
            this.messageModalService.modal.set({
              modal: true,
              message: `You have successfully registered!`,
            });
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
