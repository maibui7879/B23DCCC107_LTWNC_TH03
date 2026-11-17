import { describe, expect, it } from 'vitest';
import { generateBooks } from '@/data/books';
import { toLoanData, toLoanInput, validateLoan } from './loan-validate';
describe('kiểm tra yêu cầu mượn', () => {
  const books = generateBooks(24);
  it('form trống báo lỗi', () => {
    const e = validateLoan(toLoanInput({}), books[0]);
    expect(e.bookId).toBe('Hãy chọn sách');
    expect(e.reason).toBeTruthy();
  });
  it('số quyển vượt tồn kho', () => {
    const e = validateLoan(
      {
        bookId: '1',
        pickupDate: '2099-12-02',
        term: '14',
        quantity: '2',
        reason: 'mượn cho bài tập dài',
      },
      books[0],
    );
    expect(e.quantity).toContain('Vượt');
  });
  it('ép kiểu dữ liệu thành công', () => {
    expect(
      toLoanData({
        bookId: '2',
        pickupDate: '2026-12-03',
        term: '14',
        quantity: '1',
        reason: '  lý do đủ dài  ',
      }).quantity,
    ).toBe(1);
  });
  it('từ chối thời hạn ngoài danh sách', () => {
    expect(
      validateLoan(
        {
          bookId: '1',
          pickupDate: '2099-12-02',
          term: '10',
          quantity: '1',
          reason: 'mượn cho bài tập dài',
        },
        books[0],
      ).term,
    ).toBe('Hãy chọn thời hạn');
  });
});
