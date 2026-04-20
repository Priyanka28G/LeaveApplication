import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  role = signal<string>('');
  message = signal('');
  loading = signal(true);

  cards: { label: string; route: string; desc: string; color: string }[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const role = this.userService.getRole() ?? '';
    this.role.set(role);
    this.buildCards(role);
    this.fetchRoleData(role);
  }

  private buildCards(role: string): void {
    if (role === 'admin') {
      this.cards = [
        {
          label: 'Admin Panel',
          route: '/app/admin',
          desc: 'Manage system settings and all users.',
          color: '#fef3c7',
        },
        {
          label: 'Manager Panel',
          route: '/app/manager',
          desc: 'View manager-level data and reports.',
          color: '#dcfce7',
        },
        {
          label: 'Employee Panel',
          route: '/app/employee',
          desc: 'Access employee information and leaves.',
          color: '#eeedfe',
        },
      ];
    } else if (role === 'manager') {
      this.cards = [
        {
          label: 'Manager Panel',
          route: '/app/manager',
          desc: 'View and manage your team data.',
          color: '#dcfce7',
        },
        {
          label: 'Employee Panel',
          route: '/app/employee',
          desc: 'Access employee information and leaves.',
          color: '#eeedfe',
        },
      ];
    } else {
      this.cards = [
        {
          label: 'Employee Panel',
          route: '/app/employee',
          desc: 'View your leave status and profile.',
          color: '#eeedfe',
        },
      ];
    }
  }

  private fetchRoleData(role: string): void {
    const call$ =
      role === 'admin'
        ? this.userService.getAdminData()
        : role === 'manager'
          ? this.userService.getManagerData()
          : this.userService.getEmployeeData();

    call$.subscribe({
      next: (res) => {
        this.message.set(res.message);
        this.loading.set(false);
      },
      error: () => {
        this.message.set('Could not fetch data.');
        this.loading.set(false);
      },
    });
  }
}
