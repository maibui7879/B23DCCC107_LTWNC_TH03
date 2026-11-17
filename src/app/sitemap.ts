import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'http://localhost:3000', lastModified: new Date() },
    { url: 'http://localhost:3000/books', lastModified: new Date() },
    ...Array.from({ length: 24 }, (_, i) => ({
      url: `http://localhost:3000/books/${i + 1}`,
      lastModified: new Date(),
    })),
  ];
}
