'use client';
import { useActionState } from 'react';
import { signIn } from 'next-auth/react';
type State = { error?: string };
async function login(_: State, formData: FormData): Promise<State> {
  const result = await signIn('credentials', {
    email: formData.get('email'),
    password: formData.get('password'),
    redirect: false,
    callbackUrl: String(formData.get('callbackUrl') || '/loans'),
  });
  if (result?.error) return { error: 'Email hoặc mật khẩu không đúng' };
  window.location.href = result?.url ?? '/loans';
  return {};
}
export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form className="stack-form" action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? '/loans'} />
      <label className="field">
        Email
        <input name="email" type="email" required placeholder="sv01@ptit.edu.vn" />
      </label>
      <label className="field">
        Mật khẩu
        <input name="password" type="password" required />
      </label>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <button className="button primary" disabled={pending}>
        {pending ? 'Đang kiểm tra...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
