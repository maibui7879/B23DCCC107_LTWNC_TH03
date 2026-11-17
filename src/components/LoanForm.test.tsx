import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { LoanFormState } from '@/lib/loan-validate';

import { LoanForm } from './LoanForm';

const books = [
  {
    id: 1,
    title: 'Lập trình C căn bản',
    author: 'A',
    category: 'Lập trình' as const,
    copies: 1,
  },
];

describe('biểu mẫu mượn sách', () => {
  it('hiển thị lỗi trả về dưới trường tương ứng', async () => {
    const action = vi.fn(async (): Promise<LoanFormState> => ({
      errors: { bookId: 'Hãy chọn sách' },
      values: {},
    }));
    const user = userEvent.setup();

    render(<LoanForm books={books} action={action} />);
    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu mượn' }));
    await user.click(screen.getByRole('button', { name: 'Xác nhận yêu cầu' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Hãy chọn sách');
  });

  it('điền sẵn sách từ liên kết chi tiết', () => {
    render(
      <LoanForm
        books={books}
        defaultBookId="1"
        action={vi.fn(async () => ({ errors: {}, values: {} }))}
      />,
    );

    expect(screen.getByLabelText('Sách')).toHaveValue('1');
  });

  it('có đầy đủ trường nhập liệu trong modal', async () => {
    const user = userEvent.setup();
    const action = vi.fn(async (): Promise<LoanFormState> => ({
      errors: {},
      values: {},
      message: 'Đã gửi yêu cầu',
    }));

    render(<LoanForm books={books} action={action} />);
    await user.click(screen.getByRole('button', { name: 'Gửi yêu cầu mượn' }));
    await user.type(screen.getByLabelText('Lý do mượn'), 'Phục vụ bài tập môn học');

    expect(screen.getByRole('button', { name: 'Xác nhận yêu cầu' })).toBeInTheDocument();
  });
});
