import type { Book, Term } from '@/types';
export interface LoanInput {
  bookId: string;
  pickupDate: string;
  term: string;
  quantity: string;
  reason: string;
}
export interface LoanData {
  bookId: number;
  pickupDate: string;
  term: Term;
  quantity: number;
  reason: string;
}
export type LoanErrors = Partial<Record<keyof LoanInput, string>>;
export interface LoanFormState {
  errors: LoanErrors;
  values: Partial<LoanInput>;
  message?: string;
  ok?: boolean;
}
export const today = () => new Date().toISOString().slice(0, 10);
export function toLoanInput(raw: FormData | Partial<Record<keyof LoanInput, string>>): LoanInput {
  const get = (key: keyof LoanInput) =>
    raw instanceof FormData ? String(raw.get(key) ?? '') : String(raw[key] ?? '');
  return {
    bookId: get('bookId'),
    pickupDate: get('pickupDate'),
    term: get('term'),
    quantity: get('quantity'),
    reason: get('reason'),
  };
}
export function validateLoan(input: LoanInput, book?: Book): LoanErrors {
  const errors: LoanErrors = {};
  if (!input.bookId || !book) errors.bookId = 'Hãy chọn sách';
  if (!input.pickupDate) errors.pickupDate = 'Hãy chọn ngày';
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(input.pickupDate) || input.pickupDate < today())
    errors.pickupDate = 'Ngày lấy sách không thể quá khứ';
  if (!['7', '14', '30'].includes(input.term)) errors.term = 'Hãy chọn thời hạn';
  const quantity = Number(input.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) errors.quantity = 'Số quyển phải từ 1 trở lên';
  else if (book && quantity > book.copies)
    errors.quantity = `Vượt số bản của sách (${book.copies} bản)`;
  if (input.reason.trim().length < 10) errors.reason = 'Lý do tối thiểu 10 ký tự';
  return errors;
}
export function toLoanData(input: LoanInput): LoanData {
  return {
    bookId: Number(input.bookId),
    pickupDate: input.pickupDate.trim(),
    term: Number(input.term) as Term,
    quantity: Number(input.quantity),
    reason: input.reason.trim(),
  };
}
