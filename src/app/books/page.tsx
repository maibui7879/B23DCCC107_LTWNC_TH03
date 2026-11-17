import Link from 'next/link';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';

import { BookCover } from '@/components/BookCover';
import { CATEGORIES } from '@/data/books';
import { loadBooksShift } from '@/lib/books';

export const dynamic = 'force-dynamic';

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const books = await loadBooksShift(params.category, params.q);

  return (
    <div className="page">
      <section className="section-head">
        <div>
          <p className="eyebrow">Tra cứu</p>
          <h1>Sách trong thư viện</h1>
        </div>
        <p aria-live="polite" className="results-count">
          {books.length} kết quả
        </p>
      </section>

      <form aria-label="Lọc danh mục sách" className="filter-bar" method="get">
        <label className="field field-search" htmlFor="book-search">
          <span className="field-label">
            <FiSearch aria-hidden="true" /> Tìm theo tên sách
          </span>
          <input
            id="book-search"
            name="q"
            defaultValue={params.q}
            placeholder="Ví dụ: SQL, mạng máy tính"
            type="search"
          />
        </label>

        <label className="field" htmlFor="book-category">
          <span className="field-label">
            <FiFilter aria-hidden="true" /> Chuyên mục
          </span>
          <select id="book-category" name="category" defaultValue={params.category ?? 'all'}>
            <option value="all">Tất cả chuyên mục</option>
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <button className="button primary filter-button" type="submit">
          <FiFilter aria-hidden="true" />
          Lọc danh mục
        </button>

        {(params.q || params.category) && (
          <Link className="text-link filter-reset" href="/books">
            <FiX aria-hidden="true" />
            Xóa bộ lọc
          </Link>
        )}
      </form>

      {books.length ? (
        <div aria-label="Danh sách sách" className="book-grid">
          {books.map((book) => (
            <Link className="book-card" href={`/books/${book.id}`} key={book.id}>
              <BookCover book={book} />
              <div className="book-card-body">
                <span className="book-card-category">{book.category}</span>
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <span className="availability">
                  {book.copies} {book.copies === 1 ? 'bản' : 'bản'} trong kho
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty" role="status">
          <strong>Không tìm thấy sách</strong>
          <p>Thử đổi từ khóa hoặc chọn lại chuyên mục.</p>
          <Link className="text-link" href="/books">
            Xóa bộ lọc
          </Link>
        </div>
      )}
    </div>
  );
}
