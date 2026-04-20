import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeaveService } from '../../../services/leave-service';
import { UserService } from '../../../services/user-service';
import { Router } from '@angular/router';

function dateRangeValidator(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  if (start && end && new Date(end) < new Date(start)) {
    return { dateRange: true };
  }
  return null;
}

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.css',
})
export class ApplyLeave {
  form: FormGroup;
  loading = signal(false);
  success = signal('');
  error = signal('');

  leaveTypes = ['sick', 'casual', 'annual'];
  today = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private userService: UserService,
    private router: Router,
  ) {
    this.form = this.fb.group(
      {
        leaveType: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        reason: ['', [Validators.required, Validators.minLength(10)]],
      },
      { validators: dateRangeValidator },
    );
  }

  get leaveType() {
    return this.form.get('leaveType')!;
  }
  get startDate() {
    return this.form.get('startDate')!;
  }
  get endDate() {
    return this.form.get('endDate')!;
  }
  get reason() {
    return this.form.get('reason')!;
  }

  totalDays(): number {
    const s = this.startDate.value;
    const e = this.endDate.value;
    if (!s || !e) return 0;
    const diff = new Date(e).getTime() - new Date(s).getTime();
    return Math.max(0, Math.round(diff / 86400000) + 1);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.success.set('');
    this.error.set('');

    const username = this.userService.getRole(); // replace with actual username if stored
    const payload = { ...this.form.value, username };

    this.leaveService.applyLeave(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.success.set(res.message || 'Leave applied successfully!');
        this.form.reset();
        setTimeout(() => this.router.navigate(['/app/my-leaves']), 1500);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to apply leave.');
      },
    });
  }
}
