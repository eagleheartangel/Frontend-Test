import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  letters: string = '^[A-Za-zs ]+$';
  numbers: string = '[0-9]{1,}';
  lettersNumbers: string = '^[A-Za-z0-9s ]+$';
  email: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  alphanumeric: string = '^[A-Za-z0-9s ]+$';
  alphanumericSpecialNoSpace: string = '^[A-Za-z0-9!@#$%^&*()_]+$';
}
