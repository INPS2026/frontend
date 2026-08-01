import { ParentContextProvider } from '@/lib/parent-context';

export default function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ParentContextProvider>{children}</ParentContextProvider>
    </div>
  );
}
