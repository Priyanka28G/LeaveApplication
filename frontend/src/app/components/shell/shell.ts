import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

export interface NavItem {
  label: string;
  route?: string;
  children?: { label: string; route: string }[];
}
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  role!: string | null;
  navItems!: NavItem[];
  roleBadgeClass!: string;
  roleLabel!: string;
  expandedItem: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    this.role = this.userService.getRole();
    this.navItems = this.buildNav();
    this.roleBadgeClass = `role-badge role-${this.role}`;
    this.roleLabel = this.role ? this.role.charAt(0).toUpperCase() + this.role.slice(1) : '';
  }

  private buildNav(): NavItem[] {
    const role = this.role;
    const items: NavItem[] = [{ label: 'Dashboard', route: '/app/dashboard' }];

    if (role === 'admin') {
      items.push({
        label: 'Admin Panel',
        route: '/app/admin',
        children: [{ label: 'User Management', route: '/app/user-management' }],
      });
    }
    if (role === 'manager' || role === 'admin') {
      items.push({
        label: 'Manager Panel',
        children: [{ label: 'Team Leave Requests', route: '/app/team-requests' }],
      });
    }
    if (role === 'employee' || role === 'manager' || role === 'admin') {
      items.push({
        label: 'Employee Panel',
        children: [
          { label: 'My Leaves', route: '/app/my-leaves' },
          { label: 'Apply Leave', route: '/app/apply-leave' },
        ],
      });
    }
    return items;
  }
  toggleExpand(label: string): void {
    this.expandedItem = this.expandedItem === label ? null : label;
  }
  isChildActive(children: { label: string; route: string }[]): boolean {
    return children.some((c) => this.router.url === c.route);
  }

  logout(): void {
    this.userService.clearToken();
    console.log('navigating to login page');
    this.router.navigate(['/']);
  }
}
