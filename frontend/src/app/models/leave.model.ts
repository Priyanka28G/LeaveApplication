export type LeaveType = 'sick' | 'casual' | 'annual';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Leave {
  _id?: string;
  username: string;
  leaveType: LeaveType;
  startDate: string; // ISO date string e.g. '2025-05-01'
  endDate: string; // ISO date string e.g. '2025-05-03'
  reason: string; // min 10 characters
  status?: LeaveStatus;
  totalDays?: number; // virtual field from backend
  createdAt?: string;
  updatedAt?: string;
}

export interface LeavePayload {
  username: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LeaveStatusUpdate {
  status: 'approved' | 'rejected';
}
