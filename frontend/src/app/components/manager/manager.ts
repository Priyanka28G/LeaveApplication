import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager.html',
  styleUrl: './manager.css',
})
export class Manager implements OnInit {
  message = signal('');
  loading = signal(true);
  error = signal('');

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getManagerData().subscribe({
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
