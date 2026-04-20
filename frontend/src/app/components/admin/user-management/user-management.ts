import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user-service';

export type Role = 'admin' | 'manager' | 'employee';

export interface UserRecord {
  _id: string;
  username: string;
  email: string;
  role: Role;
  createdAt?: string;
}

type FilterRole = 'all' | Role;

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  users = signal<UserRecord[]>([]);
  loading = signal(true);
  error = signal('');
  filterRole = signal<FilterRole>('all');
  searchQuery = signal('');
  actionLoading = signal<string | null>(null);

  // Role assignment modal
  showModal = signal(false);
  selectedUser = signal<UserRecord | null>(null);
  roleForm: FormGroup;
  roleUpdateSuccess = signal('');
  roleUpdateError = signal('');

  roles: Role[] = ['admin', 'manager', 'employee'];

  filtered = computed(() => {
    let list = this.users();
    const role = this.filterRole();
    const q = this.searchQuery().toLowerCase();
    if (role !== 'all') list = list.filter((u) => u.role === role);
    if (q)
      list = list.filter(
        (u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    return list;
  });

  stats = computed(() => {
    const all = this.users();
    return {
      total: all.length,
      admins: all.filter((u) => u.role === 'admin').length,
      managers: all.filter((u) => u.role === 'manager').length,
      employees: all.filter((u) => u.role === 'employee').length,
    };
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.roleForm = this.fb.group({
      role: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set('');
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data as unknown as UserRecord[]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load users.');
        this.loading.set(false);
      },
    });
  }

  setFilter(role: string): void {
    this.filterRole.set(role as FilterRole);
  }
  setSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  openRoleModal(user: UserRecord): void {
    this.selectedUser.set(user);
    this.roleForm.patchValue({ role: user.role });
    this.roleUpdateSuccess.set('');
    this.roleUpdateError.set('');
    this.showModal.set(true);
  }
  get currentUser() {
    return this.selectedUser();
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedUser.set(null);
  }

  submitRoleUpdate(): void {
    if (this.roleForm.invalid) return;
    const user = this.selectedUser();
    if (!user) return;

    this.actionLoading.set(user._id);
    this.roleUpdateSuccess.set('');
    this.roleUpdateError.set('');

    this.userService.updateUserRole(user._id, this.roleForm.value.role).subscribe({
      next: () => {
        this.users.update((list) =>
          list.map((u) => (u._id === user._id ? { ...u, role: this.roleForm.value.role } : u)),
        );
        this.roleUpdateSuccess.set(`Role updated to "${this.roleForm.value.role}" successfully.`);
        this.actionLoading.set(null);
        setTimeout(() => this.closeModal(), 1200);
      },
      error: (err) => {
        this.roleUpdateError.set(err?.error?.message || 'Failed to update role.');
        this.actionLoading.set(null);
      },
    });
  }

  roleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      admin: 'badge badge-admin',
      manager: 'badge badge-manager',
      employee: 'badge badge-employee',
    };
    return map[role] ?? 'badge';
  }

  avatarColor(role: string): string {
    const map: Record<string, string> = {
      admin: 'avatar-admin',
      manager: 'avatar-manager',
      employee: 'avatar-employee',
    };
    return map[role] ?? '';
  }

  formatDate(date?: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
