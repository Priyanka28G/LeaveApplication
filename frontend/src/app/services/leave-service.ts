import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Leave, LeavePayload, LeaveStatusUpdate } from '../models/leave.model';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private platformId = inject(PLATFORM_ID);
  private api = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.userService.getToken()}` });
  }

  getAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.api}/leaves`, { headers: this.authHeaders() });
  }

  getMyLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${this.api}/leaves/my`, { headers: this.authHeaders() });
  }

  applyLeave(payload: LeavePayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/leaves/apply`, payload, {
      headers: this.authHeaders(),
    });
  }

  updateLeaveStatus(id: string, update: LeaveStatusUpdate): Observable<Leave> {
    return this.http.patch<Leave>(`${this.api}/leaves/${id}/status`, update, {
      headers: this.authHeaders(),
    });
  }

  deleteLeave(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/leaves/${id}`, {
      headers: this.authHeaders(),
    });
  }
}
