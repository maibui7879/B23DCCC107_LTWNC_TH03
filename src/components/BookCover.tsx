import type { Book } from '@/types';

const TONE_BY_CATEGORY: Record<Book['category'], string> = {
  'Lập trình': 'cover-programming',
  'Mạng máy tính': 'cover-network',
  'Cơ sở dữ liệu': 'cover-database',
  'Toán rời rạc': 'cover-math',
};

export function BookCover({ book, compact = false }: { book: Book; compact?: boolean }) {
  return (
    <div
      className={`book-cover rounded-sm shadow-sm ${TONE_BY_CATEGORY[book.category]}${compact ? ' compact' : ''}`}
      aria-hidden="true"
    >
      <span className="cover-kicker">Thư viện CNTT</span>
      <strong>{book.title}</strong>
      <span className="cover-author">{book.author}</span>
      <span className="cover-rule" />
      <span className="cover-category">{book.category}</span>
    </div>
  );
}
