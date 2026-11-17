import type { Role } from '@/types';
export type Action =
  'book:view' | 'loan:create' | 'loan:view-own' | 'loan:view-all' | 'loan:review';
export function can(role: Role | undefined, action: Action) {
  if (action === 'book:view') return true;
  if (role === 'admin') return action !== 'loan:create';
  return role === 'student' && (action === 'loan:create' || action === 'loan:view-own');
}
