import { describe, expect, it } from 'vitest';
import { cancelLoan, listLoans, parseStatus } from './loans';
describe('nghiệp vụ khoản mượn', () => {
  it('sv01 có 27 yêu cầu chia 3 trang', () => {
    expect(listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }).total).toBe(27);
    expect(listLoans({ email: 'sv01@ptit.edu.vn', role: 'student' }, undefined, 99).page).toBe(3);
  });
  it('admin thấy toàn bộ', () =>
    expect(listLoans({ email: 'admin@ptit.edu.vn', role: 'admin' }).total).toBe(37));
  it('parse trạng thái không hợp lệ thành undefined', () =>
    expect(parseStatus('wat')).toBeUndefined());
  it('hủy khoản mượn đúng quyền', () => {
    expect(cancelLoan('sv01@ptit.edu.vn', 999)).toBe('not-found');
    expect(cancelLoan('sv02@ptit.edu.vn', 2)).toBe('forbidden');
  });
});
