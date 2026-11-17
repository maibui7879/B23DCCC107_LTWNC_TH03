import { generateBooks, generateLoans } from '@/data/books';
import type { Book, Loan } from '@/types';
interface Db {
  books: Book[];
  loans: Loan[];
  nextLoanId: number;
}
const g = globalThis as typeof globalThis & { __libraryDb?: Db };
export const db: Db = (g.__libraryDb ??= {
  books: generateBooks(24),
  loans: generateLoans(37),
  nextLoanId: 38,
});
