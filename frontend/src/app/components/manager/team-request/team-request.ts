import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { Leave } from '../../../models/leave.model';
import { LeaveService } from '../../../services/leave-service';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-team-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-request.html',
  styleUrl: './team-request.css',
})
export class TeamRequest implements OnInit {
  leaves = signal<Leave[]>([]);
  loading = signal(true);
  error = signal('');
  actionLoading = signal<string | null>(null); // tracks which leave id is being processed
  filter = signal<FilterStatus>('all');

  filtered = computed(() => {
    const f = this.filter();
    return f === 'all' ? this.leaves() : this.leaves().filter((l) => l.status === f);
  });

  stats = computed(() => {
    const all = this.leaves();
    return {
      total: all.length,
      pending: all.filter((l) => l.status === 'pending').length,
      approved: all.filter((l) => l.status === 'approved').length,
      rejected: all.filter((l) => l.status === 'rejected').length,
    };
  });

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.loading.set(true);
    this.leaveService.getAllLeaves().subscribe({
      next: (data) => {
        this.leaves.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load requests.');
        this.loading.set(false);
      },
    });
  }

  approve(id: string): void {
    this.actionLoading.set(id);
    this.leaveService.updateLeaveStatus(id, { status: 'approved' }).subscribe({
      next: (updated) => {
        this.leaves.update((list) =>
          list.map((l) => (l._id === id ? { ...l, status: updated.status } : l)),
        );
        this.actionLoading.set(null);
      },
      error: () => this.actionLoading.set(null),
    });
  }

  reject(id: string): void {
    this.actionLoading.set(id);
    this.leaveService.updateLeaveStatus(id, { status: 'rejected' }).subscribe({
      next: (updated) => {
        this.leaves.update((list) =>
          list.map((l) => (l._id === id ? { ...l, status: updated.status } : l)),
        );
        this.actionLoading.set(null);
      },
      error: () => this.actionLoading.set(null),
    });
  }

  setFilter(f: FilterStatus): void {
    this.filter.set(f as FilterStatus);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  totalDays(leave: Leave): number {
    if (leave.totalDays) return leave.totalDays;
    const diff = new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime();
    return Math.max(1, Math.round(diff / 86400000) + 1);
  }

  badgeClass(status: string | undefined): string {
    const map: Record<string, string> = {
      pending: 'badge badge-pending',
      approved: 'badge badge-approved',
      rejected: 'badge badge-rejected',
    };
    return map[status ?? ''] ?? 'badge';
  }
}
