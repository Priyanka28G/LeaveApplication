import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  router = inject(Router);
  message = '';
  loginFailed: boolean = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get username(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginFailed = false;
      this.userService.postLogin(this.loginForm.value).subscribe({
        next: (data) => {
          console.log(data);
          this.userService.saveToken(data.token); // ← add this line
          this.loginFailed = false;
          this.cdr.detectChanges();
          this.router.navigate(['/app/dashboard']);
        },
        error: (err) => {
          console.log('error:', err);
          this.message = err?.error?.message || 'Login failed. Please try again.';
          this.loginFailed = true;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
