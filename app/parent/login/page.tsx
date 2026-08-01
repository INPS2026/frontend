'use client';

import { LoginForm } from '@/components/login-form';
import { useParentContext } from '@/lib/parent-context';

export default function ParentLoginPage() {
  const authCtx = useParentContext();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm login={authCtx.login} redirectTo="/parent/dashboard" />
      </div>
    </div>
  );
}
