import Link from 'next/link';
import { FiArrowRight, FiBookOpen, FiSearch } from 'react-icons/fi';

import { db } from '@/lib/db';

export default function Home() {
  const categories = [...new Set(db.books.map((book) => book.category))];

  return (
    <div className="page home">
      <section className="home-intro">
        <div className="home-copy">
          <p className="eyebrow">Thư viện khoa CNTT · PTIT</p>
          <h1>Tra cứu sách trong thư viện.</h1>
          <p className="lede">
            Tìm theo tên sách hoặc chuyên mục, xem số bản còn lại và gửi yêu cầu mượn khi đã đăng
            nhập.
          </p>

          <form className="home-search" action="/books" method="get">
            <label htmlFor="home-book-search">Tìm sách</label>
            <div className="home-search-row">
              <div className="home-search-input">
                <FiSearch aria-hidden="true" />
                <input
                  id="home-book-search"
                  name="q"
                  placeholder="Tên sách, ví dụ: SQL"
                  type="search"
                />
              </div>
              <button className="button primary" type="submit">
                Tìm sách
              </button>
            </div>
          </form>
        </div>

        <aside className="home-summary" aria-label="Tổng quan thư viện">
          <div className="home-summary-item">
            <strong>{db.books.length}</strong>
            <span>đầu sách</span>
          </div>
          <div className="home-summary-item">
            <strong>{categories.length}</strong>
            <span>chuyên mục</span>
          </div>
          <p>Danh mục được cập nhật theo dữ liệu thư viện hiện tại.</p>
        </aside>
      </section>

      <section className="home-catalog" aria-labelledby="home-catalog-title">
        <div className="catalog-intro">
          <div>
            <p className="eyebrow">Duyệt theo chủ đề</p>
            <h2 id="home-catalog-title">Chuyên mục sách</h2>
          </div>
          <Link className="text-link" href="/books">
            Xem tất cả sách <FiArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className="category-list">
          {categories.map((category, index) => {
            const bookCount = db.books.filter((book) => book.category === category).length;

            return (
              <Link
                className="category-row"
                href={`/books?category=${encodeURIComponent(category)}`}
                key={category}
              >
                <span className="category-index">0{index + 1}</span>
                <FiBookOpen aria-hidden="true" className="category-icon" />
                <strong>{category}</strong>
                <span className="category-count">{bookCount} đầu sách</span>
                <FiArrowRight aria-hidden="true" className="category-arrow" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
