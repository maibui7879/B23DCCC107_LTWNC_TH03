'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FiBookOpen, FiLogIn, FiLogOut, FiShield } from 'react-icons/fi';
export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  return (
    <header>
      <Link className="brand" href="/">
        Thư viện khoa CNTT
      </Link>
      <nav>
        <Link className={pathname.startsWith('/books') ? 'active' : ''} href="/books">
          <FiBookOpen aria-hidden="true" />
          Sách
        </Link>
        {session ? (
          <>
            <Link className={pathname === '/loans' ? 'active' : ''} href="/loans">
              Sách đã mượn
            </Link>
            {role === 'admin' && (
              <Link className={pathname === '/admin' ? 'active' : ''} href="/admin">
                <FiShield aria-hidden="true" />
                Quản trị
              </Link>
            )}
            <button className="nav-button" onClick={() => signOut({ callbackUrl: '/' })}>
              <FiLogOut aria-hidden="true" />
              Đăng xuất
            </button>
            <span className="hello">{session.user?.name}</span>
          </>
        ) : (
          <button
            className="nav-button"
            onClick={() => signIn(undefined, { callbackUrl: '/loans' })}
          >
            <FiLogIn aria-hidden="true" />
            Đăng nhập
          </button>
        )}
      </nav>
    </header>
  );
}
