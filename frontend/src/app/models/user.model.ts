export type Role = 'employee' | 'manager' | 'admin';
export interface User {
  username: String;
  email: String;
  password: String;
  role: String;
}
