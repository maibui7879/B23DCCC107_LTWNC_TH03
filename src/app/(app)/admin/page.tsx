import type { Metadata } from 'next';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { formatDate, TERM_LABEL } from '@/lib/format';
import { reviewLoanAction } from '../loans/actions';
export const metadata: Metadata = { title: 'Quản trị', robots: { index: false } };
export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== 'admin') return null;
  const pending = db.loans.filter((loan) => loan.status === 'pending');
  const counts = {
    pending: db.loans.filter((l) => l.status === 'pending').length,
    approved: db.loans.filter((l) => l.status === 'approved').length,
    rejected: db.loans.filter((l) => l.status === 'rejected').length,
  };
  return (
    <div className="dash">
      <section className="section-head">
        <div>
          <p className="eyebrow">Quản trị yêu cầu</p>
          <h1>Duyệt yêu cầu mượn</h1>
        </div>
        <p>{pending.length} việc cần xử lý</p>
      </section>
      <div className="stats">
        <div className="stat">
          <span>Chờ duyệt</span>
          <strong>{counts.pending}</strong>
        </div>
        <div className="stat">
          <span>Đã duyệt</span>
          <strong>{counts.approved}</strong>
        </div>
        <div className="stat">
          <span>Từ chối</span>
          <strong>{counts.rejected}</strong>
        </div>
      </div>
      <table className="loan-table">
        <thead>
          <tr>
            <th>Sách</th>
            <th>Ngày lấy</th>
            <th>Thời hạn</th>
            <th>Người mượn</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((loan) => (
            <tr key={loan.id}>
              <td>{db.books.find((book) => book.id === loan.bookId)?.title}</td>
              <td>{formatDate(loan.pickupDate)}</td>
              <td>{TERM_LABEL[loan.term]}</td>
              <td>{loan.userEmail}</td>
              <td>
                <div className="actions">
                  <form action={reviewLoanAction.bind(null, loan.id, 'approved')}>
                    <button className="button small" type="submit">
                      Duyệt
                    </button>
                  </form>
                  <form action={reviewLoanAction.bind(null, loan.id, 'rejected')}>
                    <button className="button small danger" type="submit">
                      Từ chối
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
