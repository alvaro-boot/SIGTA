'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearToken, getToken, getRoleFromToken } from '@/shared/lib/auth';
import type { UserRole } from '@/shared/lib/auth';

export function AppShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const router = useRouter();

  function logout() {
    clearToken();
    router.replace('/login');
  }

  const links: { href: string; label: string; roles: UserRole[] }[] = [
    { href: '/student', label: 'Estudiante', roles: ['STUDENT'] },
    { href: '/professor', label: 'Profesor', roles: ['PROFESSOR'] },
    { href: '/admin', label: 'Admin', roles: ['ADMIN'] },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="font-semibold tracking-tight text-emerald-800">
            SIGTA
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            {links
              .filter((l) => l.roles.includes(role))
              .map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-2 py-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {l.label}
                </Link>
              ))}
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-zinc-300 px-2 py-1 text-zinc-700 hover:bg-zinc-100"
            >
              Salir
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

export function requireRoleClient(expected: UserRole): boolean {
  const t = getToken();
  if (!t) return false;
  return getRoleFromToken(t) === expected;
}
