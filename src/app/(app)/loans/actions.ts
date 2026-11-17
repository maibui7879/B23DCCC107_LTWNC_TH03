'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { toLoanInput, validateLoan, toLoanData, type LoanFormState } from '@/lib/loan-validate';
import { cancelLoan, reviewLoan, submitLoan } from '@/lib/loans';
export async function createLoanAction(
  _: LoanFormState,
  formData: FormData,
): Promise<LoanFormState> {
  const session = await auth();
  if (!session?.user?.email || session.user.role !== 'student') throw new Error('Không có quyền');
  const input = toLoanInput(formData);
  const errors = validateLoan(
    input,
    db.books.find((book) => book.id === Number(input.bookId)),
  );
  if (Object.keys(errors).length) return { errors, values: input };
  const result = submitLoan(session.user.email, toLoanData(input));
  if (!result.ok) return { errors: {}, values: input, message: result.message };
  revalidatePath('/loans');
  return { errors: {}, values: {}, message: 'Đã gửi yêu cầu, chờ duyệt', ok: true };
}
export async function cancelLoanAction(id: number) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Không có quyền');
  cancelLoan(session.user.email, id);
  revalidatePath('/loans');
}
export async function reviewLoanAction(id: number, status: 'approved' | 'rejected') {
  const session = await auth();
  if (session?.user?.role !== 'admin') throw new Error('Không có quyền');
  reviewLoan(id, status);
  revalidatePath('/admin');
}
