'use client';

import { LoginForm } from '@/components/login-form';
import { useAuthContext } from '@/lib/auth-context';

export default function AdminLoginPage() {
  const authCtx = useAuthContext();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm login={authCtx.login} redirectTo="/dashboard" />
      </div>
    </div>
  );
}
