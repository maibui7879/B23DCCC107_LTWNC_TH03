import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="empty">
      <h1>Không tìm thấy sách</h1>
      <Link className="text-link" href="/books">
        Quay lại danh mục
      </Link>
    </div>
  );
}
