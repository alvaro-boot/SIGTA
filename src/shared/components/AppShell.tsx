'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();

  function logout() {
    clearToken();
    router.replace('/login');
  }

  const links: { href: string; label: string; roles: UserRole[] }[] = [
    { href: '/student', label: 'Estudiante', roles: ['STUDENT'] },
    { href: '/professor', label: 'Profesor', roles: ['PROFESSOR'] },
    { href: '/admin', label: 'Administración', roles: ['ADMIN'] },
  ];

  const visible = links.filter((l) => l.roles.includes(role));

  return (
    <div className="relative min-h-screen text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-100">
        <div className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-teal-400/12 blur-3xl" />
        <div className="absolute -right-24 top-48 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-xl py-1 pr-2 transition hover:opacity-90"
          >
            <span className="flex select-none items-baseline gap-0.5 text-xl font-black tracking-tight">
              <span className="text-emerald-600">U</span>
              <span className="text-sky-600">T</span>
              <span className="text-amber-500">P</span>
            </span>
            <span className="flex flex-col border-l border-slate-200 pl-3">
              <span className="text-sm font-bold leading-none tracking-tight text-slate-900">
                SIGTA
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Tutorías
              </span>
            </span>
          </Link>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <nav
              className="flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/90 p-1 shadow-inner"
              aria-label="Principal"
            >
              {visible.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? 'bg-white text-teal-800 shadow-md shadow-slate-900/10 ring-1 ring-slate-200/80'
                        : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}

export function requireRoleClient(expected: UserRole): boolean {
  const t = getToken();
  if (!t) return false;
  return getRoleFromToken(t) === expected;
}
