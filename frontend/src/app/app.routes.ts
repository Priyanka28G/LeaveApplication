import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { authGuard, roleGuard } from './auth-guard';

const adminGuard = roleGuard(['admin']);
const managerGuard = roleGuard(['manager', 'admin']);
const employeeGuard = roleGuard(['employee', 'admin', 'manager']);

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register },

  {
    path: 'app',
    loadComponent: () => import('./components/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin').then((m) => m.Admin),
        canActivate: [adminGuard],
      },
      {
        path: 'manager',
        loadComponent: () => import('./components/manager/manager').then((m) => m.Manager),
        canActivate: [managerGuard],
      },
      {
        path: 'employee',
        loadComponent: () => import('./components/employee/employee').then((m) => m.Employee),
        canActivate: [employeeGuard],
      },
      {
        path: 'my-leaves',
        loadComponent: () =>
          import('./components/employee/my-leaves/my-leaves').then((m) => m.MyLeaves),
        canActivate: [employeeGuard],
      },
      {
        path: 'apply-leave',
        loadComponent: () =>
          import('./components/employee/apply-leave/apply-leave').then((m) => m.ApplyLeave),
        canActivate: [employeeGuard],
      },
      {
        path: 'team-requests',
        loadComponent: () =>
          import('./components/manager/team-request/team-request').then((m) => m.TeamRequest),
        canActivate: [managerGuard],
      },
      {
        path: 'user-management',
        loadComponent: () =>
          import('./components/admin/user-management/user-management').then(
            (m) => m.UserManagement,
          ),
        canActivate: [adminGuard],
      },
    ],
  },

  { path: '**', redirectTo: 'app/dashboard' },
];
