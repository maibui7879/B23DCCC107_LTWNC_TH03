const BUILD_TAG = 'rb-6129';
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Providers } from './providers';
export const metadata: Metadata = {
  title: { default: 'Thư viện khoa CNTT', template: '%s | Thư viện khoa' },
  description: 'Tra cứu và đăng ký mượn sách tại thư viện khoa CNTT.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <footer>
            <span>Thư viện khoa CNTT</span>
            <span>PTIT · {BUILD_TAG}</span>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
