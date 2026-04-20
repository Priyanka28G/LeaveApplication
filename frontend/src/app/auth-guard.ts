import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from './services/user-service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  if (!userService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
export const roleGuard =
  (roles: string[]): CanActivateFn =>
  () => {
    const userService = inject(UserService);
    const router = inject(Router);
    if (!userService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }
    if (!roles.includes(userService.getRole()!)) {
      router.navigate(['/app/dashboard']);
      return false;
    }
    return true;
  };
