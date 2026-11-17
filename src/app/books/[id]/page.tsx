import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';
import { BookCover } from '@/components/BookCover';
import { getBook } from '@/lib/books';

export const revalidate = 60;

export async function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const book = await getBook(Number((await params).id));

  return book
    ? {
        title: `${book.title} - ${book.author}`,
        description: `Sách ${book.category}, thư viện có ${book.copies} bản.`,
      }
    : {};
}

export default async function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const book = await getBook(Number((await params).id));

  if (!book) notFound();

  return (
    <div className="book-detail">
      <p className="eyebrow">Chi tiết đầu sách · #{book.id}</p>
      <div className="book-detail-layout">
        <BookCover book={book} />
        <div>
          <h1>{book.title}</h1>
          <div className="book-meta">
            <div>
              <span>Tác giả</span>
              <strong>{book.author}</strong>
            </div>
            <div>
              <span>Chuyên mục</span>
              <strong>{book.category}</strong>
            </div>
            <div>
              <span>Kho hiện có</span>
              <strong>{book.copies} bản</strong>
            </div>
          </div>
          <p>Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')}</p>
          <Link
            className="button primary inline-flex items-center gap-2"
            href={`/loans?book=${book.id}`}
          >
            Gửi yêu cầu mượn <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
