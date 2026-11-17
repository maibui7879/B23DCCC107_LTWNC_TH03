import { db } from '@/lib/db';
import type { LoanData } from '@/lib/loan-validate';
import type { LoanStatus, Role } from '@/types';
export function parseStatus(value: string | undefined): LoanStatus | undefined {
  return value === 'pending' || value === 'approved' || value === 'rejected' ? value : undefined;
}
export function listLoans(viewer: { email: string; role: Role }, status?: string, page = 1) {
  const normalized = parseStatus(status);
  const visible = db.loans.filter(
    (l) =>
      (viewer.role === 'admin' || l.userEmail === viewer.email) &&
      (!normalized || l.status === normalized),
  );
  const totalPages = Math.max(1, Math.ceil(visible.length / 10));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * 10;
  return {
    items: visible.slice(start, start + 10).map((loan) => ({
      ...loan,
      bookTitle: db.books.find((b) => b.id === loan.bookId)?.title ?? 'Không rõ',
    })),
    total: visible.length,
    page: safePage,
    totalPages,
  };
}
export function submitLoan(email: string, data: LoanData) {
  const book = db.books.find((b) => b.id === data.bookId);
  if (!book) return { ok: false as const, message: 'Sách không tồn tại' };
  const used = db.loans
    .filter(
      (l) =>
        l.bookId === data.bookId && l.pickupDate === data.pickupDate && l.status !== 'rejected',
    )
    .reduce((sum, l) => sum + l.quantity, 0);
  if (used + data.quantity > book.copies)
    return { ok: false as const, message: 'Sách đã hết bản vào ngày này' };
  const loan = { id: db.nextLoanId++, userEmail: email, status: 'pending' as const, ...data };
  db.loans.push(loan);
  return { ok: true as const, loan };
}
export function cancelLoan(email: string, id: number) {
  const index = db.loans.findIndex((l) => l.id === id);
  if (index < 0) return 'not-found';
  if (db.loans[index].userEmail !== email) return 'forbidden';
  if (db.loans[index].status !== 'pending') return 'not-pending';
  db.loans.splice(index, 1);
  return 'ok';
}
export function reviewLoan(id: number, status: 'approved' | 'rejected') {
  const loan = db.loans.find((l) => l.id === id);
  if (!loan || loan.status !== 'pending') return false;
  loan.status = status;
  return true;
}
