import { LoginForm } from './LoginForm';
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="auth-shell">
      <p className="eyebrow">Truy cập thư viện</p>
      <h1>Đăng nhập.</h1>
      <p className="lede">
        Dùng tài khoản sinh viên hoặc quản trị viên được cung cấp trong đề bài.
      </p>
      <LoginForm callbackUrl={params.callbackUrl} />
    </div>
  );
}
