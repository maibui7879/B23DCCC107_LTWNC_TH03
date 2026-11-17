'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { FiBookOpen, FiX } from 'react-icons/fi';

import type { LoanFormState } from '@/lib/loan-validate';
import type { Book } from '@/types';

export function LoanForm({
  books,
  defaultBookId,
  action,
}: {
  books: Book[];
  defaultBookId?: string;
  action: (state: LoanFormState, formData: FormData) => Promise<LoanFormState>;
}) {
  const [isOpen, setIsOpen] = useState(Boolean(defaultBookId));
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [state, formAction, pending] = useActionState(action, {
    errors: {},
    values: { bookId: defaultBookId },
  });

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      <button className="button primary loan-trigger" type="button" onClick={() => setIsOpen(true)}>
        <FiBookOpen aria-hidden="true" />
        Gửi yêu cầu mượn
      </button>

      {isOpen && (
        <dialog
          aria-labelledby="loan-form-title"
          className="loan-modal"
          open
          onCancel={() => setIsOpen(false)}
        >
          <div className="loan-modal-panel">
            <div className="loan-modal-head">
              <div>
                <p className="eyebrow">Đăng ký mượn</p>
                <h2 id="loan-form-title">Gửi yêu cầu mượn</h2>
              </div>
              <button
                aria-label="Đóng form mượn sách"
                className="icon-button"
                onClick={() => setIsOpen(false)}
                ref={closeButtonRef}
                type="button"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>

            <form className="loan-form stack-form" action={formAction}>
              <label className="field">
                Sách
                <select name="bookId" defaultValue={state.values.bookId ?? ''}>
                  <option value="">-- Chọn sách --</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.copies} bản)
                    </option>
                  ))}
                </select>
                {state.errors.bookId && (
                  <span className="error" role="alert">
                    {state.errors.bookId}
                  </span>
                )}
              </label>

              <label className="field">
                Ngày lấy sách
                <input name="pickupDate" type="date" defaultValue={state.values.pickupDate} />
                {state.errors.pickupDate && (
                  <span className="error" role="alert">
                    {state.errors.pickupDate}
                  </span>
                )}
              </label>

              <label className="field">
                Thời hạn mượn
                <select name="term" defaultValue={state.values.term ?? ''}>
                  <option value="">-- Chọn thời hạn --</option>
                  <option value="7">7 ngày</option>
                  <option value="14">14 ngày</option>
                  <option value="30">30 ngày</option>
                </select>
                {state.errors.term && (
                  <span className="error" role="alert">
                    {state.errors.term}
                  </span>
                )}
              </label>

              <label className="field">
                Số quyển
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  defaultValue={state.values.quantity ?? '1'}
                />
                {state.errors.quantity && (
                  <span className="error" role="alert">
                    {state.errors.quantity}
                  </span>
                )}
              </label>

              <label className="field">
                Lý do mượn
                <textarea
                  name="reason"
                  defaultValue={state.values.reason}
                  placeholder="Ví dụ: phục vụ bài tập môn học"
                />
                {state.errors.reason && (
                  <span className="error" role="alert">
                    {state.errors.reason}
                  </span>
                )}
              </label>

              {state.message && (
                <p className={state.ok ? 'success' : 'error'} role="alert">
                  {state.message}
                </p>
              )}

              <button className="button primary" disabled={pending} type="submit">
                {pending ? 'Đang gửi...' : 'Xác nhận yêu cầu'}
              </button>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
}
