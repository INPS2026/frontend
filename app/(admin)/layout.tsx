import { AuthContextProvider } from '@/lib/auth-context';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthContextProvider>{children}</AuthContextProvider>
    </div>
  );
}
