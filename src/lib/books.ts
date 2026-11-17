import { db } from '@/lib/db';
export async function loadBooksShift(category?: string, q?: string) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const query = q?.trim().toLocaleLowerCase('vi');
  return db.books.filter(
    (book) =>
      (!category || category === 'all' || book.category === category) &&
      (!query || book.title.toLocaleLowerCase('vi').includes(query)),
  );
}
export async function getBook(id: number) {
  return db.books.find((book) => book.id === id);
}
