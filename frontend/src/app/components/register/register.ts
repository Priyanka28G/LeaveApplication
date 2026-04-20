import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const repeatPassword = control.get('repeatPassword');

  if (!password || !repeatPassword) return null;

  if (password.value !== repeatPassword.value) {
    repeatPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // Clear only the passwordMismatch error, preserve others
    const errors = { ...repeatPassword.errors };
    delete errors['passwordMismatch'];
    repeatPassword.setErrors(Object.keys(errors).length ? errors : null);
    return null;
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private userService = inject(UserService);
  registerForm!: FormGroup;
  router = inject(Router);

  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-z0-9.]+$/),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(4)]),
        repeatPassword: new FormControl('', [Validators.required]),
        role: new FormControl('', [Validators.required]),
      },
      { validators: passwordMatchValidator },
    );
  }
  get username(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }
  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get repeatPassword(): FormControl {
    return this.registerForm.get('repeatPassword') as FormControl;
  }

  get role(): FormControl {
    return this.registerForm.get('role') as FormControl;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
      let val = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role,
      };
      this.userService.register(val).subscribe(
        (data) => {
          console.log('user data posted:', data);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        },
        (error) => {
          console.error('error', error);
        },
      );
      // Handle successful submission here (e.g. call an API service)
    } else {
      // Mark all fields as touched to trigger validation messages
      this.registerForm.markAllAsTouched();
    }
  }
}
