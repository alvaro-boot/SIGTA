'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/shared/lib/api';
import { setToken, getRoleFromToken } from '@/shared/lib/auth';
import { ui } from '@/shared/lib/ui-classes';

type View = 'login' | 'register';

export function LoginForm() {
  const router = useRouter();
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function errMsg(err: unknown): string {
    if (err instanceof ApiError) return err.getDetail();
    return 'Ha ocurrido un error';
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.access_token);
      const role = getRoleFromToken(res.access_token);
      if (role === 'STUDENT') router.replace('/student');
      else if (role === 'PROFESSOR') router.replace('/professor');
      else if (role === 'ADMIN') router.replace('/admin');
      else router.replace('/');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api<{ access_token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
      });
      setToken(res.access_token);
      const role = getRoleFromToken(res.access_token);
      if (role === 'STUDENT') router.replace('/student');
      else router.replace('/');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sigta-login-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="sigta-login-orb pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="sigta-login-orb-delay pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="sigta-login-orb pointer-events-none absolute left-1/3 top-10 h-48 w-48 rounded-full bg-emerald-300/15 blur-2xl [animation-delay:-2s]"
        aria-hidden
      />

      <div
        className="sigta-login-grid pointer-events-none absolute inset-0 origin-top"
        aria-hidden
      />

      <div
        className="sigta-login-scan pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-400/20 to-transparent"
        aria-hidden
      />

      <div className="sigta-login-card relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/25 bg-white/95 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_25px_60px_-12px_rgba(14,116,144,0.35)]">
          <div className="mb-2 flex justify-center gap-0.5 select-none">
            <span className="text-5xl font-black tracking-tight text-emerald-500 drop-shadow-[0_2px_8px_rgba(16,185,129,0.45)] transition-transform duration-300 hover:scale-105">
              U
            </span>
            <span className="text-5xl font-black tracking-tight text-sky-600 drop-shadow-[0_2px_8px_rgba(2,132,199,0.45)] transition-transform duration-300 hover:scale-105 [transition-delay:40ms]">
              T
            </span>
            <span className="text-5xl font-black tracking-tight text-amber-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.45)] transition-transform duration-300 hover:scale-105 [transition-delay:80ms]">
              P
            </span>
          </div>

          <h1 className="text-center text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
            Gestión de Tutorías
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            SIGTA · Universidad Tecnológica de Pereira
          </p>

          <div className="mt-6 flex rounded-xl border border-slate-200/90 bg-slate-100/90 p-1 text-sm font-semibold text-slate-600 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setView('login');
                setError(null);
              }}
              className={`flex-1 rounded-lg py-2.5 transition-all ${
                view === 'login'
                  ? 'bg-white text-teal-900 shadow-md ring-1 ring-slate-200/80'
                  : 'hover:text-slate-900'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setView('register');
                setError(null);
              }}
              className={`flex-1 rounded-lg py-2.5 transition-all ${
                view === 'register'
                  ? 'bg-white text-teal-900 shadow-md ring-1 ring-slate-200/80'
                  : 'hover:text-slate-900'
              }`}
            >
              Registro estudiante
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            {view === 'register'
              ? 'Solo las cuentas de estudiante pueden crearse aquí. Profesores y administradores son dados de alta por un admin.'
              : 'Profesores y administradores: use la cuenta que le asignó el sistema.'}
          </p>

          {view === 'login' ? (
            <form onSubmit={onLogin} className="mt-6 space-y-5">
              <label className="block space-y-1.5">
                <span className={ui.label}>Correo electrónico</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@correo.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={ui.field}
                />
              </label>

              <label className="block space-y-1.5">
                <span className={ui.label}>Contraseña</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={ui.field}
                />
              </label>

              {error && (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-slate-900/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-900/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                <span
                  className="sigta-login-btn-shine pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-70"
                  aria-hidden
                />
                <span className="relative flex items-center justify-center gap-2">
                  {loading && (
                    <span
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      aria-hidden
                    />
                  )}
                  {loading ? 'Verificando…' : 'Iniciar sesión'}
                </span>
              </button>
            </form>
          ) : (
            <form onSubmit={onRegister} className="mt-6 space-y-5">
              <label className="block space-y-1.5">
                <span className={ui.label}>Nombre completo</span>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  minLength={2}
                  maxLength={200}
                  placeholder="Nombre y apellidos"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={ui.field}
                />
              </label>

              <label className="block space-y-1.5">
                <span className={ui.label}>Correo electrónico</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@correo.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={ui.field}
                />
              </label>

              <label className="block space-y-1.5">
                <span className={ui.label}>Contraseña (mín. 8 caracteres)</span>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={ui.field}
                />
              </label>

              {error && (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 py-3 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-900/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                <span
                  className="sigta-login-btn-shine pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-70"
                  aria-hidden
                />
                <span className="relative flex items-center justify-center gap-2">
                  {loading && (
                    <span
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      aria-hidden
                    />
                  )}
                  {loading ? 'Creando cuenta…' : 'Crear cuenta de estudiante'}
                </span>
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-slate-400">
            Acceso seguro · sesión con token
          </p>
        </div>
      </div>
    </div>
  );
}
