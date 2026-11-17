import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiFilter } from 'react-icons/fi';

import { LoanForm } from '@/components/LoanForm';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { formatDate, STATUS_LABEL, TERM_LABEL } from '@/lib/format';
import { listLoans } from '@/lib/loans';
import { cancelLoanAction, createLoanAction } from './actions';

export const metadata: Metadata = {
  title: 'Sách đã mượn',
  robots: { index: false },
};

export default async function LoansPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; book?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) return null;

  const params = await searchParams;
  const result = listLoans(
    { email: session.user.email, role: session.user.role },
    params.status,
    Number(params.page) || 1,
  );

  return (
    <div className="dash">
      <section className="section-head">
        <div>
          <p className="eyebrow">Yêu cầu mượn của bạn</p>
          <h1>Yêu cầu mượn sách</h1>
        </div>
        <p className="results-count">{result.total} yêu cầu</p>
      </section>

      <div className="loan-toolbar">
        <form aria-label="Lọc yêu cầu mượn" className="filter-bar" method="get">
          <label className="field" htmlFor="loan-status">
            <span className="field-label">
              <FiFilter aria-hidden="true" /> Trạng thái
            </span>
            <select id="loan-status" name="status" defaultValue={params.status ?? ''}>
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </label>
          <button className="button secondary" type="submit">
            <FiFilter aria-hidden="true" /> Lọc yêu cầu
          </button>
        </form>

        {session.user.role === 'student' && (
          <LoanForm books={db.books} defaultBookId={params.book} action={createLoanAction} />
        )}
      </div>

      <table className="loan-table">
        <thead>
          <tr>
            <th>Sách</th>
            <th>Ngày lấy</th>
            <th>Thời hạn</th>
            <th>Trạng thái</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {result.items.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.bookTitle}</td>
              <td>{formatDate(loan.pickupDate)}</td>
              <td>{TERM_LABEL[loan.term]}</td>
              <td>
                <span className={`status ${loan.status}`}>{STATUS_LABEL[loan.status]}</span>
              </td>
              <td>
                {loan.status === 'pending' && (
                  <form action={cancelLoanAction.bind(null, loan.id)}>
                    <button className="button small danger" type="submit">
                      Hủy
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="Phân trang yêu cầu mượn" className="pagination">
        {result.page > 1 ? (
          <Link href={`/loans?status=${params.status ?? ''}&page=${result.page - 1}`}>
            <FiArrowLeft aria-hidden="true" /> Trước
          </Link>
        ) : (
          <span className="pagination-disabled">
            <FiArrowLeft aria-hidden="true" /> Trước
          </span>
        )}
        <span className="pagination-current">
          Trang {result.page}/{result.totalPages}
        </span>
        {result.page < result.totalPages ? (
          <Link href={`/loans?status=${params.status ?? ''}&page=${result.page + 1}`}>
            Sau <FiArrowRight aria-hidden="true" />
          </Link>
        ) : (
          <span className="pagination-disabled">
            Sau <FiArrowRight aria-hidden="true" />
          </span>
        )}
      </nav>
    </div>
  );
}
