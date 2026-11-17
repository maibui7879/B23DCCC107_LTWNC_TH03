import Link from 'next/link';
export default function Forbidden() {
  return (
    <div className="empty">
      <h1>Bạn không có quyền truy cập trang này.</h1>
      <Link className="text-link" href="/">
        Về trang chủ
      </Link>
    </div>
  );
}
