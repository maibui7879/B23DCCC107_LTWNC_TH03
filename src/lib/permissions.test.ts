import { describe, expect, it } from 'vitest';
import { can } from './permissions';
describe('phân quyền', () => {
  it('khách chỉ xem sách', () => {
    expect(can(undefined, 'book:view')).toBe(true);
    expect(can(undefined, 'loan:create')).toBe(false);
  });
  it('sinh viên được mượn nhưng không duyệt', () => {
    expect(can('student', 'loan:create')).toBe(true);
    expect(can('student', 'loan:review')).toBe(false);
  });
  it('admin duyệt nhưng không tạo yêu cầu', () => {
    expect(can('admin', 'loan:review')).toBe(true);
    expect(can('admin', 'loan:create')).toBe(false);
  });
});
