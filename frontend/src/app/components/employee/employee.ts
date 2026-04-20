import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css',
})
export class Employee implements OnInit {
  message = signal('');
  loading = signal(true);
  error = signal('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getEmployeeData().subscribe({
      next: (res) => {
        this.message.set(res.message);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Access denied.');
        this.loading.set(false);
      },
    });
  }
}
