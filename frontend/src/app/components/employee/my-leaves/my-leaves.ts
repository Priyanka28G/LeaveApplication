import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Leave } from '../../../models/leave.model';
import { LeaveService } from '../../../services/leave-service';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-leaves.html',
  styleUrl: './my-leaves.css',
})
export class MyLeaves implements OnInit {
  leaves = signal<Leave[]>([]);
  loading = signal(true);
  error = signal('');

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
    this.leaveService.getMyLeaves().subscribe({
      next: (data) => {
        this.leaves.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load leaves.');
        this.loading.set(false);
      },
    });
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
    return Math.round(diff / 86400000) + 1;
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
