import { describe, expect, it } from 'vitest';
import { formatDate } from './format';
describe('định dạng', () => {
  it('định dạng ngày Việt Nam', () => expect(formatDate('2026-12-02')).toBe('02/12/2026'));
  it('giữ đúng ngày đầu tháng', () => expect(formatDate('2026-01-01')).toBe('01/01/2026'));
  it('giữ đúng ngày cuối tháng', () => expect(formatDate('2026-12-31')).toBe('31/12/2026'));
});
