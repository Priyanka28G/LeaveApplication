import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  static get() {
    throw new Error('Method not implemented.');
  }

  private api = 'http://localhost:3000/api';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  //Auth
  //post /api/auth/register
  register(user: User): Observable<User> {
    return this.http.post<User>(this.api + '/auth/register', user);
  }
  //post /api/auth/login - returns jwt
  postLogin(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.api + '/auth/login', user);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.api + `/users/${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.api + '/users/all');
  }

  updateUserRole(id: string, role: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `${this.api}/users/${id}/role`,
      { role },
      { headers: this.authHeaders() },
    );
  }

  // ── Token helpers ───────────────────────────────────

  saveToken(token: string): void {
    if (this.isBrowser()) localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  clearToken(): void {
    if (this.isBrowser()) localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  getRole(): 'admin' | 'manager' | 'employee' | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const payload = JSON.parse(json);
      return payload.role ?? null;
    } catch {
      return null;
    }
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` });
  }

  // ── Protected user routes ───────────────────────────

  /** GET /api/users/admin  — admin only */
  getAdminData(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.api}/users/admin`, {
      headers: this.authHeaders(),
    });
  }

  /** GET /api/users/manager  — manager + admin */
  getManagerData(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.api}/users/manager`, {
      headers: this.authHeaders(),
    });
  }

  /** GET /api/users/employee  — employee + admin */
  getEmployeeData(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.api}/users/employee`, {
      headers: this.authHeaders(),
    });
  }
}
